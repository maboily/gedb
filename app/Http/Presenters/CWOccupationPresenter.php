<?php namespace GEDB\Http\Presenters;

class CWOccupationPointPresenter extends BaseListPresenter {
    public $modelClassName = 'GEDB\\CWOccupation';
    public $filterable = false;
    public $forcedPagination = false;
    public $sortable = false;
}