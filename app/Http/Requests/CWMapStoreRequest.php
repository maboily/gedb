<?php namespace GEDB\Http\Requests;

class CWMapStoreRequest extends APIFormRequest {
    public function rules()
    {
        return [
            'cw_date' => 'unique:cw_map|date'
        ];
    }

    public function authorize()
    {
        return true;
    }
}