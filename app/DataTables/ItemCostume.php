<?php namespace GEDB\DataTables;

class ItemCostume extends ItemDBModel
{
    protected $table = 'datatable_item_costume';

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
            'Category2Name',
            'ClassTypeQualifier',
            'CRT',
            'CRTATK',
            'DEF',
            'deleted_at',
            'DefIP',
            'DemonBane',
            'Desc',
            'FileName',
            'FireATK',
            'FireIP',
            'GolemBane',
            'HPDrain',
            'HR',
            'HumanBane',
            'IceATK',
            'IceIP',
            'ImgName',
            'IMP',
            'IncAGI',
            'IncCHA',
            'IncCON',
            'IncDEX',
            'IncINT',
            'IncSTR',
            'ItemName',
            'LghtATK',
            'LgtIP',
            'MaxSocketCount',
            'MHP',
            'MSPD',
            'MSP',
            'PromotionLv',
            'PR',
            'PsyATK',
            'PsyIP',
            'ReqToolTip',
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
            'SellPrice',
            'ShldDR',
            'Tradable',
            'UndeadBane',
            'UseLv',
        ];
    }
}
