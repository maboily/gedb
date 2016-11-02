<?php namespace GEDB\Http\Controllers;

use Illuminate\Support\Facades\Input;
use GEDB\CWMap;
use GEDB\Http\Presenters\CWMapPresenter;
use GEDB\Http\Requests\CWMapStoreRequest;
use GEDB\Http\Requests\CWMapUpdateRequest;
use GEDB\Services\Authorization;
use GEDB\CWOccupation;

class CWMapController extends BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        if (!Authorization::hasPermission('tools.cwMap.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return CWMapPresenter::present();
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store(CWMapStoreRequest $request)
    {
        if (!Authorization::hasPermission('tools.cwMap.new')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Attempts to create new map
        $newCWMap = new CWMap;
        $newCWMap->cw_date = Input::get('cw_date');
        $newCWMap->save();

        // Checks if user can save occupation data
        if (Authorization::hasPermission('tools.cwMap.occupation.new')) {
            $occupations = Input::get('occupations');

            foreach ($occupations as $occupationId => $occupationName) {
                // Checks if occupation already exists
                $occupation = new CWOccupation;
                $occupation->cw_map_id = $newCWMap->id;
                $occupation->cw_possible_occupation_id = $occupationId;
                $occupation->faction_name = $occupationName;
                $occupation->save();
            }
        }

        // Returns new changelog's revision ID
        return ['data' => $newCWMap->id];
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        if (!Authorization::hasPermission('tools.cwMap.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        return ['data' => CWMap::with(['occupations'])->find($id)];
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id, CWMapUpdateRequest $request)
    {
        if (!Authorization::hasPermission('tools.cwMap.edit')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Finds map in database
        $cwMap = CWMap::find($id);
        $cwMap->cw_date = Input::get('cw_date');

        // Checks if user can save occupation data
        if (Authorization::hasPermission(('tools.cwMap.occupation.edit'))) {
            $occupations = Input::get('occupations');

            foreach ($occupations as $occupationId => $occupationName) {
                $occupation = CWOccupation::where('cw_map_id', $cwMap->id)
                    ->where('cw_possible_occupation_id', $occupationId)
                    ->first();

                if ($occupation === null) {
                    $occupation = new CWOccupation();
                }

                $occupation->cw_map_id = $cwMap->id;
                $occupation->cw_possible_occupation_id = $occupationId;
                $occupation->faction_name = $occupationName;
                $occupation->save();
            }
        }

        // Saves map
        $cwMap->save();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        if (!Authorization::hasPermission('tools.cwMap.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        $cwMap = CWMap::find($id);
        $cwMap->delete();
    }
} 