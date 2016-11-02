<?php namespace GEDB\Http\Controllers;

use Illuminate\Support\Facades\View;

class HomeController extends BaseController {
    public function index() {
        return View::make('index');
    }
}
