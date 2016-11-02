<?php namespace GEDB;

use Illuminate\Database\Eloquent\Model;
use GEDB\DataTables\ListableModelTrait;

class ChangelogRevision extends Model {
    use ListableModelTrait;

    protected $table = 'changelog_revisions';

    public $timestamps = true;
    protected $fillable = [];

    public function getListColumns()
    {
        return [
            'id',
            'title',
            'created_at',
            'updated_at',
            'is_current'
        ];
    }

    public static function unassignDefaultValues()
    {
        $defaultValues = ChangelogRevision::where('is_current', '=', true)->get();

        foreach ($defaultValues as $defaultValue) {
            $defaultValue->is_current = false;
            $defaultValue->save();
        }
    }
}