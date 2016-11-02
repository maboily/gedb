<?php namespace GEDB\Http\Controllers;

use GEDB\Services\Authorization;
use GEDB\Http\Presenters\ChangelogRevisionListPresenter;
use GEDB\Http\Requests\ChangelogRevisionUpdateRequest;
use GEDB\Http\Requests\ChangelogRevisionStoreRequest;
use GEDB\ChangelogRevision;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;

class ChangelogRevisionController extends BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if (!Authorization::hasPermission('tools.changelog.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ChangelogRevisionListPresenter::present();
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(ChangelogRevisionStoreRequest $request)
    {
        if (!Authorization::hasPermission('tools.changelog.new')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Attempts to create new changelog
        $newChangelogRevision = new ChangelogRevision;
        $newChangelogRevision->title = Input::get('title');
        $newChangelogRevision->content = Input::get('content');

        // Checks if changelog has became the current one
        $isCurrent = Input::get('is_current');
        if ($isCurrent) {
            // Unsets all other changelogs as non-current
            ChangelogRevision::unassignDefaultValues();

            // Sets changelog as current
            $newChangelogRevision->is_current = true;
        }

        $newChangelogRevision->save();

        // Returns new changelog's revision ID
        return ['data' => $newChangelogRevision->id];
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        if (!Authorization::hasPermission('tools.changelog.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => ChangelogRevision::find($id)];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, ChangelogRevisionUpdateRequest $request)
    {
        if (!Authorization::hasPermission('tools.changelog.edit')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Finds changelog revision in database
        $changelogRevision = ChangelogRevision::find($id);
        $changelogRevision->title = Input::get('title');
        $changelogRevision->content = Input::get('content');

        // Checks if changelog has became the current one
        $isCurrent = Input::get('is_current');
        if ($isCurrent) {
            // Unsets all other changelogs as non-current
            ChangelogRevision::unassignDefaultValues();

            // Sets changelog as current
            $changelogRevision->is_current = true;
        }

        // Saves changelog revision
        $changelogRevision->save();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        if (!Authorization::hasPermission('tools.changelog.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $changelogRevision = ChangelogRevision::find($id);
        $changelogRevision->delete();
    }
}
