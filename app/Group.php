<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class Group extends Model {
    use ListableModelTrait;

    protected $table = 'groups';

    public $timestamps = false;
    protected $fillable = [];

    public function permissions()
    {
        return $this->belongsToMany('GEDB\\Permission', 'permission_group');
    }

    public function getListColumns()
    {
        return [
            'id',
            'name'
        ];
    }
}