<?php namespace GEDB\DataTables;


use GEDB\DataTables\ListableModelTrait;
use Illuminate\Database\Eloquent\Model;

class Stance extends Model
{
    use ListableModelTrait;

    protected $table = 'datatable_stance';
    protected $primaryKey = 'ID';

    public function skill1() {
        return $this->hasOne('GEDB\\DataTables\\Skill', 'ID', 'SkillID1')->select(Skill::$displayColumns);
    }

    public function skill2() {
        return $this->hasOne('GEDB\\DataTables\\Skill', 'ID', 'SkillID2')->select(Skill::$displayColumns);
    }

    public function skill3() {
        return $this->hasOne('GEDB\\DataTables\\Skill', 'ID', 'SkillID3')->select(Skill::$displayColumns);
    }

    public function skill4() {
        return $this->hasOne('GEDB\\DataTables\\Skill', 'ID', 'SkillID4')->select(Skill::$displayColumns);
    }

    public function skill5() {
        return $this->hasOne('GEDB\\DataTables\\Skill', 'ID', 'SkillID5')->select(Skill::$displayColumns);
    }

    public function getAsList() {
        return $this->with(['skill1', 'skill2', 'skill3', 'skill4', 'skill5'])->select($this->getListColumns());
    }

    protected function getListColumns() {
        return [
            'AtkType',
            'Desc',
            'Far',
            'FileName',
            'ID',
            'LHits',
            'MagicDef',
            'MaxR',
            'MeleeDef',
            'MinR',
            'Name',
            'RHits',
            'ShootDef',
            'SkillID1',
            'SkillID2',
            'SkillID3',
            'SkillID4',
            'SkillID5',
            'StnATK',
            'StnIgnoreDEFPer',
            'MaxR',
            'EngName',
        ];
    }
}
