<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemMedalPresenter;
use GEDB\DataTables\ItemMedal;
use GEDB\Http\Requests\DataTables\ItemMedalRequest;

class ItemMedalController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.medals.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemMedalPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.medals.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemMedal::withTrashed()->find($id)];
    }

    public function update($id, ItemMedalRequest $request)
    {
        if (!Authorization::hasPermission('database.items.medals.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on medals
        $medal = ItemMedal::withTrashed()->find($id);
        $medal->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.medals.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $medal = ItemMedal::find($id);
        $medal->delete();
    }
}
