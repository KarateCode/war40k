class AddKeywords < ActiveRecord::Migration[6.1]
	def change
		add_column :units, :keywords, :string
		add_column :units, :battlefield_role, :string
	end
end
