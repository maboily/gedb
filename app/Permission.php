<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class Permission extends Model {
    use ListableModelTrait;

    protected $table = 'permissions';

    public $timestamps = false;
    protected $fillable = [];

    public function category() {
        return $this->hasOne('GEDB\\PermissionCategory');
    }

    public function getListColumns() {
        return [
            'id',
            'name',
            'description'
        ];
    }
}