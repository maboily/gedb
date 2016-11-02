<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemNecklacePresenter;
use GEDB\DataTables\ItemNecklace;
use GEDB\Http\Requests\DataTables\ItemNecklaceRequest;

class ItemNecklaceController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.necklaces.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemNecklacePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.necklaces.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemNecklace::withTrashed()->with(['enchantments', 'recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemNecklaceRequest $request)
    {
        if (!Authorization::hasPermission('database.items.necklaces.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $necklaces = ItemNecklace::withTrashed()->find($id);
        $necklaces->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.necklaces.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $necklaces = ItemNecklace::find($id);
        $necklaces->delete();
    }
}
