<?php namespace GEDB\Http\Presenters;

use GEDB\Http\Presenters\BaseListPresenter;

class UserListPresenter extends BaseListPresenter {
    public $availableFilters = [
        'email'          => [
            'type'          => 'text',
            'description'   => 'Email'
        ],
    ];
    public $availableSorts = [
        [
            'sortName'                  => 'email',
            'sortDirection'             => 'Asc',
            'descriptiveName'           => 'Email (Ascending)'
        ],
        [
            'sortName'                  => 'email',
            'sortDirection'             => 'Desc',
            'descriptiveName'           => 'Email (Descending)'
        ],
    ];
    public $modelClassName = 'GEDB\\User';
    public $displayColumns = [];
    public $filterable = true;
    public $pagination = true;
}