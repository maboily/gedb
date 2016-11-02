<?php namespace GEDB\Http\Requests;

class CWOccupationUpdateRequest extends APIFormRequest {
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