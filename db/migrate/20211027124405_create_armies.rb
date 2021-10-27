class CreateArmies < ActiveRecord::Migration[6.1]
	def change
		create_table :armies do |t|
			t.string :name
			t.integer :point_battle
			t.integer :command_points
			t.timestamps
		end

		create_table :detachments do |t|
			t.string :name
			t.integer :army_id
			t.integer :detachment_def_id
			t.timestamps
		end

		create_table :detachment_units do |t|
			t.string :type
			t.integer :unit_id
			t.integer :detachment_id
			t.integer :variation_id
			t.timestamps
		end

		create_table :detachment_unit_slots do |t|
			t.integer :detachment_unit_id
			t.integer :slot_id
			t.integer :index
			t.integer :model_id
			t.timestamps
		end
	end
end
