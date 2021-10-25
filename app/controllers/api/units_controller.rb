class Api::UnitsController < ApplicationController
	def index
		units = Unit.includes :unit_variations
		render json: units.to_json
	end

	# def variations
	# 	unit = Unit.find(params[:id])
	# 	puts unit.unit_variations.inspect
	# 	render json: unit.unit_variations.to_json
	# end

	def variation_models
		unit = Unit.find(params[:id])
		puts 'params[:id]'
		puts params[:id]
		model_types = unit.unit_variations
			.map(&:variation_slots)
			.flatten
			.map(&:model_type)
			.uniq
		puts 'model_types:'
		puts model_types.inspect
		models = Model.where({type: model_types})
		puts "models:"
		puts models.inspect
		# unit.unit_variations.each do |variation|
		# 	puts variation
		# 	puts variation.variation_slots.inspect
		# end
		# puts unit.unit_variations.inspect
		render json: models
	end
end
