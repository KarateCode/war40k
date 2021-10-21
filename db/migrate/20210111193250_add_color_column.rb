class AddColorColumn < ActiveRecord::Migration[6.1]
	def change
		add_column :units, :color, :string
	end
end
