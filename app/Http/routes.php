<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::group(['middleware' => 'auth.basic.configured'], function() {
    // Default index route (displays main page)
    Route::get('/', ['uses' => 'HomeController@index', 'as' => 'index']);

    // Routes for misc. elements
    Route::resource('changelogs', 'ChangelogRevisionController');
    Route::resource('cw-maps', 'CWMapController');
    Route::resource('cw-possible-occupations', 'CWPossibleOccupationController');
    Route::resource('cw-occupations', 'CWOccupationsController');

    // Items database routes (API routes)
    Route::resource('armors', 'DataTables\ItemArmorController');
    Route::resource('artifacts', 'DataTables\ItemArtifactController');
    Route::resource('back-costumes', 'DataTables\ItemBackCostumeController');
    Route::resource('belts', 'DataTables\ItemBeltController');
    Route::resource('boots', 'DataTables\ItemBootController');
    Route::resource('costumes', 'DataTables\ItemCostumeController');
    Route::resource('consumables', 'DataTables\ItemConsumableController');
    Route::resource('earrings', 'DataTables\ItemEarringController');
    Route::resource('face-costumes', 'DataTables\ItemFaceCostumeController');
    Route::resource('gloves', 'DataTables\ItemGloveController');
    Route::resource('medals', 'DataTables\ItemMedalController');
    Route::resource('necklaces', 'DataTables\ItemNecklaceController');
    Route::resource('others', 'DataTables\ItemOtherController');
    Route::resource('quests', 'DataTables\ItemQuestController');
    Route::resource('recipes', 'DataTables\ItemRecipeController');
    Route::resource('rings', 'DataTables\ItemRingController');
    Route::resource('stance-books', 'DataTables\ItemStanceBookController');
    Route::resource('weapons', 'DataTables\ItemWeaponController');
    Route::resource('thumbnails', 'ItemThumbnailController');

    // Skills, stances and characters databases
    Route::resource('skills', 'DataTables\SkillController');
    Route::resource('stances', 'DataTables\StanceController');

    // Login routes
    Route::post('login', ['uses' => 'LoginController@postLogin', 'as' => 'login']);
    Route::post('restore', ['uses' => 'LoginController@postRestore', 'as' => 'restore']);
    Route::get('logout', ['uses' => 'LoginController@getLogout', 'as' => 'logout']);

    // Admin routes
    Route::resource('permissions', 'PermissionController');
    Route::resource('permissions-categories', 'PermissionCategoryController');
    Route::resource('groups', 'GroupController');
    Route::resource('users', 'UserController');
});