class CreateOpenPlays < ActiveRecord::Migration[6.1]
	def change
		create_table :open_plays do |t|
			t.string :name
			t.text :desc
			t.json :teamA
			t.json :teamB

			t.timestamps
		end
	end
end
