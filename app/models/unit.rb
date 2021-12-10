class Unit < ApplicationRecord
	# alias_attribute :unit_variations, :variations
	alias_attribute :variations, :unit_variations
	attr_accessor :keyword_array

	has_many :unit_variations

	def as_json(options)
		# super(include: 'variations')
		self.keyword_array = (self.keywords || []).split(',').each(&:strip)
		self.attributes.merge({variations: self.unit_variations, keyword_array: self.keyword_array})
	end
end
