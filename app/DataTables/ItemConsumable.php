<?php namespace GEDB\DataTables;

class ItemConsumable extends ItemDBModel
{
    protected $table = 'datatable_item_consume';

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
            'ItemName',
            'ImgName',
        ];
    }
}
