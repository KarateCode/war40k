class AddDescAndExtraPoints < ActiveRecord::Migration[6.1]
	def change
		add_column :units, :desc, :text
		add_column :unit_variations, :extra_points, :integer
	end
end
