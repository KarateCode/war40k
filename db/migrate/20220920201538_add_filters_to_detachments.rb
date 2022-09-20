class AddFiltersToDetachments < ActiveRecord::Migration[6.1]
	def change
		add_column :detachments, :filters, :string
	end
end
