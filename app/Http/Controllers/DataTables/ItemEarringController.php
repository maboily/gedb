<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemEarringPresenter;
use GEDB\DataTables\ItemEarring;
use GEDB\Http\Requests\DataTables\ItemEarringRequest;

class ItemEarringController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.earrings.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemEarringPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.earrings.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemEarring::withTrashed()->with(['enchantments', 'recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemEarringRequest $request)
    {
        if (!Authorization::hasPermission('database.items.earrings.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $earrings = ItemEarring::withTrashed()->find($id);
        $earrings->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.earrings.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $earrings = ItemEarring::find($id);
        $earrings->delete();
    }
}
