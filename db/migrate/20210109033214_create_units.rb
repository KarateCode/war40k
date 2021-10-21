class CreateUnits < ActiveRecord::Migration[6.1]
	def change
		create_table :units do |t|
			t.string :name
			t.string :picture
			t.string :color
			t.integer :power
			t.integer :points
			t.text :desc
			t.timestamps
		end
	end
end
