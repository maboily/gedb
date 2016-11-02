<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemWeaponPresenter;
use GEDB\DataTables\ItemWeapon;
use GEDB\Http\Requests\DataTables\ItemWeaponRequest;

class ItemWeaponController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.weapons.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemWeaponPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.weapons.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemWeapon::withTrashed()->with(['enchantments', 'recipe.ingredients'])->find($id)];
    }

    public function update($id, ItemWeaponRequest $request)
    {
        if (!Authorization::hasPermission('database.items.weapons.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $weapons = ItemWeapon::withTrashed()->find($id);
        $weapons->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.weapons.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $weapons = ItemWeapon::find($id);
        $weapons->delete();
    }
}
