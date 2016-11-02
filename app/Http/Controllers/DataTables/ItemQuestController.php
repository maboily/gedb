<?php namespace GEDB\Http\Controllers\DataTables;

use Illuminate\Routing\Controller;
use GEDB\Services\Authorization;
use GEDB\Http\Presenters\DataTables\ItemQuestPresenter;
use GEDB\DataTables\ItemQuest;
use GEDB\Http\Requests\DataTables\ItemQuestRequest;

class ItemQuestController extends Controller {
    public function index()
    {
        if (!Authorization::hasPermission('database.items.quests.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ItemQuestPresenter::present();
    }

    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.quests.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ItemQuest::withTrashed()->find($id)];
    }

    public function update($id, ItemQuestRequest $request)
    {
        if (!Authorization::hasPermission('database.items.quests.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Changes only deleted_at column on armors
        $quests = ItemQuest::withTrashed()->find($id);
        $quests->restore();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.quests.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $quests = ItemQuest::find($id);
        $quests->delete();
    }
}
