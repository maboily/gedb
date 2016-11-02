<?php namespace GEDB\DataTables;


use GEDB\DataTables\ListableModelTrait;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use ListableModelTrait;

    protected $table = 'datatable_skill';
    protected $primaryKey = 'ID';

    public static $displayColumns = [
        'AtkLayer',
        'CastSkill',
        'CastTime',
        'ClassName',
        'Desc',
        'DmgTarget',
        'FileName',
        'HateAmnt',
        'HoldTime',
        'IgnoreDEF',
        'MaxR',
        'MinR',
        'Name',
        'OnAll',
        'OnCorpse',
        'OnEnemy',
        'OnOthers',
        'OnParty',
        'OnSquad',
        'OnSummon',
        'OnTeam',
        'PvPFix',
        'SkillType',
        'SklATK',
        'SklLv',
        'SklMedium',
        'SpecDesc0',
        'SpecDesc1',
        'SpecDesc10',
        'SpecDesc11',
        'SpecDesc12',
        'SpecDesc13',
        'SpecDesc14',
        'SpecDesc15',
        'SpecDesc2',
        'SpecDesc3',
        'SpecDesc4',
        'SpecDesc5',
        'SpecDesc6',
        'SpecDesc7',
        'SpecDesc8',
        'SpecDesc9',
        'SpendSP',
        'SplashRange',
        'SplDam',
        'SplLimit',
        'SplType',
        'Target',
        'TargetDesc',
        'ValueType',
        'ID',
    ];

    protected function getListColumns() {
        return static::$displayColumns;
    }
}
