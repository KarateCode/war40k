class UnitVariation < ApplicationRecord
    belongs_to :unit
    has_many :variation_slots

    def as_json(options = {})
        if self.variation_slots
            self.attributes.merge({slots: self.variation_slots})
        end
        # serializable_hash(options)
    end
end
