<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemGlovePresenter;
use GEDB\DataTables\ItemGlove;
use GEDB\Http\Requests\DataTables\ItemGloveRequest;

class ItemGloveController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.gloves.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemGlovePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.gloves.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemGlove::withTrashed()->with(['enchantments', 'recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemGloveRequest $request)
    {
        if (!Authorization::hasPermission('database.items.gloves.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $gloves = ItemGlove::withTrashed()->find($id);
        $gloves->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.gloves.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $gloves = ItemGlove::find($id);
        $gloves->delete();
    }
}
