class Api::ArmiesController < ApplicationController
    def index
        armies = Army.all
        render json: armies.to_json
    end

    def show
        army = Army.find params[:id]
        puts 'army:'
        puts army.inspect
        render json: army.to_json
    end

    def detachments
        detachments = Detachment.where army_id: params[:id]
        render json: detachments.to_json
    end
end
