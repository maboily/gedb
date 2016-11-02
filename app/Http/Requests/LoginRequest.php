<?php namespace GEDB\Http\Requests;

use GEDB\Http\Requests\APIFormRequest;

class LoginRequest extends APIFormRequest {
    public function rules()
    {
        return [
            'username' => 'required',
            'password' => 'required'
        ];
    }

    public function authorize()
    {
        return true;
    }
}