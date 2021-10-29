class Api::ArmiesController < ApplicationController
    def index
        armies = Army.all
        render json: armies.to_json
    end

    def create
        army = Army.create army_params
        render json: army.to_json
    end

    def update
        army = Army.find params[:id]
        army.update army_params
        render json: army.to_json
    end

    def show
        army = Army.find params[:id]
        render json: army.to_json
    end

    def detachments
        detachments = Detachment.where army_id: params[:id]
        render json: detachments.to_json
    end

    private
    def army_params
        params.require(:army).permit(:id, :name, :point_battle, :command_points)
    end
end
