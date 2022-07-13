/* globals document */
import React from 'react'
const _ = require('lodash');
const axios = require('axios');

const bindReactClass = require('lib/bind-react-class');
const Selectimus = require('components/Selectimus');
const {default: VariationModal} = require('components/VariationModal');

class Detachment extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			detachmentDefById: {},
			detachment: {},
			filterKeywords: [],
			selectedUnit: undefined,
			units: undefined,
			keywords: undefined,
			unitsByRole: undefined,
			unitsById: undefined,
		}
	}

	async componentDidMount() {
		const response = await axios.get(`/api/detachment_defs.json`)
		const detachmentDefs = response.data
		const detachmentDefById = _.keyBy(detachmentDefs, 'id')
		this.setState({detachmentDefById})

		const response2 = await axios.get(`/api/detachments/${this.props.match.params.id}.json`)
		const detachment = response2.data
		this.setState({detachment})

		const response3 = await axios.get(`/api/units.json`)
		const units = response3.data
		const keywords = _(units)
			.filter('keywords')
			.map('keyword_array')
			.flatten()
			.uniq()
			.map((keyword) => ({key: keyword, value: keyword}))
			.value()

		const unitsByRole = _.groupBy(units, 'battlefield_role')
		const unitsById = _.keyBy(units, 'id')

		const response4 = await axios.get(`/api/units/all-models.json`)
		const models = response4.data;
		const modelsById = _.keyBy(models, 'id')

		this.setState({units, keywords, unitsByRole, unitsById, modelsById})
	}

	handleKeywordChange(selectedKeywords) {
		const {units} = this.state
		const filterKeywords = _.map(selectedKeywords, 'value')
		const filterFunc = (unit) => {
			if (filterKeywords.length === 0) {return true}
			return _.intersection(unit.keyword_array, filterKeywords).length > 0
		}
		const unitsByRole = _(units)
			.filter(filterFunc)
			.groupBy('battlefield_role')
			.value()

		this.setState({unitsByRole})
	}

	handleUnitClick(unit) {
		return async (event) => {
			const {detachment} = this.state;
			detachment.detachment_units = detachment.detachment_units || [];

			const detachment_unit = _.find(detachment.detachment_units, {unit_id: unit.id})
			if (detachment_unit) {
				_.remove(detachment.detachment_units, {unit_id: unit.id})
			} else {
				detachment.detachment_units.push({unit_id: unit.id, detachment_id: detachment.id})
			}

			if (!detachment_unit && _.get(unit, 'variations.length')) {
				this.setState({selectedUnit: unit})
			}
			detachment.points = this.totalPoints()

			const token = document.querySelector('meta[name="csrf-token"]').content
			const headers = {headers: {'X-CSRF-Token': token}}
			const response = await axios.put(`/api/detachments/${this.props.match.params.id}.json`, detachment, headers)
			this.setState({detachment: response.data})
		}
	}

	handleDismissVariationModal() {
		this.setState({selectedUnit: null})
	}

	async handleSetVariation({detachmentUnitId, slots, variationId}) {
		const {detachment} = this.state;
		const detachmentUnit = _.find(detachment.detachment_units, {id: detachmentUnitId})
		detachmentUnit.detachment_unit_slots = slots
		detachmentUnit.variation_id = variationId
		detachment.points = this.totalPoints()
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		await axios.put(`/api/detachments/${this.props.match.params.id}.json`, detachment, headers)
	}

	handleEditVariations(unit) {
		return (event) => {
			event.preventDefault();

			if (_.get(unit, 'variations.length')) {
				this.setState({selectedUnit: unit})
			}
		}
	}

	totalPoints() {
		const {detachment, modelsById, unitsById} = this.state

		const unitTotal = _(detachment.detachment_units)
			.map('unit_id')
			.map((id) => _.get(unitsById, [id, 'points']))
			.sum()
		const variationTotal = _(detachment.detachment_units)
			.filter('detachment_unit_slots.length')
			.map('detachment_unit_slots')
			.flatten()
			.map('models')
			.flatten()
			.map(({model_id}) => _.get(modelsById, [model_id, 'points']))
			.sum()

		return unitTotal + variationTotal
	}

	render () {
		const {
			detachment, detachmentDefById, keywords, selectedUnit, unitsByRole,
		} = this.state

		const detachmentDef = (detachment.detachment_def_id)
			? detachmentDefById[detachment.detachment_def_id]
			: undefined
		const selectedUnitIds = _.map(detachment.detachment_units, 'unit_id')

		const total = this.totalPoints()
		const detachmentUnit = (selectedUnit)
			? _.find(detachment.detachment_units, {unit_id: selectedUnit.id})
			: null

		return (detachmentDef) ? (
			<div className='Detachment'>
				<header>
					<span className='left'><a className='btn btn-cancel left' href={`/armies/${detachment.army_id}`}>Back</a></span>
					<span className='middle'>{detachment.name}</span>
					<span className='right'>Total: {total}</span>
				</header>

				<div className='detachment main-body'>
					<div className='title'>
						<span className='detachment-name'>{detachmentDef.name.toUpperCase()}</span>
						<span className='spacer'>.....</span>
						<span>COMMAND COST: {detachmentDef.command_cost}CP</span>
					</div>

					<div className='body'>
						<div className='desc'>
							<div className='desc-row'>
								<label>Restrictions:</label>{detachmentDef.restrictions}
							</div>
							<div className='desc-row'>
								<label>Command Benefits:</label>{detachmentDef.command_benefits}
							</div>
							<div className='desc-row'>
								<label>Dedicated Transports:</label>{detachmentDef.dedicated_transports}
							</div>

							<div className='desc-row'>
								<Selectimus
									onChange={this.handleKeywordChange}
									multiple={true}
									labelKey='key'
									valueKey='value'
									options={keywords} />
							</div>
						</div>

						<div className='units'>
							{(detachmentDef.hq_max > 0) && (
								<div className='role hq'>
									<div className='unit-type'>HQ</div>
									<div className='unit-min-max'>{detachmentDef.hq_min}-{detachmentDef.hq_max}</div>
									<div className='unit-symbol'>☠︎</div>

									{_.get(unitsByRole, 'HQ', []).map((unit) => (
										<div key={`unit-${unit.id}`}
											className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
											onClick={this.handleUnitClick(unit)}>
											<div>{unit.name}</div>
											<div><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
											<div>{unit.points} V</div>
										</div>
									))}
								</div>
							)}
							{(detachmentDef.troop_max > 0) && (
								<div className='role troops'>
									<div className='unit-type'>TROOPS</div>
									<div className='unit-min-max'>{detachmentDef.troop_min}-{detachmentDef.troop_max}</div>
									<div className='unit-symbol troops-icon'>◁</div>

									{_.get(unitsByRole, 'Troops', []).map((unit) => (
										<React.Fragment key={`unit-${unit.id}`}>
											<div
												className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
												onClick={this.handleUnitClick(unit)}>
												{unit.name}
												<div><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
												<div>{unit.points} V</div>
											</div>
											{_.includes(selectedUnitIds, unit.id) && (
												<div>
													<a className='edit-variation' title='Edit Variation'
														onClick={this.handleEditVariations(unit)}>
														Edit
													</a>
												</div>
											)}
										</React.Fragment>
									))}
								</div>
							)}
							{(detachmentDef.elite_max > 0) && (
								<div className='role elites'>
									<div className='unit-type'>ELITES</div>
									<div className='unit-min-max'>{detachmentDef.elite_min}-{detachmentDef.elite_max}</div>
									<div className='unit-symbol'>✠</div>

									{_.get(unitsByRole, 'Elites', []).map((unit) => (
										<div key={`unit-${unit.id}`}
											className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
											onClick={this.handleUnitClick(unit)}>
											{unit.name}
											<div><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
											<div>{unit.points} V</div>
										</div>
									))}
								</div>
							)}
							{(detachmentDef.fast_attack_max > 0) && (
								<div className='role fast-attacks'>
									<div className='unit-type'>FAST ATTACK</div>
									<div className='unit-min-max'>{detachmentDef.fast_attack_min}-{detachmentDef.fast_attack_max}</div>
									<div className='unit-symbol'>⚡︎</div>

									{_.get(unitsByRole, 'Fast Attack', []).map((unit) => (
										<div key={`unit-${unit.id}`}
											className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
											onClick={this.handleUnitClick(unit)}>
											{unit.name}
											<div><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
											<div>{unit.points} V</div>
										</div>
									))}
								</div>
							)}
							{(detachmentDef.heavy_support_max > 0) && (
								<div className='role heavy-supports'>
									<div className='unit-type'>HEAVY SUPPORT</div>
									<div className='unit-min-max'>{detachmentDef.heavy_support_min}-{detachmentDef.heavy_support_max}</div>
									<div className='unit-symbol'>❋</div>

									{_.get(unitsByRole, 'Heavy Support', []).map((unit) => (
										<div key={`unit-${unit.id}`}
											className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
											onClick={this.handleUnitClick(unit)}>
											{unit.name}
											<div><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
											<div>{unit.points} V</div>
										</div>
									))}
								</div>
							)}
							{(detachmentDef.flyer_max > 0) && (
								<div className='role flyers'>
									<div className='unit-type'>FLYERS</div>
									<div className='unit-min-max'>{detachmentDef.flyer_min}-{detachmentDef.flyer_max}</div>
									<div className='unit-symbol'>🦋</div>

									{_.get(unitsByRole, 'Flyers', []).map((unit) => (
										<div key={`unit-${unit.id}`}
											className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
											onClick={this.handleUnitClick(unit)}>
											{unit.name}
											<div><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
											<div>{unit.points} V</div>
										</div>
									))}
								</div>
							)}
							{(detachmentDef.fortification_max > 0) && (
								<div className='role fortifications'>
									<div className='unit-type'>FORTIFICATIONS</div>
									<div className='unit-min-max'>{detachmentDef.fortification_min}-{detachmentDef.fortification_max}</div>
									<div className='unit-symbol'>🏰</div>

									{_.get(unitsByRole, 'Fortification', []).map((unit) => (
										<div key={`unit-${unit.id}`}
											className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
											onClick={this.handleUnitClick(unit)}>
											{unit.name}
											<div><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
											<div>{unit.points} V</div>
										</div>
									))}
								</div>
							)}
							{(detachmentDef.lord_of_war_max > 0) && (
								<div className='role lord-of-war'>
									<div className='unit-type'>LORD OF WAR</div>
									<div className='unit-min-max'>{detachmentDef.lord_of_war_min}-{detachmentDef.lord_of_war_max}</div>
									<div className='unit-symbol'>🏰</div>

									{_.get(unitsByRole, 'Lord of War', []).map((unit) => (
										<div key={`unit-${unit.id}`}
											className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
											onClick={this.handleUnitClick(unit)}>
											{unit.name}
											<div><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
											<div>{unit.points} V</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>

				<VariationModal
					show={Boolean(selectedUnit)}
					onDismiss={this.handleDismissVariationModal}
					onSubmit={this.handleSetVariation}
					detachmentUnit={detachmentUnit}
					unit={selectedUnit} />
			</div>
		) : null;
	}
}

export default bindReactClass(Detachment)
