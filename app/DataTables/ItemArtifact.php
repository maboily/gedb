<?php namespace GEDB\DataTables;

class ItemArtifact extends ItemDBModel
{

    protected $table = 'datatable_item_artifact';

    protected function getListColumns() {
        return [
            'ID',
            'AddSummonMHP',
            'ASPD',
            'ATK',
            'BeastBane',
            'BLK',
            'CRT',
            'CRTATK',
            'DEF',
            'DefIP',
            'deleted_at',
            'DemonBane',
            'Desc',
            'FileName',
            'FireATK',
            'FireIP',
            'GolemBane',
            'HPDrain',
            'HR',
            'HumanBane',
            'IMP',
            'ImgName',
            'IceATK',
            'IceIP',
            'IncAGI',
            'IncCHA',
            'IncCON',
            'IncDEX',
            'IncINT',
            'IncSTR',
            'ItemName',
            'LghtATK',
            'LgtIP',
            'MHP',
            'MHP2',
            'MSP',
            'MSP2',
            'MSPD',
            'PR',
            'PsyATK',
            'PsyIP',
            'RedFIRE',
            'RedICE',
            'RedLGHT',
            'RedMEL',
            'RedPSY',
            'RedSHT',
            'RFIRE',
            'RHP',
            'RICE',
            'RLGHT',
            'RPSY',
            'RSP',
            'RSTAT',
            'RendBlind',
            'RendBurning',
            'RendFear',
            'RendFreeze',
            'RendPoison',
            'RendShock',
            'RendStun',
            'ReqToolTip',
            'ShldDR',
            'SummonAR',
            'SummonDR',
            'UndeadBane',
            'UseLv'
        ];
    }
}
