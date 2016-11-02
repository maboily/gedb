<?php namespace GEDB\Http\Requests;

use GEDB\Http\Requests\APIFormRequest;

class GroupStoreRequest extends APIFormRequest {
    public function rules()
    {
        return [
            'name' => 'required|unique:groups,name',
        ];
    }

    public function authorize()
    {
        return true;
    }
}