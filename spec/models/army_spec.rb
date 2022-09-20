require "rails_helper"

describe Army do
	describe "#DependentDestroy:" do
		it "should cascade delete" do
			@army = Army.create name: 'Cascade me!'
			@detachment = Detachment.create name: 'detachment one', army_id: @army.id
			@detachment_unit = DetachmentUnit.create detachment_id: @detachment.id
			DetachmentUnitSlot.create detachment_unit_id: @detachment_unit.id
			expect(Army.count).to eq(1)
			expect(Detachment.count).to eq(1)
			expect(DetachmentUnit.count).to eq(1)
			expect(DetachmentUnitSlot.count).to eq(1)

			@army.destroy

			expect(Army.count).to eq(0)
			expect(Detachment.count).to eq(0)
			expect(DetachmentUnit.count).to eq(0)
			expect(DetachmentUnitSlot.count).to eq(0)
		end

		it "don't delete other stuff" do
			@army = Army.create name: 'Cascade me!'
			@detachment = Detachment.create name: 'detachment one', army_id: @army.id
			@detachment_unit = DetachmentUnit.create detachment_id: @detachment.id
			DetachmentUnitSlot.create detachment_unit_id: @detachment_unit.id
			@army2 = Army.create name: 'Next!'
			det = Detachment.create! name: 'detachment two', army_id: @army2.id
			DetachmentUnit.create detachment_id: -1
			DetachmentUnitSlot.create detachment_unit_id: -1

			expect(Army.count).to eq(2)
			expect(Detachment.count).to eq(2)
			expect(DetachmentUnit.count).to eq(2)
			expect(DetachmentUnitSlot.count).to eq(2)

			@army.destroy

			expect(Army.count).to eq(1)
			expect(Detachment.count).to eq(1)
			expect(DetachmentUnit.count).to eq(1)
			expect(DetachmentUnitSlot.count).to eq(1)
		end
	end
end
