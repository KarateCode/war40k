import React from 'react'

const _ = require('lodash');
const axios = require('axios');

const Modal = require('components/Modal');
const Selectimus = require('components/Selectimus');

class TeamBuilder extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			unitsCheckedA: {},
			unitsCheckedB: {},
			variationsA: {},
		}

		this.handleHideVariationModal = this.handleHideVariationModal.bind(this);
	}

	async componentDidMount() {
		const response = await axios.get('/api/units.json')
		const units = response.data;
		const unitsById = _.keyBy(units, 'id')
		this.setState({unitsById});
	}

	handleOnClickA(event) {
		const {checked, value} = event.target
		const unitsCheckedA = Object.assign({}, this.state.unitsCheckedA, {[value]: {included: checked}})
		this.setState({unitsCheckedA})
	}

	handleToggleA(unit) {
		return () => {
			const unitsCheckedA = Object.assign(
				{},
				this.state.unitsCheckedA,
				{
					[unit.id]: Object.assign({}, this.state.unitsCheckedA[unit.id], {
						included: !_.get(this, ['state', 'unitsCheckedA', unit.id, 'included']),
					}),
				}
			)
			this.setState({unitsCheckedA})

			if (unit.variations.length && !_.get(this, ['state', 'unitsCheckedA', unit.id, 'included'])) {
				this.handleShowVariationModal(unit)();
			}
		}
	}

	handleOnClickB(event) {
		const {checked, value} = event.target
		const unitsCheckedB = Object.assign({}, this.state.unitsCheckedB, {[value]: checked})
		this.setState({unitsCheckedB})
	}

	handleToggleB(unit) {
		return () => {
			const unitsCheckedB = Object.assign(
				{},
				this.state.unitsCheckedB,
				{[unit.id]: !this.state.unitsCheckedB[unit.id]}
			)
			this.setState({unitsCheckedB})
		}
	}

	handleToggleVariationA(variation) {
		return () => {
			const unitsCheckedA = Object.assign(
				{},
				this.state.unitsCheckedA,
				{
					[variation.unit_id]: Object.assign({}, this.state.unitsCheckedA[variation.unit_id], {
						variationChosen: variation.id,
						slots: [], // wipe slots in case they chose some from a different variation
					}),
				}
			)
			this.setState({unitsCheckedA})
		}
	}

	calcPowerA(unit) {
		if (unit.variations.length) {
			const variation = _.find(unit.variations, {id: this.state.variationsA[unit.id]});
			return unit.power + _.get(variation, 'extra_power', 0);
		} else {
			return unit.power
		}
	}

	handleShowVariationModal(unit) {
		return async () => {
			this.setState({showVariationModal: true, selectedUnitId: unit.id})
			// const response = await axios.get(`/api/units/${unit.id}/variations.json`)
			// const variations = response.data;
			const response = await axios.get(`/api/units/${unit.id}/variation-models.json`)
			const models = response.data;
			const modelsByType = _.groupBy(models, 'type')
			const modelsById = _.keyBy(models, 'id')
			this.setState({modelsByType, modelsById})
		}
	}

	handleHideVariationModal() {
		this.setState({showVariationModal: false})
	}

	handleSlotChange(variation, slot, index) {
		return (model) => {
			const unitsCheckedA = Object.assign(
				{},
				this.state.unitsCheckedA,
				{
					[variation.unit_id]: Object.assign({}, this.state.unitsCheckedA[variation.unit_id], {
						variationChosen: variation.id,
						slots: Object.assign({}, this.state.unitsCheckedA[variation.unit_id].slots, {
							[slot.id]: Object.assign({}, this.state.unitsCheckedA[variation.unit_id].slots[slot.id], {[index]: model.id}),
						}),
					}),
				}
			)
			this.setState({unitsCheckedA})
		}
	}

	getSlotOptions(variation, slot) {
		const chosenModels = _(this.state.unitsCheckedA[variation.unit_id].slots)
			.values()
			.map((slot) => _.values(slot))
			.flatten()
			.compact()
			.value()
		const {modelsByType} = this.state
		const allModels = _.get(modelsByType, [slot.model_type], [])
		const availableModels = allModels.filter((model) => !_.includes(chosenModels, model.id))
		return [{id: undefined, name: '- None -'}, ...availableModels]
	}

	getSlotPoints(variation, slot, index) {
		// console.log(this.state.unitsCheckedA[variation.unit_id].slots[index])
		const {modelsByType, unitsCheckedA} = this.state
		const modelId = _.get(unitsCheckedA, [variation.unit_id, 'slots', slot.id, index]);
		const modelType = slot.model_type
		const model = _.find(modelsByType[modelType], {id: modelId});
		return (model)
			? model.points
			: null;
	}

	getModelChoice(variation, slot, index) {
		const {modelsByType, unitsCheckedA} = this.state
		const modelId = _.get(unitsCheckedA, [variation.unit_id, 'slots', slot.id, index]);
		const modelType = slot.model_type
		const model = _.find(modelsByType[modelType], {id: modelId});
		return model
	}

	handleRemoveModel(variation, slot, index) {
		return (model) => {
			const unitsCheckedA = Object.assign(
				{},
				this.state.unitsCheckedA,
				{
					[variation.unit_id]: Object.assign({}, this.state.unitsCheckedA[variation.unit_id], {
						variationChosen: variation.id,
						slots: Object.assign({}, this.state.unitsCheckedA[variation.unit_id].slots, {
							[slot.id]: Object.assign({}, this.state.unitsCheckedA[variation.unit_id].slots[slot.id], {[index]: undefined}),
						}),
					}),
				}
			)
			this.setState({unitsCheckedA})
		}
	}

	render () {
		const {
			// modelsByType,
			modelsById,
			selectedUnitId,
			showVariationModal,
			unitsCheckedA,
			unitsCheckedB,
			unitsById,
			// variationsA,
		} = this.state

		const unit = _.get(unitsById, [selectedUnitId])
		const unitPointsA = _(unitsCheckedA)
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
		const totalA = unitPointsA + variationPointsA;
		const totalB = _(unitsCheckedB)
			.toPairs()
			.filter((pair) => pair[1])
			.map((pair) => unitsById[pair[0]].points)
			.sum()

		return (
			<div>
				<header>
					<span className='team'>Team A: {totalA}</span>
					<span className='team'>Team B: {totalB}</span>
				</header>
				<hr />
				{unitsById && _.values(unitsById).map((unit) => (
					<div key={`unit-${unit.id}`} className='row' style={{color: unit.color}}>
						<span className='unit' key={`unitA-${unit.id}`}>
							<a
								onClick={this.handleToggleA.bind(this)(unit)}
								className='clickable-area'>
								{unit.picture && (
									<img src={`assets/${unit.picture}`} className='unit-image' />
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
								onChange={this.handleToggleA(unit)}
								checked={_.get(unitsCheckedA, [unit.id, 'included']) || false} />
						</span>

						<span className='unit' key={`unitB-${unit.id}`}>
							<input
								type='checkbox'
								value={unit.id}
								className='included'
								onChange={this.handleToggleB(unit)}
								checked={unitsCheckedB[unit.id] || false} />
							<a
								onClick={this.handleToggleB.bind(this)(unit)}
								className='clickable-area'>

								<span className='power'>{unit.points}</span>
								<div className='unit-label'>{unit.name.toUpperCase()}</div>
								{unit.picture && (
									<img src={`assets/${unit.picture}`} className='unit-image' />
								)}
							</a>
						</span>
					</div>
				))}

				<Modal
					headerText='Choose your Variations'
					show={showVariationModal}
					onDismiss={this.handleHideVariationModal}>

					{(_.get(unit, 'variations', [])).map((variation) => (
						<React.Fragment key={`variation-${variation.id}`}>
							<div>
								<input
									type='radio'
									name={`variation-radio-${unit.id}`}
									id={`variation-radio-${variation.id}`}
									checked={unitsCheckedA[variation.unit_id].variationChosen === variation.id}
									onChange={this.handleToggleVariationA(variation)} />
								<label htmlFor={`variation-radio-${variation.id}`}> {variation.name}</label>
							</div>
							{(unitsCheckedA[variation.unit_id].variationChosen === variation.id) &&
								_.get(variation, 'slots', []).map((slot) => (
									<div key={`slot-${slot.id}`} className='slot'>
										{slot.model_type}
										{_.range(slot.number_of_models).map((index) => (
											<div key={`slot-${slot.id}-${index}`}>
												<Selectimus
													options={this.getSlotOptions(variation, slot)}
													onChange={this.handleSlotChange(variation, slot, index)}
													valueKey='id'
													labelKey='name'
													value={this.getModelChoice(variation, slot, index)} />
												<span className='slot-points'>{this.getSlotPoints(variation, slot, index)}</span>
												{this.getSlotPoints(variation, slot, index) && (
													<a
														onClick={this.handleRemoveModel(variation, slot, index)}
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
		);
	}
}

export default TeamBuilder
