<?php namespace GEDB\Http\Requests;

use GEDB\Http\Requests\APIFormRequest;

class ChangelogRevisionUpdateRequest extends APIFormRequest {
    public function rules()
    {
        return [

        ];
    }

    public function authorize()
    {
        return true;
    }
}