<?php namespace GEDB\Http\Presenters;

use GEDB\Http\Presenters\BaseListPresenter;

class GroupListPresenter extends BaseListPresenter {
    public $availableFilters = [
        'name'          => [
            'type'          => 'text',
            'description'   => 'Group Name'
        ],
    ];
    public $availableSorts = [
        [
            'sortName'                  => 'name',
            'sortDirection'             => 'Asc',
            'descriptiveName'           => 'Group Name (Ascending)'
        ],
        [
            'sortName'                  => 'name',
            'sortDirection'             => 'Desc',
            'descriptiveName'           => 'Group Name (Descending)'
        ],
    ];
    public $modelClassName = 'GEDB\\Group';
    public $displayColumns = [];
    public $filterable = true;
    public $pagination = true;
}