<?php namespace GEDB\DataTables;

use Illuminate\Database\Eloquent\SoftDeletes;
use GEDB\DataTables\ListableModelTrait;
use Illuminate\Database\Eloquent\Model;

abstract class ItemDBModel extends Model
{
    use ListableModelTrait, SoftDeletes;

    protected $primaryKey = 'ID';
    public $timestamps = false;
}