<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemBootPresenter;
use GEDB\DataTables\ItemBoot;
use GEDB\Http\Requests\DataTables\ItemBootRequest;

class ItemBootController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.boots.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemBootPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.boots.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemBoot::withTrashed()->with(['enchantments', 'recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemBootRequest $request)
    {
        if (!Authorization::hasPermission('database.items.boots.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $boot = ItemBoot::withTrashed()->find($id);
        $boot->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.boots.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $boot = ItemBoot::find($id);
        $boot->delete();
    }
}
