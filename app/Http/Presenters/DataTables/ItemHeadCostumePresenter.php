<?php namespace GEDB\Http\Presenters\DataTables;

class ItemHeadCostumePresenter extends ItemDBPresenter {
    public $availableFilters = [
        'ASPD'           => [
            'type'          => 'number',
        ],
        'ATK'            => [
            'type'          => 'number',
        ],
        'DEF'           => [
            'type'          => 'number',
        ],
        'Desc'          => [
            'type'          => 'text',
        ],
        'HPDrain'       => [
            'type'          => 'number',
        ],
        'ItemName'       => [
            'type'          => 'text',
        ],
        'MHP'         => [
            'type'          => 'number',
        ],
        'MSP'         => [
            'type'          => 'number',
        ],
        'PR'         => [
            'type'          => 'number',
        ],
        'RFIRE'         => [
            'type'          => 'number',
        ],
        'RHP'         => [
            'type'          => 'number',
        ],
        'RICE'         => [
            'type'          => 'number',
        ],
        'RLGHT'         => [
            'type'          => 'number',
        ],
        'RPSY'         => [
            'type'          => 'number',
        ],
        'RSP'         => [
            'type'          => 'number',
        ],
        'RSTAT'         => [
            'type'          => 'number',
        ],
        'SellPrice'         => [
            'type'          => 'number',
        ],
        'Tradable'         => [
            'type'          => 'boolean',
        ],
    ];
    public $availableSorts = [
        [
            'sortName'                  => 'ItemName',
            'sortDirection'             => 'Asc',
        ],
        [
            'sortName'                  => 'ItemName',
            'sortDirection'             => 'Desc',
        ],
    ];
    public $deleteViewPermission = 'database.items.headCostumes.delete';
    public $modelClassName = 'GEDB\\DataTables\\ItemHeadCostume';
}