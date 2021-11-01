class Api::DetachmentsController < ApplicationController
	def create
		detachment = Detachment.create detachment_params
		render json: detachment.to_json
	end

	def update
	    detachment = Detachment.find params[:id]
	    detachment.update detachment_params
	    render json: detachment.to_json
	end

	def show
		detachment = Detachment.find params[:id]
		render json: detachment.to_json
	end

	private
	def detachment_params
		params.require(:detachment).permit(:id, :name, :army_id, :detachment_def_id)
	end
end
