class AddDatasheetLinks < ActiveRecord::Migration[6.1]
	def change
		add_column :units, :datasheet_link, :string
	end
end
