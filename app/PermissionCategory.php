<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;

class PermissionCategory extends Model {
    protected $table = 'permission_category';

    public $timestamps = false;
    protected $fillable = [];

    public function permissions()
    {
        return $this->hasMany('GEDB\\Permission');
    }
}