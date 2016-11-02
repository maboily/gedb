<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class CWPossibleOccupation extends Model {
    use ListableModelTrait;

    protected $table = 'cw_possible_occupation';

    public $timestamps = false;
    protected $fillable = [];

    public function getListColumns()
    {
        return [
            'id',
            'x_location',
            'y_location'
        ];
    }
}