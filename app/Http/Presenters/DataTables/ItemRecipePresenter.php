<?php namespace GEDB\Http\Presenters\DataTables;

class ItemRecipePresenter extends ItemDBPresenter {
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
    public $deleteViewPermission = 'database.items.recipes.delete';
    public $modelClassName = 'GEDB\\DataTables\\ItemRecipe';
}