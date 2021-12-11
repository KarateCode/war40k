class Api::UnitsController < ApplicationController
	def index
		units = Unit.includes :unit_variations
		render json: units.to_json
	end

	def variation_models
		unit = Unit.find(params[:id])
		model_types = unit.unit_variations
			.map(&:variation_slots)
			.flatten
			.map(&:model_type)
			.uniq

		models = Model.where({type: model_types})

		render json: models
	end

	def all_models
		models = Model.all
		render json: models
	end
end
