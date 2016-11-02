<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class Enchantment extends Model {
    use ListableModelTrait;

    protected $table = 'datatable_itemopt';

    public $timestamps = false;
    protected $fillable = [];

    public function enchant_group() {
        return $this->hasOne('GEDB\\EnchantGroup', 'enchant_group_id');
    }

    public function getListColumns()
    {
        return [
            'id',
            'name'
        ];
    }
}