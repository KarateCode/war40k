class Army < ApplicationRecord
    has_many :detachments, dependent: :destroy

    def as_json(options)
		# self.keyword_array = (self.keywords || []).split(',').each(&:strip!)
		self.attributes.merge({detachments: self.detachments})
	end
end
