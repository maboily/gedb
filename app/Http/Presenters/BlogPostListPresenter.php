<?php namespace GEDB\Http\Presenters;

use GEDB\Http\Presenters\BaseListPresenter;

class BlogPostListPresenter extends BaseListPresenter {
    public $availableFilters = [];
    public $availableGroups = [];
    public $availableSorts = [
        [
            'sortName'                  => 'created_at',
            'sortDirection'             => 'Desc',
            'descriptiveName'           => 'Creation Date (Descending)'
        ],
    ];
    public $displayColumns = [];
    public $modelClassName = 'GEDB\\BlogPost';
    public $filterable = false;
    public $groupable = false;
    public $pagination = true;
    public $validPagination = [10];
    public $sortable = false;
}