<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemArmorPresenter;
use GEDB\DataTables\ItemArmor;
use GEDB\Http\Requests\DataTables\ItemArmorRequest;

class ItemArmorController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.armors.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemArmorPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.armors.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemArmor::withTrashed()->with(['recipe.ingredients', 'enchantments'])->find($id)];
    }

    public function update($id, ItemArmorRequest $request)
    {
        if (!Authorization::hasPermission('database.items.armors.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $armor = ItemArmor::withTrashed()->find($id);
        $armor->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.armors.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $armor = ItemArmor::find($id);
        $armor->delete();
    }
}
