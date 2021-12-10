class DetachmentUnit < ApplicationRecord
    has_many :detachment_unit_slots
    accepts_nested_attributes_for :detachment_unit_slots

    def as_json(options = {})
        if self.detachment_unit_slots
            self.attributes.merge({detachment_unit_slots: self.detachment_unit_slots})
        end
    end
end
