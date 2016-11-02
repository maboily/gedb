<?php namespace GEDB\Http\Requests\DataTables;

use GEDB\Http\Requests\APIFormRequest;

class ItemMedalRequest extends APIFormRequest {
    public function rules()
    {
        return [];
    }

    public function authorize()
    {
        return true;
    }
}