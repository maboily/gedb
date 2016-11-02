<?php namespace GEDB\DataTables;

class ItemBackCostume extends ItemDBModel
{
    protected $table = 'datatable_item_back';

    public function recipe() {
        return $this->hasOne('GEDB\\Recipe', 'Target', 'ID')->select([
            'ID', 'Target', 'RecipeLv', 'CharName'
        ]);
    }

    public function getAsList() {
        return $this->with(['recipe.ingredients'])->select($this->getListColumns());
    }

    protected function getListColumns() {
        return [
            'ID',
            'AR',
            'ASPD',
            'ATK',
            'BeastBane',
            'BLK',
            'CRT',
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
            'IceATK',
            'IceIP',
            'ImgName',
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
            'MKP',
            'MSP',
            'MSPD',
            'PR',
            'PromotionLv',
            'PsyATK',
            'PsyIP',
            'RedFIRE',
            'RedICE',
            'RedLGHT',
            'RedMEL',
            'RedPSY',
            'RedSHT',
            'RendBlind',
            'RendBurning',
            'RendFear',
            'RendFreeze',
            'RendPoison',
            'RendShock',
            'RendStun',
            'ReqToolTip',
            'RFIRE',
            'RHP',
            'RICE',
            'RLGHT',
            'RPSY',
            'RSP',
            'RSTAT',
            'UndeadBane',
            'UseLv',
            'ShldDR',
            'WLv'
        ];
    }
}
