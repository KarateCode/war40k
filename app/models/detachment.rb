class Detachment < ApplicationRecord
    belongs_to :army
    has_many :detachment_units, dependent: :destroy

    def as_json(options = {})
        if self.detachment_units
            self.attributes.merge({detachment_units: self.detachment_units})
        end
    end
end
