<?php namespace GEDB\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Response;
use GEDB\Services\Authorization;
use GEDB\Services\SimpleImage;
use GEDB\ItemThumbnail;

class ItemThumbnailController extends Controller {
    public function show($id)
    {
        if (!Authorization::hasPermission('database.items.thumbnails.view')) {
            return Authorization::makeForbiddenAnswer();
        }

        $useSmall = Input::get('small');

        if ($useSmall !== NULL && $useSmall == "1") {
            return Response::download(base_path() . '/files/thumbnails/' . $id . '_small');
        } else {
            return Response::download(base_path() . '/files/thumbnails/' . $id);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        if (!Authorization::hasPermission('database.items.thumbnails.new')) {
            return Authorization::makeForbiddenAnswer();
        }

        $uploadedFile = Input::file('file');
        $thumbnailTitle = Input::get('title');
        $thumbnailType = Input::get('type');
        $linkedItemId = Input::get('item_id');

        // Inserts thumbnail in database
        $newThumbnail = new ItemThumbnail;
        $newThumbnail->type = $thumbnailType;
        $newThumbnail->item_id = $linkedItemId;
        $newThumbnail->title = $thumbnailTitle;
        $newThumbnail->save();

        // Moves thumbnail to right place (according to id)
        $imagePath = base_path() . '/files/thumbnails/';
        $uploadedFile->move($imagePath, $newThumbnail->id);

        // Creates small thumbnail version
        $smallThumbnail = new SimpleImage($imagePath . $newThumbnail->id);
        $smallThumbnail->best_fit(150, 150)->save($imagePath . $newThumbnail->id . '_small');

        // Returns new thumbnail ID
        return ['data' => $newThumbnail->id];
    }

    public function update($id)
    {
        if (!Authorization::hasPermission('database.items.thumbnails.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Gets edited fields data
        $thumbnailFile = Input::file('file');
        $thumbnailTitle = Input::get('title');

        // Finds existing thumbnail
        $thumbnail = ItemThumbnail::find($id);

        if ($thumbnailTitle !== NULL) {
            $thumbnail->title = $thumbnailTitle;
        }

        // Changes file
        if ($thumbnailFile !== NULL) {
            $imagePath = base_path() . '/files/thumbnails/';

            File::delete($imagePath . $id);
            File::delete($imagePath . $id . '_small');

            $thumbnailFile->move($imagePath, $id);
            $smallThumbnail = new SimpleImage($imagePath . $id);
            $smallThumbnail->best_fit(150, 150)->save($imagePath . $id . '_small');
        }

        $thumbnail->save();
    }

    public function destroy($id)
    {
        if (!Authorization::hasPermission('database.items.thumbnails.delete')) {
            return Authorization::makeForbiddenAnswer();
        }

        // Removes thumbnail from database (and filesystem)
        $thumbnail = Thumbnail::find($id);
        $thumbnail->delete();

        // Deletes it
        File::delete(base_path() . '/files/thumbnails/' . $id);
        File::delete(base_path() . '/files/thumbnails/' . $id . '_small');
    }
}
