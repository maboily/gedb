<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class EnchantGroup extends Model {
    use ListableModelTrait;

    protected $table = 'enchant_groups';
    protected $primaryKey = 'enchant_group_id';

    public $timestamps = false;
    protected $fillable = [];

    public function enchantments()
    {
        return $this->hasMany('GEDB\\Enchantment', 'enchant_group_id');
    }

    public function armors()
    {
        return $this->hasMany('GEDB\\DataTables\\ItemArmor', 'enchant_group_id');
    }

    public function getListColumns()
    {
        return [
            'id',
            'name'
        ];
    }
}