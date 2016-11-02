<?php namespace GEDB\Http\Presenters\DataTables;

class ItemArmorPresenter extends ItemDBPresenter {
    public $columnDescriptions = [
        'ClassTypeQualifier'        => 'Armor Type',
        'WLv'                       => 'DR',
    ];

    public $availableFilters = [
        'ASPD'           => [
            'type'          => 'number',
        ],
        'ClassTypeQualifier' => [
            'type'          => 'text',
            'enumerate'     => true,
        ],
        'DEF'           => [
            'type'          => 'number',
        ],
        'Desc'          => [
            'type'          => 'text',
        ],
        'EnchantLv'     => [
            'type'          => 'number',
        ],
        'HPDrain'       => [
            'type'          => 'number',
        ],
        'IMP'           => [
            'type'          => 'number',
        ],
        'IncAGI'        => [
            'type'          => 'number',
        ],
        'IncCHA'        => [
            'type'          => 'number',
        ],
        'IncCON'        => [
            'type'          => 'number',
        ],
        'IncDEX'        => [
            'type'          => 'number',
        ],
        'IncINT'        => [
            'type'          => 'number',
        ],
        'IncMHP'        => [
            'type'          => 'number',
        ],
        'IncMSP'        => [
            'type'          => 'number',
        ],
        'IncSTR'        => [
            'type'          => 'number',
        ],
        'ItemName'      => [
            'type'          => 'text',
        ],
        'MHP'           => [
            'type'          => 'number',
        ],
        'MSP'           => [
            'type'          => 'number',
        ],
        'MSPD_Opt'      => [
            'type'          => 'number',
        ],
        'PR'            => [
            'type'          => 'number',
        ],
        'RFIRE'         => [
            'type'          => 'number',
        ],
        'RICE'          => [
            'type'          => 'number',
        ],
        'RLGHT'         => [
            'type'          => 'number',
        ],
        'RPSY'          => [
            'type'          => 'number',
        ],
        'RSTAT'         => [
            'type'          => 'number',
        ],
        'SellPrice'     => [
            'type'          => 'number',
        ],
        'Tradable'      => [
            'type'          => 'boolean',
        ],
        'WLv'           => [
            'type'          => 'number',
        ]
    ];
    public $availableGroups = [
        [
            'groupName'                 => 'ClassTypeQualifier',
            'groupDirection'            => 'Asc',
        ],
        [
            'groupName'                 => 'ClassTypeQualifier',
            'groupDirection'            => 'Desc',
        ],
        [
            'groupName'                 => 'SeriesOrder',
            'groupDirection'            => 'Asc',
            'groupLabel'                => 'SeriesName',
        ],
        [
            'groupName'                 => 'SeriesOrder',
            'groupDirection'            => 'Desc',
            'groupLabel'                => 'SeriesName',
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
        [
            'sortName'                  => 'WLv',
            'sortDirection'             => 'Asc',
        ],
        [
            'sortName'                  => 'WLv',
            'sortDirection'             => 'Desc',
        ],
        [
            'sortName'                  => 'DEF',
            'sortDirection'             => 'Asc',
        ],
        [
            'sortName'                  => 'DEF',
            'sortDirection'             => 'Desc',
        ],
    ];

    public $deleteViewPermission = 'database.items.armors.delete';
    public $modelClassName = 'GEDB\\DataTables\\ItemArmor';
}