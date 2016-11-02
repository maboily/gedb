<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemBeltPresenter;
use GEDB\DataTables\ItemBelt;
use GEDB\Http\Requests\DataTables\ItemBeltRequest;

class ItemBeltController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.belts.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemBeltPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.belts.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemBelt::withTrashed()->with(['enchantments', 'recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemBeltRequest $request)
    {
        if (!Authorization::hasPermission('database.items.belts.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $belt = ItemBelt::withTrashed()->find($id);
        $belt->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.belts.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $belt = ItemBelt::find($id);
        $belt->delete();
    }
}
