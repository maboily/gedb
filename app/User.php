<?php namespace GEDB;

use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use GEDB\DataTables\ListableModelTrait;
use GEDB\Permission;
use GEDB\PermissionGroup;

class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{
    use Authenticatable, CanResetPassword, ListableModelTrait;

    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $hidden = array('password', 'remember_token');

    public function permissions()
    {
        return $this->belongsToMany('GEDB\\Permission', 'user_permission');
    }

    public function groups()
    {
        return $this->belongsToMany('GEDB\\PermissionGroup', 'user_group');
    }

    public function getAllPermissions()
    {
        $individualPermissions = $this->getIndividualPermissions();
        $groupPermissions = $this->getGroupPermissions();

        // Returns all permissions available to the user
        return $individualPermissions->merge($groupPermissions)->unique();
    }

    public function getAllPermissionsNames()
    {
        // Formats permissions
        $formattedPermissions = [];
        foreach ($this->getAllPermissions() as $permission) {
            $formattedPermissions[] = $permission->name;
        }

        return $formattedPermissions;
    }

    public function getIndividualPermissions()
    {
        // Individual permissions
        $individualPermissions = $this->permissions;

        // Concatenates permissions
        $concatenatedPermissions = new Collection();
        foreach ($individualPermissions as $individualPermission) {
            $concatenatedPermissions->push($individualPermission);
        }

        return $concatenatedPermissions->unique();
    }

    public function getGroupPermissions()
    {
        // Seeks user's groups
        $userGroups = $this->groups()->with('permissions');

        // Concatenates permissions for groups
        $concatenatedPermissions = new Collection();
        foreach ($userGroups as $userGroup) {
            foreach ($userGroup->permissions as $groupPermission) {
                $concatenatedPermissions->push($groupPermission);
            }
        }

        return $concatenatedPermissions->unique();
    }

    public function hasPermission($permissionString)
    {
        // Replace . with [.]
        $permissionNameExpression = str_replace('.', '[.]', $permissionString);

        // Seeks asterisks
        $lastAsterisk = strrpos($permissionNameExpression, '*');
        if ($lastAsterisk + 1 == count($permissionNameExpression)) {
            // Replace last asterisk with full search regex
            $permissionNameExpression =
                substr($permissionNameExpression, 0, $lastAsterisk) +
                '.{1,}' +
                substr($permissionNameExpression, $lastAsterisk + 1, count($permissionNameExpression) - ($lastAsterisk + 1));
        }

        // Replaces other asterisks with standard regexes
        $permissionNameExpression =
            str_replace('*', '[^.]{1,}', $permissionNameExpression);

        // Search through regex in array
        $activePermissions = $this->getAllPermissions();
        foreach ($activePermissions as $activePermission) {
            if (preg_match("^{$permissionNameExpression}$", $activePermission)) {
                // Match was found
                return true;
            }
        }

        return false;
    }

    public function presentAsList()
    {
        return UserListPresenter::present($this);
    }

    public function getLoginAnswer()
    {
        // Formats permissions
        $formattedPermissions = [];
        foreach ($this->getAllPermissions() as $permission) {
            $formattedPermissions[] = $permission->name;
        }

        return [
            'data' => [
                'username'      => $this->username,
                'isConnected'   => true,
                'permissions'   => $formattedPermissions
            ]
        ];
    }

    public function getListColumns()
    {
        return [
            'id',
            'email'
        ];
    }
}
