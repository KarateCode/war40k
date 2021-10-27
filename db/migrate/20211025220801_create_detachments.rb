class CreateDetachments < ActiveRecord::Migration[6.1]
	def change
		create_table :detachment_defs do |t|
			t.string :name
			t.integer :hq_min
			t.integer :hq_max
			t.integer :troop_min
			t.integer :troop_max
			t.integer :elite_min
			t.integer :elite_max
			t.integer :fast_attack_min
			t.integer :fast_attack_max
			t.integer :heavy_support_min
			t.integer :heavy_support_max
			t.integer :flyer_min
			t.integer :flyer_max
			t.integer :fortification_min
			t.integer :fortification_max
			t.integer :lord_of_war_min
			t.integer :lord_of_war_max
			t.integer :command_cost
			t.text :desc
			t.timestamps
		end
	end
end
