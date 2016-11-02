<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemConsumablePresenter;
use GEDB\DataTables\ItemConsumable;
use GEDB\Http\Requests\DataTables\ItemConsumableRequest;

class ItemConsumableController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.consumables.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemConsumablePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.consumables.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemConsumable::withTrashed()->with(['recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemConsumableRequest $request)
    {
        if (!Authorization::hasPermission('database.items.consumables.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $consumable = ItemConsumable::withTrashed()->find($id);
        $consumable->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.consumables.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $consumable = ItemConsumable::find($id);
        $consumable->delete();
    }
}
