<?php

use Illuminate\Database\Migrations\Migration;

class CreateChangelogTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('changelog_revisions', function($table) {
            $table->increments('id');

            $table->mediumtext('content');
            $table->boolean('is_current');
            $table->string('title', 256);

            $table->timestamps();

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
		Schema::drop('changelog_revisions');
	}

}
