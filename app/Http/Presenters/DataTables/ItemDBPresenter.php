<?php namespace GEDB\Http\Presenters\DataTables;

use GEDB\Http\Presenters\BaseListPresenter;

abstract class ItemDBPresenter extends BaseListPresenter {
    public $baseColumnDescriptions = [
        // Item
        'Desc'                      => 'Description',
        'EnchantLv'                 => 'Enchantment Level',
        'ItemName'                  => 'Item Name',
        'SellPrice'                 => 'Sell Price',
        'Tradable'                  => 'Tradeable',
        'SeriesOrder'               => 'Series',

        // Offense
        'AR'                        => 'AR',
        'ATK'                       => 'ATK (%)',
        'HPDrain'                   => 'Absorbs attack damage as HP',
        'ASPD'                      => 'Attack Speed',
        'CRT'                       => 'Crit chance',
        'CRTATK'                    => 'Crit damage',
        'HR'                        => 'Accuracy',
        'SummonAR'                  => 'Summon AR',

        // Penetration
        'DefIP'                     => 'Physical Penetration',
        'FireIP'                    => 'Fire Penetration',
        'IceIP'                     => 'Ice Penetration',
        'LgtIP'                     => 'Lightning Penetration',
        'PsyIP'                     => 'Mental Penetration',

        // Elemental Attack
        'FireATK'                   => 'Fire ATK',
        'IceATK'                    => 'Ice ATK',
        'LghtATK'                   => 'Lightning ATK',
        'PsyATK'                    => 'Mental ATK',

        // Racials
        'BeastBane'                 => '+% Damage vs. Wildlife',
        'DemonBane'                 => '+% Damage vs. Daemons',
        'GolemBane'                 => '+% Damage vs. Lifeless',
        'HumanBane'                 => '+% Damage vs. Humans',
        'UndeadBane'                => '+% Damage vs. Undead',

        // Defense
        'DEF'                       => 'DEF',
        'IMP'                       => 'Immunity',
        'IncMHP'                    => '+X Max HP',
        'IncMSP'                    => '+X Max SP',
        'MHP'                       => '+X% Max HP',
        'MHP2'                      => '+X Max HP',
        'RHP'                       => 'HP Regen',
        'RSP'                       => 'SP Regen',
        'SummonDR'                  => 'Summon DR',
        'MSP'                       => '+X% Max SP',
        'MSP2'                      => '+X Max SP',
        'MSPD'                      => 'Movement Speed',
        'MSPD_Opt'                  => 'Movement Speed',
        'PR'                        => 'Evasion',
        'AddSummonMHP'              => 'Summon Max HP',
        'BLK'                       => 'Block',
        'EvationSkill_BM'           => 'Skill Evasion',
        'ShldDR'                    => 'DR',


        // Damage reduction
        'RedFIRE'                   => 'Reduced Fire Damage (%)',
        'RedICE'                    => 'Reduced Ice Damage (%)',
        'RedLGHT'                   => 'Reduced Lightning Damage (%)',
        'RedMAG'                    => 'Reduced Magic Damage (%)',
        'RedMEL'                    => 'Reduced Melee Damage (%)',
        'RedSHT'                    => 'Reduced Shooting Damage (%)',

        // Status effect
        'RendBlind'                 => 'Chance to inflict Blind (%)',
        'RendBurning'               => 'Chance to inflict Burning (%)',
        'RendFear'                  => 'Chance to inflict Fear (%)',
        'RendFreeze'                => 'Chance to inflict Freeze (%)',
        'RendPoison'                => 'Chance to inflict Poison (%)',
        'RendShock'                 => 'Chance to inflict Shock (%)',
        'RendStun'                  => 'Chance to inflict Stun (%)',

        // Base stats
        'IncAGI'                    => 'AGI',
        'IncCHA'                    => 'SEN',
        'IncCON'                    => 'HP',
        'IncDEX'                    => 'DEX',
        'IncINT'                    => 'INT',
        'IncSTR'                    => 'STR',

        // Resistances
        'RFIRE'                     => 'Fire Resistance',
        'RICE'                      => 'Ice Resistance',
        'RLGHT'                     => 'Lightning Resistance',
        'RPSY'                      => 'Mental Resistance',
        'RSTAT'                     => 'Debuff Resistance',
    ];
    public $columnDescriptions = [];

    public $availableFilters = [];
    public $availableGroups = [];
    public $availableSorts = [];

    public $deleteViewPermission = '';
    public $modelClassName = '';

    public $filterable = true;
    public $groupable = true;
    public $pagination = true;
}