<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class CWOccupation extends Model {
    use ListableModelTrait;

    protected $table = 'cw_occupation';

    public $timestamps = false;
    protected $fillable = [];

    public function map()
    {
        return $this->belongsTo('CWMap', 'cw_map_id');
    }

    public function occupation()
    {
        return $this->belongsTo('CWPossibleOccupation', 'cw_possible_occupation_id');
    }

    public function getListColumns()
    {
        return [
            'faction_name',
            'cw_possible_occupation_id',
            'cw_map_id'
        ];
    }
}