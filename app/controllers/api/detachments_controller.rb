class Api::DetachmentsController < ApplicationController
	def create
		detachment = Detachment.create detachment_params
		render json: detachment.to_json
	end

	private
	def detachment_params
		params.require(:detachment).permit(:name, :army_id, :detachment_def_id)
	end
end
