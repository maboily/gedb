<?php namespace GEDB\Http\Controllers;

use GEDB\Services\Authorization;
use GEDB\Http\Presenters\UserListPresenter;
use GEDB\Http\Requests\UserUpdateRequest;
use GEDB\Http\Requests\UserStoreRequest;
use GEDB\User;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;

class UserController extends BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if (!Authorization::hasPermission('admin.users.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return UserListPresenter::present();
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(UserStoreRequest $request)
    {
        if (!Authorization::hasPermission('admin.users.new')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Attempts to create new user
        $newUser = new User;
        $newUser->email = Input::get('email');
        $newUser->password = Hash::make(Input::get('password'));
        $newUser->save();

        // Binds permissions to user
        $permissionsIds = Input::get('permissions');
        foreach ($permissionsIds as $permissionId) {
            $newUser->permissions()->attach($permissionId);
        }
        $newUser->save();

        // Returns new user ID
        return ['data' => $newUser->id];
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        if (!Authorization::hasPermission('admin.users.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => User::with('permissions')->find($id)];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, UserUpdateRequest $request)
    {
        if (!Authorization::hasPermission('admin.users.edit')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Finds user in database
        $user = User::find($id);

        // Clears active user's permissions
        foreach ($user->permissions as $permission) {
            $user->permissions()->detach($permission->id);
        }

        // Edits user's permissions
        $permissionsIds = Input::get('permissions');
        foreach ($permissionsIds as $permissionId) {
            $user->permissions()->attach($permissionId);
        }

        // Checks if password was modified
        $modifiedPassword = Input::get('password');
        if ($modifiedPassword != "") {
            $user->password = Hash::make($modifiedPassword);
        }

        // Checks if email was modified
        $email = Input::get('email');
        $user->email = $email;

        // Saves user's profile
        $user->save();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        if (!Authorization::hasPermission('admin.users.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $user = User::find($id);
        $user->delete();
    }


}
