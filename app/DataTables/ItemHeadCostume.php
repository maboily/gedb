<?php namespace GEDB\DataTables;

class ItemHeadCostume extends ItemDBModel
{
    protected $table = 'datatable_item_head';

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
            'ASPD',
            'ATK',
            'Category2Name',
            'DEF',
            'deleted_at',
            'Desc',
            'EnchantLv',
            'FileName',
            'HPDrain',
            'ItemName',
            'ImgName',
            'MaxSocketCount',
            'MHP',
            'MSP',
            'PR',
            'Price',
            'ReqToolTip',
            'RFIRE',
            'RICE',
            'RLGHT',
            'RPSY',
            'RSTAT',
            'SellPrice',
            'Tradable',
        ];
    }
}
