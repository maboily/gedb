<?php namespace GEDB\Http\Presenters\DataTables;

class ItemStanceBookPresenter extends ItemDBPresenter {
    public $availableFilters = [
        'Desc'          => [
            'type'          => 'text',
        ],
        'ItemName'       => [
            'type'          => 'text',
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
    public $deleteViewPermission = 'database.items.stanceBooks.delete';
    public $modelClassName = 'GEDB\\DataTables\\ItemStanceBook';
}