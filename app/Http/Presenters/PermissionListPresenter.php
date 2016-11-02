<?php namespace GEDB\Http\Presenters;

use GEDB\Http\Presenters\BaseListPresenter;

class PermissionListPresenter extends BaseListPresenter {
    public $availableFilters = [];
    public $modelClassName = 'GEDB\\Permission';
    public $displayColumns = [];
    public $filterable = true;
    public $pagination = true;
}