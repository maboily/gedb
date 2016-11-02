<?php namespace GEDB\DataTables;

class ItemQuest extends ItemDBModel
{
    protected $table = 'datatable_item_quest';

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
