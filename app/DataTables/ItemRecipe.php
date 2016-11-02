<?php namespace GEDB\DataTables;

class ItemRecipe extends ItemDBModel
{
    protected $table = 'datatable_item_recipe';

    protected function getListColumns() {
        return [
            'ID',
            'deleted_at',
            'Desc',
            'FileName',
            'ImgName',
            'ItemName',
        ];
    }
}
