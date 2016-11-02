<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemStanceBookPresenter;
use GEDB\DataTables\ItemStanceBook;
use GEDB\Http\Requests\DataTables\ItemStanceBookRequest;

class ItemStanceBookController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.stanceBooks.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemStanceBookPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.stanceBooks.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemStanceBook::withTrashed()->find($id)];
    }

    public function update($id, ItemStanceBookRequest $request)
    {
        if (!Authorization::hasPermission('database.items.stanceBooks.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $stanceBooks = ItemStanceBook::withTrashed()->find($id);
        $stanceBooks->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.stanceBooks.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $stanceBooks = ItemStanceBook::find($id);
        $stanceBooks->delete();
    }
}
