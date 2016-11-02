<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemHeadCostumePresenter;
use GEDB\DataTables\ItemHeadCostume;
use GEDB\Http\Requests\DataTables\ItemHeadCostumeRequest;

class ItemHeadCostumeController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.headCostumes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemHeadCostumePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.headCostumes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemHeadCostume::withTrashed()->with(['recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemGloveRequest $request)
    {
        if (!Authorization::hasPermission('database.items.headCostumes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $headCostumes = ItemHeadCostume::withTrashed()->find($id);
        $headCostumes->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.headCostumes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $headCostumes = ItemHeadCostume::find($id);
        $headCostumes->delete();
    }
}
