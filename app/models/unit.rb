class Unit < ApplicationRecord
	# alias_attribute :unit_variations, :variations
	alias_attribute :variations, :unit_variations

	has_many :unit_variations

	def as_json(options)
		# super(include: 'variations')
		self.attributes.merge({variations: self.unit_variations})
	end
end
