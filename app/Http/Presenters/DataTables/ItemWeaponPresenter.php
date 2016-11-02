<?php namespace GEDB\Http\Presenters\DataTables;

class ItemWeaponPresenter extends ItemDBPresenter {
    public $columnDescriptions = [
        'ATK'                       => 'Attack',
        'ClassTypeQualifier'        => 'Weapon Type',
        'WLv'                       => 'AR'
    ];

    public $availableFilters = [
        'ASPD'           => [
            'type'          => 'number',
        ],
        'ATK'           => [
            'type'          => 'number',
        ],
        'BeastBane'      => [
            'type'          => 'number',
        ],
        'BLK'      => [
            'type'          => 'number',
        ],
        'ClassTypeQualifier'     => [
            'type'          => 'text',
            'enumerate'     => true
        ],
        'CRT'           => [
            'type'          => 'number',
        ],
        'DefIP'         => [
            'type'          => 'number',
        ],
        'DEF'           => [
            'type'          => 'number',
        ],
        'DemonBane'     => [
            'type'          => 'number',
        ],
        'Desc'          => [
            'type'          => 'text',
        ],
        'FireATK'       => [
            'type'          => 'number',
        ],
        'FireIP'        => [
            'type'          => 'number',
        ],
        'GolemBane'     => [
            'type'          => 'number',
        ],
        'HPDrain'       => [
            'type'          => 'number',
        ],
        'HR'            => [
            'type'          => 'number',
        ],
        'HumanBane'     => [
            'type'          => 'number',
        ],
        'IceATK'         => [
            'type'          => 'number',
        ],
        'IceIP'         => [
            'type'          => 'number',
        ],
        'IMP'           => [
            'type'          => 'number',
        ],
        'IncAGI'         => [
            'type'          => 'number',
        ],
        'IncCHA'         => [
            'type'          => 'number',
        ],
        'IncCON'         => [
            'type'          => 'number',
        ],
        'IncDEX'         => [
            'type'          => 'number',
        ],
        'IncMHP'         => [
            'type'          => 'number',
        ],
        'IncMSP'         => [
            'type'          => 'number',
        ],
        'IncINT'         => [
            'type'          => 'number',
        ],
        'IncSTR'         => [
            'type'          => 'number',
        ],
        'ItemName'       => [
            'type'          => 'text',
        ],
        'LghtATK'       => [
            'type'          => 'text',
        ],
        'LgtIP'       => [
            'type'          => 'text',
        ],
        'MHP'         => [
            'type'          => 'number',
        ],
        'MSP'         => [
            'type'          => 'number',
        ],
        'MSPD'         => [
            'type'          => 'number',
        ],
        'PR'         => [
            'type'          => 'number',
        ],
        'PsyATK'         => [
            'type'          => 'number',
        ],
        'PsyIP'         => [
            'type'          => 'number',
        ],
        'RedFIRE'         => [
            'type'          => 'number',
        ],
        'RedICE'         => [
            'type'          => 'number',
        ],
        'RedLGHT'         => [
            'type'          => 'number',
        ],
        'RedMAG'         => [
            'type'          => 'number',
        ],
        'RedMEL'         => [
            'type'          => 'number',
        ],
        'RedSHT'         => [
            'type'          => 'number',
        ],
        'RendBlind'         => [
            'type'          => 'number',
        ],
        'RendBurning'         => [
            'type'          => 'number',
        ],
        'RendFear'         => [
            'type'          => 'number',
        ],
        'RendFreeze'         => [
            'type'          => 'number',
        ],
        'RendPoison'         => [
            'type'          => 'number',
        ],
        'RendShock'         => [
            'type'          => 'number',
        ],
        'RendStun'         => [
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
        'ShldDR'         => [
            'type'          => 'number',
        ],
        'Tradable'         => [
            'type'          => 'boolean',
        ],
        'UndeadBane'         => [
            'type'          => 'boolean',
        ],
        'WLv'         => [
            'type'          => 'number',
        ],
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
            'sortName'                  => 'ATK',
            'sortDirection'             => 'Asc',
        ],
        [
            'sortName'                  => 'ATK',
            'sortDirection'             => 'Desc',
        ],
    ];
    public $deleteViewPermission = 'database.items.weapons.delete';
    public $modelClassName = 'GEDB\\DataTables\\ItemWeapon';
}