<?php namespace GEDB\Http\Requests\DataTables;

use GEDB\Http\Requests\APIFormRequest;

class ItemOtherRequest extends APIFormRequest {
    public function rules()
    {
        return [];
    }

    public function authorize()
    {
        return true;
    }
}