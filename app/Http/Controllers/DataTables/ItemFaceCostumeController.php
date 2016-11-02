<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemFaceCostumePresenter;
use GEDB\DataTables\ItemFaceCostume;
use GEDB\Http\Requests\DataTables\ItemFaceCostumeRequest;

class ItemFaceCostumeController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.faceCostumes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemFaceCostumePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.faceCostumes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemFaceCostume::withTrashed()->with(['recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemFaceCostumeRequest $request)
    {
        if (!Authorization::hasPermission('database.items.faceCostumes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $faceCostumes = ItemFaceCostume::withTrashed()->find($id);
        $faceCostumes->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.faceCostumes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $faceCostumes = ItemFaceCostume::find($id);
        $faceCostumes->delete();
    }
}
