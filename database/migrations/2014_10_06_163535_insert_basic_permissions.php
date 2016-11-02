<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

class InsertBasicPermissions extends Migration {

    protected $permissionCategories = [
        'Database' => [
            ['name' => 'database.view', 'description' => 'View Database'],
        ],

        'Items Database' => [
            ['name' => 'database.items.view', 'description' => 'View Items Database'],
            ['name' => 'database.items.armors.view', 'description' => 'View Armors'],
            ['name' => 'database.items.armors.extendedView', 'description' => 'Extended Armors View'],
            ['name' => 'database.items.armors.edit', 'description' => 'Edit Armors'],
            ['name' => 'database.items.armors.delete', 'description' => 'Delete/Restore Armors'],
            ['name' => 'database.items.artifacts.view', 'description' => 'View Artifacts'],
            ['name' => 'database.items.artifacts.extendedView', 'description' => 'Extended Artifacts View'],
            ['name' => 'database.items.artifacts.delete', 'description' => 'Delete/Restore Artifacts'],
            ['name' => 'database.items.backCostumes.view', 'description' => 'View Back Costumes'],
            ['name' => 'database.items.backCostumes.extendedView', 'description' => 'Extended Back Costumes View'],
            ['name' => 'database.items.backCostumes.delete', 'description' => 'Delete/Restore Back Costumes'],
            ['name' => 'database.items.belts.view', 'description' => 'View Belts'],
            ['name' => 'database.items.belts.extendedView', 'description' => 'Extended Belts View'],
            ['name' => 'database.items.belts.delete', 'description' => 'Delete/Restore Belts'],
            ['name' => 'database.items.boots.view', 'description' => 'View Boots'],
            ['name' => 'database.items.boots.extendedView', 'description' => 'Extended Boots View'],
            ['name' => 'database.items.boots.delete', 'description' => 'Delete/Restore Boots'],
            ['name' => 'database.items.consumables.view', 'description' => 'View Consumables'],
            ['name' => 'database.items.consumables.extendedView', 'description' => 'Extended Consumables View'],
            ['name' => 'database.items.consumables.delete', 'description' => 'Delete/Restore Consumables'],
            ['name' => 'database.items.costumes.view', 'description' => 'View Costumes'],
            ['name' => 'database.items.costumes.extendedView', 'description' => 'Extended Costumes View'],
            ['name' => 'database.items.costumes.delete', 'description' => 'Delete/Restore Costumes'],
            ['name' => 'database.items.earrings.view', 'description' => 'View Earrings'],
            ['name' => 'database.items.earrings.extendedView', 'description' => 'Extended Earrings View'],
            ['name' => 'database.items.earrings.delete', 'description' => 'Delete/Restore Earrings'],
            ['name' => 'database.items.faceCostumes.view', 'description' => 'View Face Costumes'],
            ['name' => 'database.items.faceCostumes.extendedView', 'description' => 'Extended Face Costumes View'],
            ['name' => 'database.items.faceCostumes.delete', 'description' => 'Delete/Restore Face Costumes'],
            ['name' => 'database.items.gloves.view', 'description' => 'View Gloves'],
            ['name' => 'database.items.gloves.extendedView', 'description' => 'Extended Gloves View'],
            ['name' => 'database.items.gloves.delete', 'description' => 'Delete/Restore Gloves'],
            ['name' => 'database.items.medals.view', 'description' => 'View Medals'],
            ['name' => 'database.items.medals.extendedView', 'description' => 'Extended Medals View'],
            ['name' => 'database.items.medals.delete', 'description' => 'Delete/Restore Medals'],
            ['name' => 'database.items.necklaces.view', 'description' => 'View Necklaces'],
            ['name' => 'database.items.necklaces.extendedView', 'description' => 'Extended Necklaces View'],
            ['name' => 'database.items.necklaces.delete', 'description' => 'Delete/Restore Necklaces'],
            ['name' => 'database.items.others.view', 'description' => 'View Other Items'],
            ['name' => 'database.items.others.extendedView', 'description' => 'Extended Other View'],
            ['name' => 'database.items.others.delete', 'description' => 'Delete/Restore Other Items'],
            ['name' => 'database.items.quests.view', 'description' => 'View Quest Items'],
            ['name' => 'database.items.quests.extendedView', 'description' => 'Extended Quest Items View'],
            ['name' => 'database.items.quests.delete', 'description' => 'Delete/Restore Quest Items'],
            ['name' => 'database.items.recipes.view', 'description' => 'View Recipes'],
            ['name' => 'database.items.recipes.extendedView', 'description' => 'Extended Recipes View'],
            ['name' => 'database.items.recipes.delete', 'description' => 'Delete/Restore Recipes'],
            ['name' => 'database.items.rings.view', 'description' => 'View Rings'],
            ['name' => 'database.items.rings.extendedView', 'description' => 'Extended Rings View'],
            ['name' => 'database.items.rings.delete', 'description' => 'Delete/Restore Rings'],
            ['name' => 'database.items.stanceBooks.view', 'description' => 'View Stance Books'],
            ['name' => 'database.items.stanceBooks.extendedView', 'description' => 'Extended Stance Books View'],
            ['name' => 'database.items.stanceBooks.delete', 'description' => 'Delete/Restore Stance Books'],
            ['name' => 'database.items.weapons.view', 'description' => 'View Weapons'],
            ['name' => 'database.items.weapons.extendedView', 'description' => 'Extended Weapons View'],
            ['name' => 'database.items.weapons.delete', 'description' => 'Delete/Restore Weapons'],
            ['name' => 'database.items.thumbnails.view', 'description' => 'View Thumbnails'],
            ['name' => 'database.items.thumbnails.edit', 'description' => 'Edit Thumbnails'],
            ['name' => 'database.items.thumbnails.new', 'description' => 'Create Thumbnails'],
            ['name' => 'database.items.thumbnails.delete', 'description' => 'Delete Thumbnails'],
        ],

        'Stances/Skills/Characters Database' => [
            ['name' => 'database.skills.view', 'description' => 'View Skills Database'],
            ['name' => 'database.skills.extendedView', 'description' => 'Extended Skills View'],
            ['name' => 'database.stances.view', 'description' => 'View Stances Database'],
            ['name' => 'database.stances.extendedView', 'description' => 'Extended Stances View'],
            ['name' => 'database.characters.view', 'description' => 'View Characters Database'],
            ['name' => 'database.characters.extendedView', 'description' => 'Extended Characters View'],
        ],

        'Administration' => [
            ['name' => 'admin.view', 'description' => 'View Administration Dashboard'],
        ],

        'Users Administration' => [
            ['name' => 'admin.users.view', 'description' => 'View Users'],
            ['name' => 'admin.users.edit', 'description' => 'Edit User'],
            ['name' => 'admin.users.delete', 'description' => 'Delete User'],
            ['name' => 'admin.users.new', 'description' => 'Create New User'],
        ],

        'Groups Administration' => [
            ['name' => 'admin.groups.view', 'description' => 'View Groups'],
            ['name' => 'admin.groups.edit', 'description' => 'Edit Group'],
            ['name' => 'admin.groups.delete', 'description' => 'Delete Group'],
            ['name' => 'admin.groups.new', 'description' => 'Create New Group'],
        ],

        'Permissions Administration' => [
            ['name' => 'admin.permissions.view', 'description' => 'View Permissions'],
        ],

        'Changelogs' => [
            ['name' => 'tools.changelog.view', 'description' => 'View Changelog'],
            ['name' => 'tools.changelog.edit', 'description' => 'Edit Changelog Revision'],
            ['name' => 'tools.changelog.new', 'description' => 'Create Changelog Revision'],
            ['name' => 'tools.changelog.delete', 'description' => 'Delete Changelog Revision'],
        ],

        'Colony War Maps' => [
            ['name' => 'tools.cwMap.view', 'description' => 'View Colony War Maps'],
            ['name' => 'tools.cwMap.new', 'description' => 'New Colony War Map'],
            ['name' => 'tools.cwMap.edit', 'description' => 'Edit Colony War Map'],
            ['name' => 'tools.cwMap.delete', 'description' => 'Delete Colony War Map'],
            ['name' => 'tools.cwMap.possibleOccupation.view', 'description' => 'View Possible Occupation Points'],
            ['name' => 'tools.cwMap.occupation.view', 'description' => 'View Occupation'],
            ['name' => 'tools.cwMap.occupation.new', 'description' => 'New Occupation'],
            ['name' => 'tools.cwMap.occupation.edit', 'description' => 'Edit Occupation'],
            ['name' => 'tools.cwMap.occupation.delete', 'description' => 'Delete Occupation'],
        ],

        'Blog' => [
            ['name' => 'blog.view', 'description' => 'View Blog Posts'],
            ['name' => 'blog.edit', 'description' => 'Edit Blog Post'],
            ['name' => 'blog.new', 'description' => 'Create Blog Post'],
        ],
    ];

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
    {
        // Creates a dummy admin account
        $adminId = DB::table('users')->insertGetId(
            [
                'email'         => 'admin@example.com',
                'password'      => Hash::make('admin129')
            ]
        );

        // Creates permission categories
        foreach ($this->permissionCategories as $permissionCategoryName => $permissions) {
            $permissionGroupId = DB::table('permission_category')->insertGetId(['name' => $permissionCategoryName]);

            // Append ID column to permissions
            foreach ($permissions as $permissionKey => $permission) {
                $permissions[$permissionKey]['permission_category_id'] = $permissionGroupId;
            }

            // Inserts permissions
            DB::table('permissions')->insert($permissions);
        }

        // Links all permissions to this account
        $allPermissions = DB::table('permissions')->get();
        foreach ($allPermissions as $permission) {
            DB::table('user_permission')->insert([
                'user_id'       => $adminId,
                'permission_id' => $permission->id
            ]);
        }
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        // We leave the data be, the initial migration will most likely take care of it if this migration is ever ran anyway
	}

}
