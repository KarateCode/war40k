class Api::DetachmentDefsController < ApplicationController
    def index
        defs = DetachmentDef.all
        render json: defs.to_json
    end
end
