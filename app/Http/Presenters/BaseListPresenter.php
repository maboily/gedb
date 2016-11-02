<?php namespace GEDB\Http\Presenters;

/*
 * {
 *      'metadata': {
 *          'columns': {
 *              'username': {
 *                  'sortable': true
 *              },
 *              'last_login': {
 *                  'sortable': true
 *              }
 *          }
 *          'currentPage': 1,
 *          'elementsPerPage': 50
 *          'total': 1200,
 *          'totalPages': 60,
 *      }
 *      'data': [
 *          ...
 *      ]
 * }
 */

use Exception;
use Illuminate\Database\Eloquent\Collection;
use GEDB\Services\Authorization;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

abstract class BaseListPresenter {
    public $availableFilters = [];
    public $availableGroups = [];
    public $availableSorts = [];
    public $baseColumnDescriptions = [];
    public $columnDescriptions = [];
    public $deleteViewPermission = '';
    public $modelClassName = '';
    public $filterable = false;
    public $forcedPagination = true;
    public $groupable = false;
    public $showDeleted = true;
    public $sortable = true;
    public $validPagination = [5, 10, 25, 50];

    protected function getBaseQuery() {
        $modelInstance = new $this->modelClassName;
        return $modelInstance->getAsList();
    }

    public static function present()
    {
        $selfInstance = new static();
        return $selfInstance->performPresent();
    }

    protected function performPresent() {
        // Gets request data
        $elementsPerPage = Request::get('elementsPerPage');
        $groupBy = Request::get('groupBy');
        $targetPage = Request::get('page');
        $orderBy = Request::get('orderBy');
        $orderDirection = Request::get('orderDirection');
        $groupOrderDirection = Request::get('groupOrderDirection');
        $paginate = Request::get('paginate') == "1";
        $filtersCount = Request::get('filtersCount');

        // Gets pagination parameters
        $applyPagination = true;
        if (!$paginate && !$this->forcedPagination) {
            // We check if pagination has been requested by the user to be off, and if it can be disabled
            $applyPagination = false;
        }

        // Gets grouping parameters
        $applyGrouping = false;
        if ($groupBy != "") {
            $applyGrouping = true;
        }

        // Initializes queries
        $filteredQuery = $this->getBaseQuery();

        // Processes query (show deleted results and filters)
        if ($this->deleteViewPermission != '' && Authorization::hasPermission($this->deleteViewPermission)) {
            $this->appendDeletedResults($filteredQuery);
        }
        if ($this->filterable) { $this->applyFilters($filteredQuery, $filtersCount); }

        // We count the total results before applying ordering and pagination
        $totalResults = $this->countTotalResults($filteredQuery);

        if ($applyGrouping) { $this->orderQuery($filteredQuery, $groupBy, $groupOrderDirection); }
        if ($this->sortable) { $this->orderQuery($filteredQuery, $orderBy, $orderDirection); }

        // Paginates query
        if ($applyPagination) { $this->paginateQuery($filteredQuery, $elementsPerPage, $targetPage); }

        // Compiles data
        $data = $filteredQuery->get();

        // Groups data
        if ($applyGrouping) { $this->groupResults($data, $groupBy); }

        // Compiles metadata
        $metadata = [];
        $metadata['total'] = (int)$totalResults;
        if ($applyPagination) {
            $metadata['currentPage'] = (int)$targetPage;
            $metadata['totalPages'] = ceil($totalResults / ($elementsPerPage == 0 ? 1 : $elementsPerPage));
            $metadata['elementsPerPage'] = (int)$elementsPerPage;
            $metadata['resultsReturned'] = count($data);
            $metadata['availablePaging'] = $this->validPagination;
        }

        // Available filters, groups and sorts
        if ($this->filterable) {
            $this->enumerateFilterValues();
            $metadata['availableFilters'] = $this->availableFilters;
        }

        if ($this->groupable) {
            $metadata['availableGroups'] = $this->availableGroups;
        }

        $metadata['availableSorts'] = $this->availableSorts;
        $metadata['grouped'] = $this->groupable;

        // Column descriptions
        $this->mergeColumnDescriptions();
        $metadata['columns'] = $this->columnDescriptions;

        return [
            'metadata'      => $metadata,
            'data'          => $data
        ];
    }

    private function appendDeletedResults(&$query) {
        $query = $query->withTrashed();
    }

