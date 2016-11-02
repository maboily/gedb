<?php namespace GEDB\Http\Requests;

use GEDB\Http\Requests\APIFormRequest;

class BlogPostStoreRequest extends APIFormRequest {
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