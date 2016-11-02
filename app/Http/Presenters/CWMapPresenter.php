<?php namespace GEDB\Http\Presenters;

class CWMapPresenter extends BaseListPresenter {
    public $availableSorts = [
        [
            'sortName'                  => 'cw_date',
            'sortDirection'             => 'Desc',
            'descriptiveName'           => 'Creation Date (Descending)'
        ],
    ];

    public $validPagination = [25];
    public $modelClassName = 'GEDB\\CWMap';
    public $filterable = false;
}