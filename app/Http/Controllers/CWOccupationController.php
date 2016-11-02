<?php namespace GEDB\Http\Controllers;

use Illuminate\Support\Facades\Input;
use GEDB\CWOccupation;
use GEDB\Http\Presenters\CWOccupationPresenter;
use GEDB\Http\Requests\CWOccupationStoreRequest;
use GEDB\Http\Requests\CWOccupationUpdateRequest;
use GEDB\Services\Authorization;

class CWOccupationController extends BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if (!Authorization::hasPermission('tools.cwMap.occupation.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return CWOccupationPresenter::present();
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(CWOccupationStoreRequest $request)
    {
        if (!Authorization::hasPermission('tools.cwMap.occupation.new')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Attempts to create new changelog
        $newCWOccupation = new CWOccupation;
        $newCWOccupation->cw_date = Input::get('cw_date');

        $newCWOccupation->save();

        // Returns new changelog's revision ID
        return ['data' => $newCWOccupation->id];
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        if (!Authorization::hasPermission('tools.cwMap.occupation.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => CWOccupation::find($id)];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, CWOccupationUpdateRequest $request)
    {
        if (!Authorization::hasPermission('tools.cwMap.occupation.edit')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Finds map in database
        $cwOccupation = CWOccupation::find($id);
        $cwOccupation->faction_name = Input::get('faction_name');

        // Saves map
        $cwOccupation->save();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        if (!Authorization::hasPermission('tools.cwMap.occupation.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $cwOccupation = CWOccupation::find($id);
        $cwOccupation->delete();
    }
} 