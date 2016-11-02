<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Input;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemCostumePresenter;
use GEDB\DataTables\ItemCostume;
use GEDB\Http\Requests\DataTables\ItemCostumeRequest;

class ItemCostumeController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.costumes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemCostumePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.costumes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemCostume::withTrashed()->with(['recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemCostumeRequest $request)
    {
        if (!Authorization::hasPermission('database.items.costumes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $costumes = ItemCostume::withTrashed()->find($id);
        $costumes->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.costumes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $costumes = ItemCostume::find($id);
        $costumes->delete();
    }
}
