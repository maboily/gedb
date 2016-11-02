<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class ItemThumbnail extends Model {
    use ListableModelTrait;

    protected $table = 'item_thumbnail';

    public $timestamps = true;
    protected $fillable = [];

    public function getListColumns()
    {
        return [
            'id',
            'title',
            'item_id',
            'created_at',
            'updated_at'
        ];
    }
}