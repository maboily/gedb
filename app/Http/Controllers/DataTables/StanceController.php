<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\StancePresenter;
use GEDB\DataTables\Stance;

class StanceController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.stances.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return StancePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.stances.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => Stance::find($id)];
    }
}
