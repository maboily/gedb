<?php namespace GEDB\DataTables;

class ItemStanceBook extends ItemDBModel
{
    protected $table = 'datatable_item_scroll';

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
