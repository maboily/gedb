<?php namespace GEDB\DataTables;

trait ListableModelTrait {
    public function getAsList() {
        return $this->select($this->getListColumns());
    }

    protected abstract function getListColumns();
}