<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersSystem extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('users', function(Blueprint $table) {
            $table->increments('id');

            $table->string('email', 256)->unique();
            $table->string('password', 128);
            $table->string('remember_token', 100);
            $table->dateTime('last_login');

            $table->timestamps();

            $table->engine = 'MyISAM';
        });

        Schema::create('permission_category', function (Blueprint $table) {
            $table->increments('id');

            $table->string('name', 256)->unique();

            $table->engine = 'MyISAM';
        });

        Schema::create('permissions', function(Blueprint $table) {
            $table->increments('id');

            $table->string('name', 128)->unique();
            $table->string('description', 256)->unique();

            $table->integer('permission_category_id')->unsigned();

            $table->engine = 'MyISAM';
        });

        Schema::create('user_permission', function(Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->integer('permission_id')->unsigned();

            $table->engine = 'MyISAM';
        });

        Schema::create('groups', function(Blueprint $table) {
            $table->increments('id');

            $table->string('name', 128)->unique();
            $table->string('description', 256)->unique();

            $table->engine = 'MyISAM';
        });

        Schema::create('user_group', function(Blueprint $table) {
            $table->integer('user_id')->unsigned();
            $table->integer('group_id')->unsigned();

            $table->engine = 'MyISAM';
        });

        Schema::create('permission_group', function(Blueprint $table) {
            $table->integer('permission_id')->unsigned();
            $table->integer('group_id')->unsigned();

            $table->engine = 'MyISAM';
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */ 
	public function down()
	{
		Schema::drop('permission_group');
		Schema::drop('user_group');
        Schema::drop('groups');
        Schema::drop('user_permission');
        Schema::drop('permissions');
        Schema::drop('permission_category');
        Schema::drop('users');
	}
}
