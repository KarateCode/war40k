class Api::UnitsController < ApplicationController
	def index
		units = Unit.includes :unit_variations
		render json: units.to_json
	end
end
