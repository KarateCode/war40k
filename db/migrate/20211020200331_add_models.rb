class AddModels < ActiveRecord::Migration[6.1]
	def change
		create_table :models do |t|
			t.string :type
			t.string :name
			t.integer :points
			t.timestamps
		end

		add_column :unit_variations, :number_of_models, :integer
		add_column :unit_variations, :model_types?, :string
		add_column :unit_variations, :upTo, :boolean
	end
end
