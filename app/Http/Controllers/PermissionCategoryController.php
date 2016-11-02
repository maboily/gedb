<?php namespace GEDB\Http\Controllers;

use GEDB\Services\Authorization;
use GEDB\Http\Presenters\PermissionListPresenter;
use GEDB\PermissionCategory;

class PermissionCategoryController extends BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if (!Authorization::hasPermission('admin.permissions.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        // We use a custom presenter here, as the format is too specific
        return [
            'data' => PermissionCategory::with('permissions')->get()
        ];
    }

}
