<?php namespace GEDB\Http\Requests;

class CWMapUpdateRequest extends APIFormRequest {
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