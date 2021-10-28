class AddDetachmentDescriptions < ActiveRecord::Migration[6.1]
	def change
		remove_column :detachment_defs, :desc
		add_column :detachment_defs, :restrictions, :string
		add_column :detachment_defs, :command_benefits, :string
		add_column :detachment_defs, :dedicated_transports, :string
	end
end
