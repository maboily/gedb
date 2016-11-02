<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateThumbnailsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('item_thumbnail', function($table) {
            $table->increments('id');

            $table->string('type', 64);
            $table->string('title', 64);
            $table->integer('item_id')->unsigned();

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
		Schema::drop('item_thumbnail');
	}

}
