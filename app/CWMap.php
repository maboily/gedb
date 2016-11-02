<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class CWMap extends Model {
    use ListableModelTrait;

    protected $table = 'cw_map';

    public $timestamps = true;
    protected $fillable = [];

    public function occupations() {
        return $this->belongsToMany('GEDB\\CWPossibleOccupation', 'cw_occupation', 'cw_map_id', 'cw_possible_occupation_id')->withPivot(['faction_name']);
    }

    public function getListColumns()
    {
        return [
            'id',
            'cw_date',
        ];
    }
}