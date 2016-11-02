<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\SkillPresenter;
use GEDB\DataTables\Skill;

class SkillController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.skills.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return SkillPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.skills.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => Skill::find($id)];
    }
}
