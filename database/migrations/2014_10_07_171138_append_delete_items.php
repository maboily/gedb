<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AppendDeleteItems extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        // NOTE: This migration is now unnecessary, please use PostMigrate.sql instead.
		/*Schema::table('datatable_item_achieve', function(Blueprint $table) {
            $table->softDeletes();
        });

		Schema::table('datatable_item_armor', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_artifact', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_back', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_belt', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_boots', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_consume', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_earring', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_etc', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_face', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_glove', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_head', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_neck', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_quest', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_recipe', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_ring', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_scroll', function(Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('datatable_item_weapon', function(Blueprint $table) {
            $table->softDeletes();
        });*/
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        /*Schema::table('datatable_item_achieve', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_armor', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_artifact', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_back', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_belt', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_boots', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_consume', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_earring', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_etc', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_face', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_glove', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_head', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_neck', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_quest', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_recipe', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_ring', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_scroll', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('datatable_item_weapon', function(Blueprint $table) {
            $table->dropSoftDeletes();
        });*/
	}

}
