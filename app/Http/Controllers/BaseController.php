<?php namespace GEDB\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller;
use Illuminate\Foundation\Validation\ValidatesRequests;

class BaseController extends Controller {
    use DispatchesJobs, ValidatesRequests;
}
