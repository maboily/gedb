<?php namespace GEDB\Http\Controllers;

use GEDB\Http\Presenters\CWPossibleOccupationPresenter;
use GEDB\Services\Authorization;

class CWPossibleOccupationController extends BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if (!Authorization::hasPermission('tools.cwMap.possibleOccupation.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return CWPossibleOccupationPresenter::present();
    }
} 