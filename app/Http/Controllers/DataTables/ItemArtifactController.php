<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemArtifactPresenter;
use GEDB\DataTables\ItemArtifact;
use GEDB\Http\Requests\DataTables\ItemArtifactRequest;

class ItemArtifactController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.artifacts.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemArtifactPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.artifacts.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemArtifact::withTrashed()->find($id)];
    }

    public function update($id, ItemArtifactRequest $request)
    {
        if (!Authorization::hasPermission('database.items.artifacts.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $artifact = ItemArtifact::withTrashed()->find($id);
        $artifact->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.artifacts.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $artifact = ItemArtifact::find($id);
        $artifact->delete();
    }
}
