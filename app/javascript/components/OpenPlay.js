/* globals document */
import React from 'react'
const {useEffect, useState} = React;
import {useParams} from 'react-router-dom';

const _ = require('lodash');
const axios = require('axios');

const Modal = require('components/Modal');
const Selectimus = require('components/Selectimus');

const OpenPlay = () => {
	const {id} = useParams();
	const [unitsCheckedA, setUnitsCheckedA] = useState({})
	const [unitsCheckedB, setUnitsCheckedB] = useState({})
	const [unitsById, setUnitsById] = useState({})
	const [game, setGame] = useState({})
	const [modelsByType, setModelsByType] = useState({})
	const [modelsById, setModelsById] = useState({})
	const [showVariationModal, setShowVariationModal] = useState(false)
	const [selectedUnitId, setSelectedUnitId] = useState(false)
	const [showRibbon, setShowRibbon] = useState(false)
	const [ribbonText, setRibbonText] = useState(false)
	const [selectedPlayVariation, setSelectedPlayVariation] = useState('A')

	useEffect(async () => {
		const response = await axios.get('/api/units.json')
		const units = response.data;
		const unitsById = _.keyBy(units, 'id')
		setUnitsById(unitsById);

		const response2 = await axios.get(`/api/open_plays/${id}.json`)
		const game = response2.data;
		setUnitsCheckedA(JSON.parse(game.teamA) || {})
		setUnitsCheckedB(JSON.parse(game.teamB) || {})
		setGame(game)
	}, [])

	function handleToggleA(unit) {
		return () => {
			const modifiedUnitsCheckedA = Object.assign(
				{},
				unitsCheckedA,
				{
					[unit.id]: Object.assign({}, unitsCheckedA[unit.id], {
						included: !_.get(unitsCheckedA, [unit.id, 'included']),
					}),
				}
			)
			setUnitsCheckedA(modifiedUnitsCheckedA)

			if (unit.variations.length && !_.get(unitsCheckedA, [unit.id, 'included'])) {
				setSelectedPlayVariation('A')
				handleShowVariationModal(unit)();
			}
		}
	}

	function handleToggleB(unit) {
		return () => {
			const newUnitsCheckedB = Object.assign(
				{},
				unitsCheckedB,
				{
					[unit.id]: Object.assign({}, unitsCheckedB[unit.id], {
						included: !_.get(unitsCheckedB, [unit.id, 'included']),
					}),
				}
			)
			setUnitsCheckedB(newUnitsCheckedB)

			if (unit.variations.length && !_.get(unitsCheckedB, [unit.id, 'included'])) {
				setSelectedPlayVariation('B')
				handleShowVariationModal(unit)();
			}
		}
	}

	function handleShowVariationModal(unit) {
		return async () => {
			setShowVariationModal(true)
			setSelectedUnitId(unit.id)
			const response = await axios.get(`/api/units/${unit.id}/variation-models.json`)
			const models = response.data;
			const modelsByType = _.groupBy(models, 'type')
			const modelsById = _.keyBy(models, 'id')
			setModelsByType(modelsByType)
			setModelsById(modelsById)
		}
	}

	function handleHideVariationModal() {
		setShowVariationModal(false)
	}

	function handleToggleVariationA(variation) {
		return () => {
			const newUnitsCheckedA = Object.assign(
				{},
				unitsCheckedA,
				{
					[variation.unit_id]: Object.assign({}, unitsCheckedA[variation.unit_id], {
						variationChosen: variation.id,
						slots: [], // wipe slots in case they chose some from a different variation
					}),
				}
			)
			setUnitsCheckedA(newUnitsCheckedA)
		}
	}

	function handleToggleVariationB(variation) {
		return () => {
			const newUnitsCheckedB = Object.assign(
				{},
				unitsCheckedB,
				{
					[variation.unit_id]: Object.assign({}, unitsCheckedB[variation.unit_id], {
						variationChosen: variation.id,
						slots: [], // wipe slots in case they chose some from a different variation
					}),
				}
			)
			setUnitsCheckedB(newUnitsCheckedB)
		}
	}

	function getSlotOptions(variation, slot) {
		const chosenModels = _(unitsCheckedA[variation.unit_id].slots)
			.values()
			.map((slot) => _.values(slot))
			.flatten()
			.compact()
			.value()
		const allModels = _.get(modelsByType, [slot.model_type], [])
		const availableModels = allModels.filter((model) => !_.includes(chosenModels, model.id))
		return [{id: undefined, name: '- None -'}, ...availableModels]
	}

	function handleSlotChangeA(variation, slot, index) {
		return (model) => {
			const newUnitsCheckedA = Object.assign(
				{},
				unitsCheckedA,
				{
					[variation.unit_id]: Object.assign({}, unitsCheckedA[variation.unit_id], {
						variationChosen: variation.id,
						slots: Object.assign({}, unitsCheckedA[variation.unit_id].slots, {
							[slot.id]: Object.assign({}, unitsCheckedA[variation.unit_id].slots[slot.id], {[index]: model.id}),
						}),
					}),
				}
			)

			setUnitsCheckedA(newUnitsCheckedA)
		}
	}

	function handleSlotChangeB(variation, slot, index) {
		return (model) => {
			const slotsB = unitsCheckedB[variation.unit_id].slots

			const newUnitsCheckedB = Object.assign(
				{},
				unitsCheckedB,
				{
					[variation.unit_id]: Object.assign({}, unitsCheckedB[variation.unit_id], {
						variationChosen: variation.id,
						slots: Object.assign(
							{}, // create new Object
							slotsB, // put all the old back
							{ // but make the new modification
								[slot.id]: Object.assign({}, slotsB[slot.id], {[index]: model.id}),
							}
						),
					}),
				}
			)

			setUnitsCheckedB(newUnitsCheckedB)
		}
	}

	function getModelChoice(variation, slot, index) {
		const modelId = _.get(unitsCheckedA, [variation.unit_id, 'slots', slot.id, index]);
		const modelType = slot.model_type
		const model = _.find(modelsByType[modelType], {id: modelId});
		return model
	}

	function getSlotPointsA(variation, slot, index) {
		const modelId = _.get(unitsCheckedA, [variation.unit_id, 'slots', slot.id, index]);
		const modelType = slot.model_type
		const model = _.find(modelsByType[modelType], {id: modelId});
		return (model)
			? model.points
			: null;
	}

	function getSlotPointsB(variation, slot, index) {
		const modelId = _.get(unitsCheckedB, [variation.unit_id, 'slots', slot.id, index]);
		const modelType = slot.model_type
		const model = _.find(modelsByType[modelType], {id: modelId});
		return (model)
			? model.points
			: null;
	}

	function handleRemoveModelA(variation, slot, index) {
		return (model) => {
			const newUnitsCheckedA = Object.assign(
				{},
				unitsCheckedA,
				{
					[variation.unit_id]: Object.assign({}, unitsCheckedA[variation.unit_id], {
						variationChosen: variation.id,
						slots: Object.assign({}, unitsCheckedA[variation.unit_id].slots, {
							[slot.id]: Object.assign({}, unitsCheckedA[variation.unit_id].slots[slot.id], {[index]: undefined}),
						}),
					}),
				}
			)
			setUnitsCheckedA(newUnitsCheckedA)
		}
	}

	function handleRemoveModelB(variation, slot, index) {
		return (model) => {
			const newUnitsCheckedB = Object.assign(
				{},
				unitsCheckedB,
				{
					[variation.unit_id]: Object.assign({}, unitsCheckedB[variation.unit_id], {
						variationChosen: variation.id,
						slots: Object.assign({}, unitsCheckedB[variation.unit_id].slots, {
							[slot.id]: Object.assign({}, unitsCheckedB[variation.unit_id].slots[slot.id], {[index]: undefined}),
						}),
					}),
				}
			)
			setUnitsCheckedB(newUnitsCheckedB)
		}
	}

	async function handleSaveGame() {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		const saveGame = Object.assign(game, {teamA: JSON.stringify(unitsCheckedA), teamB: JSON.stringify(unitsCheckedB)})
		await axios.put(`/api/open_plays/${game.id}.json`, saveGame, headers)
		displayRibbon('Gamed successfully saved')
	}

	function displayRibbon(text) {
		setShowRibbon(true)
		setRibbonText(text)

		setTimeout(() => {setShowRibbon(false)}, 5000)
	}

	const unit = _.get(unitsById, [selectedUnitId])
	const unitPointsA = _(unitsCheckedA)
		.toPairs()
		.filter((pair) => pair[1].included)
		.map((pair) => unitsById[pair[0]].points)
		.sum()
	const unitPointsB = _(unitsCheckedB)
		.toPairs()
		.filter((pair) => pair[1].included)
		.map((pair) => unitsById[pair[0]].points)
		.sum()
	const variationPointsA = _(unitsCheckedA)
		.toPairs()
		.filter((pair) => pair[1].included)
		.map((pair) => _.values(pair[1].slots))
		.compact()
		.flatten()
		.map((slotEntry) => _.values(slotEntry))
		.flatten()
		.map((modelId) => _.get(modelsById, [modelId, 'points'], 0))
		.sum()
	const variationPointsB = _(unitsCheckedB)
		.toPairs()
		.filter((pair) => pair[1].included)
		.map((pair) => _.values(pair[1].slots))
		.compact()
		.flatten()
		.map((slotEntry) => _.values(slotEntry))
		.flatten()
		.map((modelId) => _.get(modelsById, [modelId, 'points'], 0))
		.sum()
	const totalA = unitPointsA + variationPointsA
	const totalB = unitPointsB + variationPointsB
	const unitsChecked = (selectedPlayVariation === 'A')
		? unitsCheckedA
		: unitsCheckedB
	const handleToggleVariation = (selectedPlayVariation === 'A')
		? handleToggleVariationA
		: handleToggleVariationB
	const handleSlotChange = (selectedPlayVariation === 'A')
		? handleSlotChangeA
		: handleSlotChangeB
	const getSlotPoints = (selectedPlayVariation === 'A')
		? getSlotPointsA
		: getSlotPointsB
	const handleRemoveModel = (selectedPlayVariation === 'A')
		? handleRemoveModelA
		: handleRemoveModelB

	return (
		<div className='OpenPlay'>
			<header>
				<span className='left'>
					<a className='btn btn-cancel left' href='/teams'>Dashboard</a>
				</span>
				<span className='team'>Team A: {totalA}</span>
				<span className='team'>Team B: {totalB}</span>
				<button className='btn' onClick={handleSaveGame}>Save</button>
			</header>

			{showRibbon && (
				<div className='ribbon'>{ribbonText}</div>
			)}

			<hr />
			{unitsById && _.values(unitsById).map((unit) => (
				<div key={`unit-${unit.id}`} className='row' style={{color: unit.color}}>
					<span className='unit' key={`unitA-${unit.id}`}>
						<a
							onClick={handleToggleA(unit)}
							className='clickable-area'>
							{unit.picture && (
								<img src={`/assets/${unit.picture}`} className='unit-image' />
							)}
							<div className='unit-label'>
								<div>{unit.name.toUpperCase()}</div>
							</div>
							<span className='power'>{unit.points}</span>
						</a>
						<input
							type='checkbox'
							value={unit.id}
							className='included'
							onChange={handleToggleA(unit)}
							checked={_.get(unitsCheckedA, [unit.id, 'included']) || false} />
					</span>

					<span className='unit' key={`unitB-${unit.id}`}>
						<input
							type='checkbox'
							value={unit.id}
							className='included'
							onChange={handleToggleB(unit)}
							checked={_.get(unitsCheckedB, [unit.id, 'included']) || false} />
						<a
							onClick={handleToggleB(unit)}
							className='clickable-area'>

							<span className='power'>{unit.points}</span>
							<div className='unit-label'>{unit.name.toUpperCase()}</div>
							{unit.picture && (
								<img src={`/assets/${unit.picture}`} className='unit-image' />
							)}
						</a>
					</span>
				</div>
			))}

			<Modal
				headerText='Choose your Variations'
				show={showVariationModal}
				onDismiss={handleHideVariationModal}>

				{(_.get(unit, 'variations', [])).map((variation) => (
					<React.Fragment key={`variation-${variation.id}`}>
						<div>
							<input
								type='radio'
								name={`variation-radio-${unit.id}`}
								id={`variation-radio-${variation.id}`}
								checked={unitsChecked[variation.unit_id].variationChosen === variation.id}
								onChange={handleToggleVariation(variation)} />
							<label htmlFor={`variation-radio-${variation.id}`}> {variation.name}</label>
						</div>
						{(unitsChecked[variation.unit_id].variationChosen === variation.id) &&
							_.get(variation, 'slots', []).map((slot) => (
								<div key={`slot-${slot.id}`} className='slot'>
									{slot.model_type}
									{_.range(slot.number_of_models).map((index) => (
										<div key={`slot-${slot.id}-${index}`}>
											<Selectimus
												options={getSlotOptions(variation, slot)}
												onChange={handleSlotChange(variation, slot, index)}
												valueKey='id'
												labelKey='name'
												value={getModelChoice(variation, slot, index)} />
											<span className='slot-points'>{getSlotPoints(variation, slot, index)}</span>
											{getSlotPoints(variation, slot, index) && (
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
			</Modal>

		</div>
	)
}

export default OpenPlay
