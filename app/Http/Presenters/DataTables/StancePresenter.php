<?php namespace GEDB\Http\Presenters\DataTables;

use GEDB\Http\Presenters\BaseListPresenter;

class StancePresenter extends BaseListPresenter {
    public $baseColumnDescriptions = [
        'Name'              => 'Stance Name',
    ];
    public $columnDescriptions = [];

    public $availableFilters = [
        'Name'       => [
            'type'          => 'text',
        ],
    ];
    public $availableGroups = [
    ];
    public $availableSorts = [
        [
            'sortName'                  => 'Name',
            'sortDirection'             => 'Asc',
        ],
        [
            'sortName'                  => 'Name',
            'sortDirection'             => 'Desc',
        ],
    ];

    public $modelClassName = 'GEDB\\DataTables\\Stance';

    public $filterable = true;
    public $groupable = true;
    public $pagination = true;
}