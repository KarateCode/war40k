class AddModels < ActiveRecord::Migration[6.1]
	def change
		create_table :models do |t|
			t.string :type
			t.string :name
			t.integer :points
			t.timestamps
		end

		create_table :variation_slots do |t|
			t.string :model_type
			t.integer :number_of_models
			t.integer :unit_variation_id
			t.boolean :upTo
			t.timestamps
		end
	end
end
