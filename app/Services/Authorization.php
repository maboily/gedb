<?php

namespace GEDB\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Response;


class Authorization {
    public static function isConnected() {
        return Auth::check();
    }

    public static function getPermissions() {
        if (Authorization::isConnected()) {
            return Auth::user()->getAllPermissionsNames();
        } else {
            return Config::get('auth.default_permissions');
        }
    }

    public static function makePermissionsAnswer() {
        if (Authorization::isConnected()) {
            $user = Auth::user();
            return [
                'data' => [
                    'username'      => $user->email,
                    'isConnected'   => true,
                    'permissions'   => Authorization::getPermissions()
                ]
            ];
        } else {
            return [
                'data' => [
                    'isConnected'   => false,
                    'permissions'   => Authorization::getPermissions()
                ]
            ];
        }
    }

    public static function hasPermission($permissionString)
    {
        // Replace . with [.]
        $permissionNameExpression = str_replace('.', '[.]', $permissionString);

        // Seeks asterisks
        $lastAsterisk = strrpos($permissionNameExpression, '*');
        if ($lastAsterisk + 1 == strlen($permissionNameExpression)) {
            // Replace last asterisk with full search regex
            $permissionNameExpression =
                substr($permissionNameExpression, 0, $lastAsterisk) .
                '.{1,}' .
                substr($permissionNameExpression, $lastAsterisk + 1, count($permissionNameExpression) - ($lastAsterisk + 1));
        }

        // Replaces other asterisks with standard regexes
        $permissionNameExpression =
            str_replace('*', '[^.]{1,}.', $permissionNameExpression);

        // Search through regex in array
        $activePermissions = Authorization::getPermissions();
        foreach ($activePermissions as $activePermission) {
            if (preg_match("/^{$permissionNameExpression}$/", $activePermission)) {
                // Match was found
                return true;
            }
        }

        return false;
    }

    public static function makeForbiddenAnswer($reason = '') {
        if ($reason != '')
            $reason = " ({$reason})";

        return Response::make(['data' => "Access forbidden{$reason}"], 401);
    }
}