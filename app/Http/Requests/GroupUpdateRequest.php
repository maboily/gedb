<?php namespace GEDB\Http\Requests;

use GEDB\Http\Requests\APIFormRequest;

class GroupUpdateRequest extends APIFormRequest {
    public function rules()
    {
        return [
            'name' => 'required',
        ];
    }

    public function authorize()
    {
        return true;
    }
}