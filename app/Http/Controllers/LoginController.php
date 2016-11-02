<?php namespace GEDB\Http\Controllers;

use GEDB\Services\Authorization;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth;
use GEDB\Http\Requests\LoginRequest;

class LoginController extends BaseController {
    public function postLogin(LoginRequest $request)
    {
        $username = Input::get('username');
        $password = Input::get('password');

        if (Auth::check()) {
            return Authorization::makePermissionsAnswer();
        } else {
            if (Auth::attempt(['email' => $username, 'password' => $password], true)) {
                return Authorization::makePermissionsAnswer();
            } else {
                return Response::make(["data" => "Username or password is invalid"], 404);
            }
        }

    }

    public function postRestore()
    {
        // Returns active login to user, be it anonymous or connected
        return Authorization::makePermissionsAnswer();
    }

    public function getLogout()
    {
        if (Auth::check()) {
            Auth::logout();
            return "You are now logged out";
        } else {
            return "You are not logged in";
        }
    }

}
