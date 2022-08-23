class CreateMatchedPlays < ActiveRecord::Migration[6.1]
	def change
		create_table :matched_plays do |t|
			t.string :name
			t.text :notes
			t.string :faction_a
			t.string :faction_b
			t.integer :detachment_id_a
			t.integer :detachment_id_b
			t.integer :warlord_trait_id_a1
			t.integer :warlord_trait_id_a2
			t.integer :warlord_trait_id_b1
			t.integer :warlord_trait_id_b2
			t.integer :relic_id_a1
			t.integer :relic_id_a2
			t.integer :relic_id_b1
			t.integer :relic_id_b2
			t.integer :detachment_ability_id_a
			t.integer :detachment_ability_id_b
			t.integer :secondary_objective_id_a
			t.integer :secondary_objective_id_b
			t.timestamps
		end

		create_table :warlord_traits do |t|
			t.string :name
			t.text :lore
			t.text :desc
			t.string :faction
			t.timestamps
		end

		create_table :relics do |t|
			t.string :name
			t.text :lore
			t.text :desc
			t.string :faction
			t.timestamps
		end

		create_table :detachment_abilities do |t|
			t.string :name
			t.text :lore
			t.text :desc
			t.string :faction
			t.timestamps
		end

		create_table :secondary_objectives do |t|
			t.string :name
			t.text :lore
			t.text :desc
			t.string :faction
			t.timestamps
		end
	end
end
