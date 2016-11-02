<?php namespace GEDB\Http\Presenters;

class ChangelogRevisionListPresenter extends BaseListPresenter {
    public $availableSorts = [
        [
            'sortName'                  => 'created_at',
            'sortDirection'             => 'Desc',
            'descriptiveName'           => 'Creation Date (Descending)'
        ],
    ];
    public $modelClassName = 'GEDB\\ChangelogRevision';
    public $filterable = false;
    public $validPagination = [5];
}