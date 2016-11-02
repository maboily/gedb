<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemRecipePresenter;
use GEDB\DataTables\ItemRecipe;
use GEDB\Http\Requests\DataTables\ItemRecipeRequest;

class ItemRecipeController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.recipes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemRecipePresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.recipes.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemRecipe::withTrashed()->find($id)];
    }

    public function update($id, ItemRecipeRequest $request)
    {
        if (!Authorization::hasPermission('database.items.recipes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $recipes = ItemRecipe::withTrashed()->find($id);
        $recipes->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.recipes.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $recipes = ItemRecipe::find($id);
        $recipes->delete();
    }
}
