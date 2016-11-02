<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class Recipe extends Model {
    use ListableModelTrait;

    protected $table = 'datatable_itemmake';

    public $timestamps = false;
    protected $fillable = [];
    protected $primaryKey = 'ID';

    public function ingredients() {
        return $this->belongsToMany('GEDB\\DataTables\\ItemOther', 'items_recipes_ingredients', 'recipe_id', 'ingredient_id')->withPivot(['ingredient_amount'])->select([
            'ItemName', 'ID', 'ImgName', 'FileName'
        ]);
    }

    public function getListColumns()
    {
        return [
            'id',
            'name'
        ];
    }
}