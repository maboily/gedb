<?php namespace GEDB\Http\Presenters\DataTables;

class ItemQuestPresenter extends ItemDBPresenter {
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
    public $deleteViewPermission = 'database.items.quests.delete';
    public $modelClassName = 'GEDB\\DataTables\\ItemQuest';
}