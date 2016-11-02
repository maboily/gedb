<?php namespace GEDB\Http\Requests;

use GEDB\Http\Requests\APIFormRequest;

class UserStoreRequest extends APIFormRequest {
    public function rules()
    {
        return [
            'email' => 'required|unique:users,email|email',
            'password' => 'required',
            'passwordConfirm' => 'required|same:password'
        ];
    }

    public function authorize()
    {
        return true;
    }
}