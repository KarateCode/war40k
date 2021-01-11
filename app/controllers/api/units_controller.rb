class Api::UnitsController < ApplicationController
	def index
		units = Unit.all
		render json: units
	end
end
