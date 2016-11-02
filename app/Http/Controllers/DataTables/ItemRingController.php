<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemRingPresenter;
use GEDB\DataTables\ItemRing;
use GEDB\Http\Requests\DataTables\ItemRingRequest;

class ItemRingController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.rings.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemRingPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.rings.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemRing::withTrashed()->with(['enchantments', 'recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemRingRequest $request)
    {
        if (!Authorization::hasPermission('database.items.rings.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $rings = ItemRing::withTrashed()->find($id);
        $rings->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.rings.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $rings = ItemRing::find($id);
        $rings->delete();
    }
}
