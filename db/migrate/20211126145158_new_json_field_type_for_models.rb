class NewJsonFieldTypeForModels < ActiveRecord::Migration[6.1]
	def change
		remove_column :detachment_unit_slots, :slot_id, :integer
		remove_column :detachment_unit_slots, :index, :integer
		remove_column :detachment_unit_slots, :model_id, :integer
		add_column :detachment_unit_slots, :slot_def_id, :integer
		add_column :detachment_unit_slots, :model_type, :string
		add_column :detachment_unit_slots, :models, :json
	end
end
