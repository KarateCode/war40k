# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_07_27_130653) do

  create_table "armies", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.integer "point_battle"
    t.integer "command_points"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "detachment_abilities", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.text "lore"
    t.text "desc"
    t.string "faction"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "detachment_defs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.integer "hq_min"
    t.integer "hq_max"
    t.integer "troop_min"
    t.integer "troop_max"
    t.integer "elite_min"
    t.integer "elite_max"
    t.integer "fast_attack_min"
    t.integer "fast_attack_max"
    t.integer "heavy_support_min"
    t.integer "heavy_support_max"
    t.integer "flyer_min"
    t.integer "flyer_max"
    t.integer "fortification_min"
    t.integer "fortification_max"
    t.integer "lord_of_war_min"
    t.integer "lord_of_war_max"
    t.integer "command_cost"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "restrictions"
    t.string "command_benefits"
    t.string "dedicated_transports"
  end

  create_table "detachment_unit_slots", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "detachment_unit_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "slot_def_id"
    t.string "model_type"
    t.json "models"
  end

  create_table "detachment_units", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "type"
    t.integer "unit_id"
    t.integer "detachment_id"
    t.integer "variation_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "detachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.integer "army_id"
    t.integer "detachment_def_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "points"
  end

  create_table "matched_plays", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.text "notes"
    t.string "faction_a"
    t.string "faction_b"
    t.integer "detachment_id_a"
    t.integer "detachment_id_b"
    t.integer "warlord_trait_id_a1"
    t.integer "warlord_trait_id_a2"
    t.integer "warlord_trait_id_b1"
    t.integer "warlord_trait_id_b2"
    t.integer "relic_id_a1"
    t.integer "relic_id_a2"
    t.integer "relic_id_b1"
    t.integer "relic_id_b2"
    t.integer "detachment_ability_id_a"
    t.integer "detachment_ability_id_b"
    t.integer "secondary_objective_id_a"
    t.integer "secondary_objective_id_b"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "models", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "type"
    t.string "name"
    t.integer "points"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "open_plays", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.text "desc"
    t.json "teamA"
    t.json "teamB"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "relics", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.text "lore"
    t.text "desc"
    t.string "faction"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "secondary_objectives", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.text "lore"
    t.text "desc"
    t.string "faction"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "unit_variations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "unit_id"
    t.string "name"
    t.integer "extra_power"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "extra_points"
  end

  create_table "units", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.integer "power"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "picture"
    t.string "color"
    t.integer "points"
    t.text "desc"
    t.string "keywords"
    t.string "battlefield_role"
  end

  create_table "variation_slots", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "model_type"
    t.integer "number_of_models"
    t.boolean "upTo"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "unit_variation_id"
  end

  create_table "warlord_traits", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.text "lore"
    t.text "desc"
    t.string "faction"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
