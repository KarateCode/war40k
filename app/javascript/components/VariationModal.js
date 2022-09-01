import React from 'react'
const {useEffect, useState} = React;
const _ = require('lodash');
const axios = require('axios');

const Modal = require('components/Modal');
const Selectimus = require('components/Selectimus');

const VariationModal = ({detachmentUnit: passedDetachmentUnit, show, unit, onDismiss, onSubmit}) => {
	const [variationId, handleVariationIdChange] = useState(_.get(passedDetachmentUnit, 'variation_id') || {})
	const [modelsByType, setModelsByType] = useState(passedDetachmentUnit || {})
	const [modelsById, setModelsById] = useState()
	const [slots, setSlots] = useState(_.get(passedDetachmentUnit, 'detachment_unit_slots', []))

	useEffect(async () => {
		if (unit) {
			const response = await axios.get(`/api/units/${unit.id}/variation-models.json`)
			const models = response.data;
			const modelsByType = _.groupBy(models, 'type')
			const modelsById = _.keyBy(models, 'id')
			console.log('modelsById:');
			console.log(require('util').inspect(modelsById, false, null));
			setModelsById(modelsById)
			setModelsByType(modelsByType)
		}
	}, [unit])

	useEffect(async () => {
		if (passedDetachmentUnit) {
			handleVariationIdChange(passedDetachmentUnit.variation_id)
			setSlots(passedDetachmentUnit.detachment_unit_slots)
		}

	}, [passedDetachmentUnit])

	function getSlotOptions(variation, slotDef) {
		const slot = _.find(slots, {slot_def_id: slotDef.id})
		const chosenModels = _(_.get(slot, 'models'))
			.map('model_id')
			.value()

		const availableModels = _(_.get(modelsByType, [slotDef.model_type], []))
			.filter((model) => !_.includes(chosenModels, model.id))
			.uniqBy('name')
			.value()

		return [...availableModels]
	}

	function handleSlotChange(variationDef, slotDef, index) {
		return (model) => {
			const slot = _.find(slots, {slot_def_id: slotDef.id})
			if (slot) {
				const foundModel = _.find(slot.models, {index})
				if (foundModel) {
					foundModel.model_id = model.id
				} else {
					slot.models.push({index, model_id: model.id})
				}
				setSlots([...slots])
			} else {
				slots.push({
					slot_def_id: slotDef.id,
					detachment_unit_id: passedDetachmentUnit.id,
					model_type: 'TacticalDrone',
					models: [{index, model_id: model.id}],
				})
				setSlots([...slots])
			}
		}
	}

	function getModelChoice(variation, slotDef, index) {
		const allModels = _.get(modelsByType, [slotDef.model_type], [])

		const slot = _.find(slots, {slot_def_id: slotDef.id})
		const row = _.find(_.get(slot, 'models'), {index})
		// ^^ can I combine these into one lodash chain?
		// here's slot: slot
		// how do I get all choices per slot?

		const choice = _.find(allModels, {id: _.get(row, 'model_id')})
		return choice || null
	}

	function getSlotPoints(variation, slotDef, index) {
		const allModels = _.get(modelsByType, [slotDef.model_type], [])
		const slot = _.find(slots, {slot_def_id: slotDef.id})
		if (!slot) {return}
		const row = _.find(_.get(slot, 'models'), {index})
		if (!row) {return}

		const model = _.find(allModels, {id: _.get(row, 'model_id')})
		if (!modelsById) {return}
		const modelName = modelsById[row.model_id].name

		// For Tau, return if this is the first, second, or third instance of this being added to a model
		if (index === 0) {
			return _.get(model, 'points')
		} else {
			let modelTypeCount = 0
			for (const i of _.range(index, -1, -1)) {
				const modelId = slot.models[i].model_id
				if (modelName === modelsById[modelId].name) {
					modelTypeCount++
				}
			}
			if (modelTypeCount === 1) {
				return _.get(model, 'points')
			} else if (modelTypeCount === 2) {
				return _.get(model, 'second_points') || _.get(model, 'points')
			} else if (modelTypeCount > 2) {
				return _.get(model, 'third_points') || _.get(model, 'second_points') || _.get(model, 'points')
			}
		}
	}

	function handleRemoveModel(variation, slotDef, index) {
		return (model) => {
			const slot = _.find(slots, {slot_def_id: slotDef.id})
			slot.models = _.reject(slot.models, {index})
			setSlots([...slots])
		}
	}

	async function handleSubmit() {
		await onSubmit({detachmentUnitId: passedDetachmentUnit.id, slots, variationId})
		onDismiss()
	}

	return (
		<Modal
			headerText='Choose your Variations'
			show={show}
			onDismiss={onDismiss}>

			{(_.get(unit, 'variations', [])).map((variation) => (
				<React.Fragment key={`variation-${variation.id}`}>
					<div className='variation-name'>
						<input
							type='radio'
							name={`variation-radio-${unit.id}`}
							id={`variation-radio-${variation.id}`}
							checked={variationId === variation.id}
							onChange={() => handleVariationIdChange(variation.id)} />
						<label htmlFor={`variation-radio-${variation.id}`} className='variation-label'> {variation.name}</label>
					</div>

					{(variationId === variation.id) &&
						_.get(variation, 'slots', []).map((slot) => (
							<div key={`slot-${slot.id}`} className='slot'>
								<div className='model-type-name'>{slot.name || slot.model_type}</div>
								{_.range(slot.number_of_models).map((index) => (
									<div key={`slot-${slot.id}-${index}`}>
										<Selectimus
											options={getSlotOptions(variation, slot)}
											valueKey='id'
											onChange={handleSlotChange(variation, slot, index)}
											value={getModelChoice(variation, slot, index)}
											labelKey='name' />

										<span className='slot-points'>{getSlotPoints(variation, slot, index)}</span>
										{getModelChoice(variation, slot, index) && (
											<a
												onClick={handleRemoveModel(variation, slot, index)}
												className='remove-slot-model'>
												X
											</a>
										)}
									</div>
								))}
							</div>
						))
					}
				</React.Fragment>

			))}

			<div className='bottom-buttons'>
				<div className='bottom-buttons__left fix'>
					<a className='btn btn-cancel' onClick={onDismiss}>Cancel</a>
				</div>
				<div className='bottom-buttons__right'>
					{/*
						<input className='btn' type='submit' value={(_.get(unit, 'id')) ? 'Update Variation' : 'Create Variation'} />
					*/}
					<a className='btn' onClick={handleSubmit}>{(_.get(unit, 'id')) ? 'Update Variation' : 'Create Variation'}</a>
				</div>
			</div>
		</Modal>
	)
}

export default VariationModal
