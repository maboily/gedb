<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;

class PermissionGroup extends Model {
    protected $table = 'permission_group';

    public $timestamps = false;
    protected $fillable = [];
}