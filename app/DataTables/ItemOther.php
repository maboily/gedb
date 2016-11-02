<?php namespace GEDB\DataTables;

class ItemOther extends ItemDBModel
{
    protected $table = 'datatable_item_etc';

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
            'deleted_at',
            'Desc',
            'FileName',
            'ImgName',
            'ItemName',
        ];
    }
}
