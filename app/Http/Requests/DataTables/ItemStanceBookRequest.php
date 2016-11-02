<?php namespace GEDB\Http\Requests\DataTables;

use GEDB\Http\Requests\APIFormRequest;

class ItemStanceBookRequest extends APIFormRequest {
    public function rules()
    {
        return [];
    }

    public function authorize()
    {
        return true;
    }
}