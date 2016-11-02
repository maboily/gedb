<?php namespace GEDB\Http\Controllers;

use Illuminate\Support\Facades\Input;
use GEDB\Services\Authorization;
use GEDB\Group;
use GEDB\Http\Presenters\GroupListPresenter;
use GEDB\Http\Requests\GroupStoreRequest;
use GEDB\Http\Requests\GroupUpdateRequest;

class GroupController extends BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if (!Authorization::hasPermission('admin.groups.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return GroupListPresenter::present();
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(GroupStoreRequest $request)
    {
        if (!Authorization::hasPermission('admin.groups.new')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Base group information
        $group = new Group();
        $group->name = Input::get('name');
        $group->save();

        // Adds permissions to group
        $permissions = Input::get('permissions');
        $group->permissions()->attach($permissions);
        $group->save();

        return ['data' => $group->id];
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        if (!Authorization::hasPermission('admin.groups.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => Group::with('permissions')->find($id)];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, GroupUpdateRequest $request)
    {
        if (!Authorization::hasPermission('admin.groups.edit')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Finds group
        $group = Group::find($id);
        $group->name = Input::get('name');

        // Remove all group's permissions
        foreach ($group->permissions as $permission) {
            $group->permissions()->detach($permission->id);
        }

        // Re-adds all group's permissions
        $permissions = Input::get('permissions');
        $group->permissions()->attach($permissions);
        $group->save();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        if (!Authorization::hasPermission('admin.groups.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Finds and delete group
        $group = Group::find($id);
        $group->delete();
    }


}
