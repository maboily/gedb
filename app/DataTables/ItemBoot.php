<?php namespace GEDB\DataTables;

class ItemBoot extends ItemDBModel
{
    protected $table = 'datatable_item_boots';

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
            'deleted_at',
            'DemonBane',
            'Desc',
            'enchant_group_id',
            'EnchantLv',
            'FireATK',
            'FireIP',
            'FileName',
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
            'ShldDR',
            'UndeadBane',
            'UseLv'
        ];
    }
}
