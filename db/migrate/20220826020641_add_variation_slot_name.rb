class AddVariationSlotName < ActiveRecord::Migration[6.1]
	def change
		add_column :variation_slots, :name, :string, after: :model_type
		add_column :models, :second_points, :integer
		add_column :models, :third_points, :integer
	end
end
