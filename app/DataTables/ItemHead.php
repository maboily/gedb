<?php namespace GEDB\DataTables;

class ItemHead extends ItemDBModel
{
    protected $table = 'datatable_item_head';

    protected function getListColumns() {
        return [
            'ID',
            'ASPD',
            'ATK',
            'BaseDEF',
            'Category2Name',
            'DEF',
            'Desc',
            'EnchantLv',
            'EngName',
            'FileName',
            'HPDrain',
            'ImgName',
            'MaxSocketCount',
            'MHP',
            'MHP_Opt',
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
            'WLv'
        ];
    }
}
