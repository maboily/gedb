<?php namespace GEDB\DataTables;

class ItemArmor extends ItemDBModel
{
    protected $table = 'datatable_item_armor';

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

    public function thumbnails() {
        return $this->hasMany('GEDB\\ItemThumbnail', 'item_id', 'ID');
    }

    public function getAsList() {
        return $this->with(['enchantments', 'recipe.ingredients', 'thumbnails'])->select($this->getListColumns());
    }

    protected function getListColumns() {
        return [
            'ID',
            'ASPD',
            'Category2Name',
            'ClassTypeQualifier',
            'DEF',
            'Desc',
            'deleted_at',
            'enchant_group_id',
            'EnchantLv',
            'FileName',
            'HPDrain',
            'IMP',
            'IncMHP',
            'IncMSP',
            'IncAGI',
            'IncCHA',
            'IncCON',
            'IncDEX',
            'IncINT',
            'IncSTR',
            'ItemName',
            'ImgName',
            'MaxSocketCount',
            'MHP',
            'MSPD_Opt',
            'MSP',
            'MSP_Opt',
            'PromotionLv',
            'PR',
            'ReqToolTip',
            'RFIRE',
            'RICE',
            'RLGHT',
            'RPSY',
            'RSTAT',
            'SellPrice',
            'SeriesName',
            'SeriesOrder',
            'Tradable',
            'UseLv',
            'WLv'
        ];
    }
}
