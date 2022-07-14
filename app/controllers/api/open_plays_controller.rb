class Api::OpenPlaysController < ApplicationController
    def index
        openPlays = OpenPlay.all
        render json: openPlays.to_json
    end

    def create
        openPlay = OpenPlay.create open_play_params
        render json: openPlay.to_json
    end

    def update
        openPlay = OpenPlay.find params[:id]
        openPlay.update open_play_params
        render json: openPlay.to_json
    end

    def show
        openPlay = OpenPlay.find params[:id]
        render json: openPlay.to_json
    end

    def destroy
        openPlay = OpenPlay.find params[:id]
        openPlay.destroy
    end

    private
    def open_play_params
        params.require(:open_play).permit(:id, :name, :desc, :teamA, :teamB)
    end
end
