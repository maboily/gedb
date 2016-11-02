<?php namespace GEDB\Http\Presenters\DataTables;

use GEDB\Http\Presenters\BaseListPresenter;

class SkillPresenter extends BaseListPresenter {
    public $baseColumnDescriptions = [
        'Name'              => 'Skill Name',
        'SkillType'         => 'Skill Type',
    ];
    public $columnDescriptions = [];

    public $availableFilters = [
        'Name'       => [
            'type'          => 'text',
        ],
        'SkillType'       => [
            'type'          => 'text',
            'enumerate'     => true,
        ],
    ];
    public $availableGroups = [
        [
            'groupName'                 => 'SkillType',
            'groupDirection'            => 'Asc',
        ],
        [
            'groupName'                 => 'SkillType',
            'groupDirection'            => 'Desc',
        ],
    ];
    public $availableSorts = [
        [
            'sortName'                  => 'Name',
            'sortDirection'             => 'Asc',
        ],
        [
            'sortName'                  => 'Name',
            'sortDirection'             => 'Desc',
        ],
    ];

    public $modelClassName = 'GEDB\\DataTables\\Skill';

    public $filterable = true;
    public $groupable = true;
    public $pagination = true;
}