class CreateUnitVariations < ActiveRecord::Migration[6.1]
	def change
		create_table :unit_variations do |t|
			t.integer :unit_id
			t.string :name
			t.integer :extra_power
			t.timestamps
		end
	end
end
