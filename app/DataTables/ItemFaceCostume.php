<?php namespace GEDB\DataTables;

class ItemFaceCostume extends ItemDBModel
{
    protected $table = 'datatable_item_face';

    public function recipe() {
        return $this->hasOne('GEDB\\Recipe', 'Target', 'ID')->select([
            'ID', 'Target', 'RecipeLv', 'CharName'
        ]);
    }

    public function getAsList() {
        return $this->with(['recipe.ingredients'])->select($this->getListColumns());
    }

    protected function getListColumns() {
        return [
            'ID',
            'Desc',
            'AR',
            'ASPD',
            'ATK',
            'BeastBane',
            'BLK',
            'CRT',
            'DEF',
            'DefIP',
            'deleted_at',
            'DemonBane',
            'FileName',
            'FireATK',
            'FireIP',
            'GolemBane',
            'HPDrain',
            'HR',
            'HumanBane',
            'IMP',
            'IceATK',
            'IceIP',
            'ImgName',
            'IncAGI',
            'IncCHA',
            'IncCON',
            'IncDEX',
            'IncINT',
            'IncSTR',
            'ItemName',
            'LghtATK',
            'LgtIP',
            'MHP',
            'MSP',
            'MSPD',
            'PR',
            'PsyATK',
            'PsyIP',
            'RFIRE',
            'RHP',
            'RICE',
            'RLGHT',
            'RPSY',
            'RSP',
            'RSTAT',
            'RedFIRE',
            'RedICE',
            'RedLGHT',
            'RedMEL',
            'RedPSY',
            'RedSHT',
            'RendBlind',
            'RendBurning',
            'RendFear',
            'RendFreeze',
            'RendPoison',
            'RendShock',
            'RendStun',
            'ReqToolTip',
            'ShldDR',
            'UndeadBane',
        ];
    }
}
