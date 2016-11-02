<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemOtherPresenter;
use GEDB\DataTables\ItemOther;
use GEDB\Http\Requests\DataTables\ItemOtherRequest;

class ItemOtherController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.others.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemOtherPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.others.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemOther::withTrashed()->with(['recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemOtherRequest $request)
    {
        if (!Authorization::hasPermission('database.items.others.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $others = ItemOther::withTrashed()->find($id);
        $others->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.others.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $others = ItemOther::find($id);
        $others->delete();
    }
}
