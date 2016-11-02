<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class BlogPost extends Model {
    use ListableModelTrait;

    protected $table = 'blog_posts';

    public $timestamps = false;
    protected $fillable = [];

    public function creator()
    {
        return $this->belongsTo('User', 'creator_id');
    }

    public function getListColumns()
    {
        return [
            'id',
            'title',
            'content',
            'created_at',
            'creator_id',
        ];
    }
}