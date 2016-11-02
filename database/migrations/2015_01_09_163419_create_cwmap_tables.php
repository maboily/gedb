<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCwmapTables extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::create('cw_map', function($table) {
            $table->increments('id');

            $table->date('cw_date');

            $table->timestamps();

            $table->engine = 'MyISAM';
        });

        Schema::create('cw_possible_occupation', function($table) {
            $table->increments('id');

            $table->integer('x_location');
            $table->integer('y_location');
            $table->string('description', 256);

            $table->engine = 'MyISAM';
        });

        Schema::create('cw_occupation', function($table) {
            $table->integer('cw_possible_occupation_id')->unsigned();
            $table->integer('cw_map_id')->unsigned();

            $table->string('faction_name', 64);

            $table->primary(['cw_possible_occupation_id', 'cw_map_id']);

            $table->engine = 'MyISAM';
        });

        DB::table('cw_possible_occupation')->insert(['x_location' => 616, 'y_location' => 195, 'description' => 'Katovic Snowfield']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 760, 'y_location' => 312, 'description' => 'Pradera de Ceniza']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 930, 'y_location' => 364, 'description' => 'El Tejado Verde']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 1155, 'y_location' => 344, 'description' => 'El Lago de Tres Hermanas']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 1260, 'y_location' => 388, 'description' => 'Porto Bello: A Deserted Quay']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 1070, 'y_location' => 445, 'description' => 'Via Fluvial']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 854, 'y_location' => 508, 'description' => 'The Rion Prairie']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 440, 'y_location' => 635, 'description' => 'Ustiur, Zona Dos']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 462, 'y_location' => 706, 'description' => 'Ustiur, Zona Uno']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 207, 'y_location' => 983, 'description' => 'Bahama: Swamp of Peril']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 875, 'y_location' => 713, 'description' => 'The Ferrucio Junction']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 1074, 'y_location' => 796, 'description' => 'The King\'s Garden']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 955, 'y_location' => 649, 'description' => 'Lago Celeste']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 1067, 'y_location' => 628, 'description' => 'The Tetra Hill']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 1135, 'y_location' => 598, 'description' => 'The Old Port of Coimbra']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 1245, 'y_location' => 594, 'description' => 'Jezebel Glen']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 965, 'y_location' => 532, 'description' => 'Abertal']);
        DB::table('cw_possible_occupation')->insert(['x_location' => 750, 'y_location' => 503, 'description' => 'The Bonavista River']);
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('cw_occupation');
		Schema::drop('cw_possible_occupation');
        Schema::drop('cw_map');
	}

}
