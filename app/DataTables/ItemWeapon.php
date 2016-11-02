<?php namespace GEDB\DataTables;

class ItemWeapon extends ItemDBModel
{
    protected $table = 'datatable_item_weapon';

    public function enchantments() {
        return $this->hasMany('GEDB\\Enchantment', 'enchant_group_id', 'enchant_group_id')->select([
            'MaxValue', 'Value', 'MinValue', 'Rarity', 'Grade', 'Desc', 'enchant_group_id'
        ]);
    }

    public function recipe() {
        return $this->hasOne('GEDB\\Recipe', 'Target', 'ID')->select([
            'ID', 'Target', 'RecipeLv', 'CharName'
        ]);
    }

    public function getAsList() {
        return $this->with(['enchantments', 'recipe.ingredients'])->select($this->getListColumns());
    }

    protected function getListColumns() {
        return [
            'ID',
            'ASPD',
            'ATK',
            'BeastBane',
            'BLK',
            'ClassTypeQualifier',
            'CRT',
            'DEF',
            'DefIP',
            'DemonBane',
            'deleted_at',
            'Desc',
            'enchant_group_id',
            'EnchantLv',
            'FileName',
            'FireATK',
            'FireIP',
            'GolemBane',
            'HPDrain',
            'HR',
            'HumanBane',
            'IceATK',
            'IceIP',
            'IMP',
            'ImgName',
            'IncMHP',
            'IncMSP',
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
            'MSP',
            'MSPD',
            'PR',
            'Price',
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
            'SellPrice',
            'SeriesName',
            'SeriesOrder',
            'ShldDR',
            'Tradable',
            'UndeadBane',
            'WLv'
        ];
    }
}
