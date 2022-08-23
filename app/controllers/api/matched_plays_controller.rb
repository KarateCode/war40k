class Api::MatchedPlaysController < ApplicationController
	def index
		matchedPlays = MatchedPlay.all
		render json: matchedPlays.to_json
	end

	def create
		matchedPlay = MatchedPlay.create matched_play_params
		render json: matchedPlay.to_json
	end

	def update
		matchedPlay = MatchedPlay.find params[:id]
		matchedPlay.update matched_play_params
		render json: matchedPlay.to_json
	end

	def show
		matchedPlay = MatchedPlay.find params[:id]
		render json: matchedPlay.to_json
	end

	def destroy
		matchedPlay = MatchedPlay.find params[:id]
		matchedPlay.destroy
	end

	def warlord_traits
		if params[:faction] == 'space_marine'
			traits = WarlordTrait.where(faction: 'space_marine')
				.or(WarlordTrait.where(faction: 'space_wolf'))
		else
			traits = WarlordTrait.where faction: params[:faction]
		end
		render json: traits.to_json
	end

	def relics
		if params[:faction] == 'space_marine'
			relics = Relic.where(faction: 'space_marine')
				.or(Relic.where(faction: 'space_wolf'))
		else
			relics = Relic.where faction: params[:faction]
		end
		render json: relics.to_json
	end

	private
	def matched_play_params
		params.require(:matched_play).permit(
			:id,
			:name,
			:notes,
			:faction_a,
			:faction_b,
			:detachment_id_a,
			:detachment_id_b,
			:warlord_trait_id_a1,
			:warlord_trait_id_a2,
			:warlord_trait_id_b1,
			:warlord_trait_id_b2,
			:relic_id_a1,
			:relic_id_a2,
			:relic_id_b1,
			:relic_id_b2,
			:detachment_ability_id_a,
			:detachment_ability_id_b,
			:secondary_objective_id_a,
			:secondary_objective_id_b
		)
	end
end
