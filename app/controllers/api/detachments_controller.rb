class Api::DetachmentsController < ApplicationController
	def create
		detachment = Detachment.create detachment_params
		render json: detachment.to_json
	end

	def update
		detachment = Detachment.find params[:id]
		detachment.update params[:detachment]

		params[:detachment_units].each do |detachment_unit_params|
			detachment_unit_slots = detachment_unit_params.delete(:detachment_unit_slots)
			(detachment_unit_slots || []).each do |slot_params|
				slot = DetachmentUnitSlot.find_by id: slot_params[:id]
				if slot
					slot.update slot_params
				else
					DetachmentUnitSlot.create slot_params
				end
			end

			d_unit = DetachmentUnit.find_by id: detachment_unit_params[:id]
			if d_unit
				d_unit.update detachment_unit_params
			else
				DetachmentUnit.create detachment_unit_params
			end
		end

		unit_ids = params[:detachment_units].map{|unit| unit[:unit_id]}
		DetachmentUnit.connection.execute "DELETE from detachment_units
		WHERE detachment_id = #{params[:id]}
		AND unit_id NOT IN (#{unit_ids.join(', ')});"

		render json: detachment.to_json
	end

	def show
		detachment = Detachment.find params[:id]
		render json: detachment.to_json
	end

	def	params
		request.parameters
	end
end
