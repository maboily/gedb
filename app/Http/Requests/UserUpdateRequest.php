<?php namespace GEDB\Http\Requests;

use GEDB\Http\Requests\APIFormRequest;

class UserUpdateRequest extends APIFormRequest {
    public function rules()
    {
        return [
            'email' => 'required|email',
            'passwordConfirm' => 'same:password'
        ];
    }

    public function authorize()
    {
        return true;
    }
}