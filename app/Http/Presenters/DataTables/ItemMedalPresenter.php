<?php namespace GEDB\Http\Presenters\DataTables;

class ItemMedalPresenter extends ItemDBPresenter {
    public $availableFilters = [
        'AR'            => [
            'type'          => 'number',
        ],
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
        'EnchantLv'       => [
            'type'          => 'number',
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
        'ShldDR'         => [
            'type'          => 'number',
        ],
        'Tradable'         => [
            'type'          => 'boolean',
        ],
        'UndeadBane'         => [
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
    public $deleteViewPermission = 'database.items.medals.delete';
    public $modelClassName = 'GEDB\\DataTables\\ItemMedal';
}