    private function enumerateFilterValues()
    {
        foreach ($this->availableFilters as $filterKey => $filterValue)
        {
            if (isset($filterValue['enumerate']) && $filterValue['enumerate'] === true)
            {
                $possibleValuesQuery = new $this->modelClassName;
                $possibleValues = $possibleValuesQuery->select([$filterKey])->groupBy($filterKey)->get();
                $enumeratedValues = [];

                foreach ($possibleValues as $possibleValue)
                    $enumeratedValues[] = $possibleValue->$filterKey;

                $this->availableFilters[$filterKey]['values'] = $enumeratedValues;
            }
        }
    }

    private function applyFilters(&$query, $filtersCount) {
        // Single filters, limited to 20 filters
        $query->where(function($query) use ($filtersCount) {
            if (is_numeric($filtersCount) && $filtersCount > 0 && $filtersCount < 20) {

                for ($filterIndex = 0; $filterIndex < $filtersCount; $filterIndex++) {
                    $filterName = Request::get("filter_{$filterIndex}_name");
                    $filterComparator = Request::get("filter_{$filterIndex}_comparator");
                    $filterValue = Request::get("filter_{$filterIndex}_value");

                    if ($filterName != null && $filterComparator != null) {
                        // Checks if column is filterable
                        if (!array_key_exists($filterName, $this->availableFilters)) {
                            throw new Exception("Filtering by column '{$filterName}' is not allowed.");
                        }

                        // Figures out the real comparator
                        if ($filterComparator == 'like') {
                            $filterRealComparator = 'LIKE';
                        } else if ($filterComparator == 'eq') {
                            $filterRealComparator = '=';
                        } else if ($filterComparator == 'gt') {
                            $filterRealComparator = '>';
                        } else if ($filterComparator == 'lt') {
                            $filterRealComparator = '<';
                        } else if ($filterComparator == 'get') {
                            $filterRealComparator = '>=';
                        } else if ($filterComparator == 'let') {
                            $filterRealComparator = '<=';
                        } else if ($filterComparator == 'neq') {
                            $filterRealComparator = '<>';
                        } else {
                            throw new Exception("Comparator '{$filterComparator}' is invalid.");
                        }

                        // Applies results to where clause
                        $query = $query->where($filterName, $filterRealComparator, $filterValue);
                    }
                }
            }
        });

        // Global filters
        // ToDo: Reimplement, removed temporarly to implement ruleset filters
        /*$query->where(function($query) {
            $filterString = Request::get('filter') == null ? "" : Request::get('filter');
            if ($filterString != "") {
                foreach ($this->filterColumns as $filterColumn => $filterSettings) {
                    if (ISSET($filterSettings['globalFilter']) && $filterSettings['globalFilter']) {
                        $filterFormattedString = $filterString;
                        if (strtolower($filterSettings['comparator']) == 'like') {
                            $filterFormattedString = "%{$filterFormattedString}%";
                        }

                        $query->where($filterColumn, $filterSettings['comparator'], $filterFormattedString);
                    }
                }
            }
        });*/
    }

    private function countTotalResults($query) {
        $countQuery = clone $query;
        return $countQuery->count();
    }

    private function getDefaultPagination() {
        foreach ($this->validPagination as $paginationNumber => $paginationContent) {
            if ($paginationContent == 'default') {
                return $paginationNumber;
            }
        }
    }

    private function groupResults(&$results, $groupColumn) {
        // Finds corresponding group
        $groupInformation = null;
        foreach ($this->availableGroups as $availableGroup) {
            if ($availableGroup['groupName'] == $groupColumn) {
                $groupInformation = $availableGroup;
                break;
            }
        }

        // Gets group label
        $groupLabel = isset($groupInformation['groupLabel']) ? $groupInformation['groupLabel'] : $groupColumn;

        $resultsGrouping = array();
        $groupingIndex = array();
        foreach ($results as $result)
        {
            if (!array_key_exists($result->$groupLabel, $groupingIndex)) {
                $groupingIndex[$result->$groupLabel] = count($resultsGrouping);

                $resultsGrouping[] = ['groupName' => $result->$groupLabel, 'data' => array()];
            }

            $resultsGrouping[$groupingIndex[$result->$groupLabel]]['data'][] = $result;
        }

        $results = $resultsGrouping;
    }

    private function orderQuery(&$query, $orderColumn, $orderDirection) {
        $query = $query->orderBy($orderColumn, $orderDirection);
    }

    private function paginateQuery(&$query, $elementsPerPage, $page) {
        $query = $query->take($elementsPerPage)->skip(($page - 1) * $elementsPerPage);
    }

    private function mergeColumnDescriptions() {
        $this->columnDescriptions = array_merge($this->baseColumnDescriptions, $this->columnDescriptions);
    }
}

