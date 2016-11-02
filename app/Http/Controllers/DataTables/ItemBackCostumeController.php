<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemBackCostumePresenter;
use GEDB\DataTables\ItemBackCostume;
use GEDB\Http\Requests\DataTables\ItemBackCostumeRequest;

class ItemBackCostumeController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.backCostumes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemBackCostumePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.backCostumes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemBackCostume::withTrashed()->with(['recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemBackCostumeRequest $request)
    {
        if (!Authorization::hasPermission('database.items.backCostumes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $backCostume = ItemBackCostume::withTrashed()->find($id);
        $backCostume->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.backCostumes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $backCostume = ItemBackCostume::find($id);
        $backCostume->delete();
    }
}
