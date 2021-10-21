class AddPictureColumn < ActiveRecord::Migration[6.1]
	def change
		add_column :units, :picture, :string
	end
end
