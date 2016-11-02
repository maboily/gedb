<?php namespace GEDB\DataTables;

class ItemNecklace extends ItemDBModel
{
    protected $table = 'datatable_item_neck';

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
            'enchant_group_id',
            'EnchantLv',
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
            'IncAGI',
            'IncCHA',
            'IncCON',
            'IncDEX',
            'IncINT',
            'IncSTR',
            'ImgName',
            'ItemName',
            'LghtATK',
            'LgtIP',
            'MHP',
            'MSP',
            'MSPD',
            'PR',
            'PsyATK',
            'PsyIP',
            'RFIRE',
            'RHP',
            'RICE',
            'RLGHT',
            'RPSY',
            'RSP',
            'RSTAT',
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
            'ShldDR',
            'UndeadBane',
            'UseLv'
        ];
    }
}
