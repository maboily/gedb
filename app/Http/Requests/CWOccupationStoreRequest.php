<?php namespace GEDB\Http\Requests;

class CWOccupationStoreRequest extends APIFormRequest {
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