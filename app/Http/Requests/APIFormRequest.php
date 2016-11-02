<?php namespace GEDB\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Symfony\Component\HttpFoundation\JsonResponse;

class APIFormRequest extends FormRequest {
    public function rules()
    {
        return [
            'username' => 'required'
        ];
    }

    public function response(array $errors)
    {
        return new JsonResponse(['data' => $errors], 422);
    }

    public function authorize()
    {
        return true;
    }
}