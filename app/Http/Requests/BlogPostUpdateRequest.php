<?php namespace GEDB\Http\Requests;

use GEDB\Http\Requests\APIFormRequest;

class BlogPostUpdateRequest extends APIFormRequest {
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