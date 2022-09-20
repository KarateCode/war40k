/* globals document */
import React from 'react'
const {useEffect, useState} = React;
const _ = require('lodash');
const axios = require('axios');
import {useHistory, useLocation, useParams} from 'react-router-dom';

const bindReactClass = require('lib/bind-react-class');
const Selectimus = require('components/Selectimus');
const {default: VariationModal} = require('components/VariationModal');
const {slotPoints} = require('lib/slot-helper')

const Detachment = ({detachmentUnit: passedDetachmentUnit, show, unit, onDismiss, onSubmit}) => {
	const [detachmentDefById, setDetachmentDefById] = useState([])
	const [detachment, setDetachment] = useState([])
	const [units, setUnits] = useState([])
	const [keywords, setKeywords] = useState([])
	const [unitsByRole, setUnitsByRole] = useState([])
	const [unitsById, setUnitsById] = useState([])
	const [modelsById, setModelsById] = useState()
	const [selectedKeywords, setSelectedKeywords] = useState([])
	const [selectedUnit, setSelectedUnit] = useState()

	const {id} = useParams()
	const {search, pathname} = useLocation()
	const history = useHistory()

	const dunitsByUnitId = _.keyBy(detachment.detachment_units, 'unit_id')

	useEffect(async () => {
		const response = await axios.get(`/api/detachment_defs.json`)
		const detachmentDefs = response.data
		const detachmentDefById = _.keyBy(detachmentDefs, 'id')
		setDetachmentDefById(detachmentDefById)

		const response2 = await axios.get(`/api/detachments/${id}.json`)
		const detachment = response2.data
		setDetachment(detachment)

		const response3 = await axios.get(`/api/units.json`)
		const units = response3.data
		setUnits(units)
		const keywords = _(units)
			.filter('keywords')
			.map('keyword_array')
			.flatten()
			.map((keyword) => keyword.trim())
			.uniq()
			.map((keyword) => ({key: keyword, value: keyword}))
			.value()
		setKeywords(keywords)

		const unitsByRole = _.groupBy(units, 'battlefield_role')
		setUnitsByRole(unitsByRole)
		const unitsById = _.keyBy(units, 'id')
		setUnitsById(unitsById)

		const response4 = await axios.get(`/api/units/all-models.json`)
		const models = response4.data;
		const modelsById = _.keyBy(models, 'id')
		setModelsById(modelsById)

		const params = new URLSearchParams(search);
		const keys = _.compact((params.get('keywords') || '').split(','));
		const selectedKeywords = _.map(keys, (keyword) => ({key: keyword, value: keyword}))
		const recordedFilters = detachment.filters
			.split(',')
			.map((filter) => ({key: filter, value: filter}));
		if (recordedFilters.length > 0 && selectedKeywords.length === 0) {
			keywordChange(recordedFilters, units)
		} else if (selectedKeywords.length > 0) {
			keywordChange(selectedKeywords, units)
		}
	}, [])

	function handleKeywordChange(selectedKeywords) {
		keywordChange(selectedKeywords, units)
	}
	async function keywordChange(selectedKeywords, passedUnits) {
		const keywords = _.map(selectedKeywords, 'key')
		history.push({
			pathname,
			search: new URLSearchParams({keywords}).toString(),
		})

		const filterKeywords = _.map(selectedKeywords, 'value')
		const filterFunc = (unit) => {
			if (filterKeywords.length === 0) {return true}
			return _.intersection(unit.keyword_array, filterKeywords).length > 0
		}
		const unitsByRole = _(passedUnits)
			.filter(filterFunc)
			.groupBy('battlefield_role')
			.value()

		setUnitsByRole(unitsByRole)
		setSelectedKeywords(selectedKeywords)

		// Save filter selection to database
		detachment.filters = keywords.join(',')
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		await axios.put(`/api/detachments/${id}.json`, detachment, headers)
	}

	function handleUnitClick(unit) {
		return async (event) => {
			detachment.detachment_units = detachment.detachment_units || [];

			const detachment_unit = _.find(detachment.detachment_units, {unit_id: unit.id})
			if (detachment_unit) {
				_.remove(detachment.detachment_units, {unit_id: unit.id})
			} else {
				detachment.detachment_units.push({unit_id: unit.id, detachment_id: detachment.id})
			}

			if (!detachment_unit && _.get(unit, 'variations.length')) {
				setSelectedUnit(unit)
			}
			detachment.points = totalPoints()

			const token = document.querySelector('meta[name="csrf-token"]').content
			const headers = {headers: {'X-CSRF-Token': token}}
			const response = await axios.put(`/api/detachments/${id}.json`, detachment, headers)
			setDetachment(response.data)
		}
	}

	function handleDismissVariationModal() {
		setSelectedUnit(null)
	}

	async function handleSetVariation({detachmentUnitId, slots, variationId}) {
		const detachmentUnit = _.find(detachment.detachment_units, {id: detachmentUnitId})
		detachmentUnit.detachment_unit_slots = slots
		detachmentUnit.variation_id = variationId
		detachment.points = totalPoints()
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		await axios.put(`/api/detachments/${id}.json`, detachment, headers)
	}

	function handleEditVariations(unit) {
		return (event) => {
			event.preventDefault();

			if (_.get(unit, 'variations.length')) {
				setSelectedUnit(unit)
			}
		}
	}

	function unitPoints(unit) {
		const dunit = dunitsByUnitId[unit.id]
		if (!dunit) {return}

		return _(dunit.detachment_unit_slots)
			.map((slot) => variationPoints(slot))
			.compact()
			.sum() + unit.points
	}
	function variationPoints(slot) {
		if (!modelsById) {return}

		return _(slot.models)
			.map(({index}) => slotPoints(slot, modelsById, index))
			.sum()
	}
	function totalPoints() {
		const unitTotal = _(detachment.detachment_units)
			.map('unit_id')
			.map((id) => _.get(unitsById, [id, 'points']))
			.sum()
		const variationTotal = _(detachment.detachment_units)
			.filter('detachment_unit_slots.length')
			.map('detachment_unit_slots')
			.flatten()
			.map((slot) => variationPoints(slot))
			.compact()
			.sum()

		return unitTotal + variationTotal
	}

	const selectedUnitIds = _.map(detachment.detachment_units, 'unit_id')
	const UnitCard = ({type}) => {
		const units = _.get(unitsByRole, type, [])

		return (
			units.map((unit) => {
				const unitTotalPoints = unitPoints(unit)
				return (
					<React.Fragment key={`unit-${unit.id}`}>
						<div
							className={`detachment-unit ${_.includes(selectedUnitIds, unit.id) ? 'selected' : 'fail'}`}
							>
							{unit.name}
							<div onClick={handleUnitClick(unit)}><img src={`../assets/${unit.picture}`} className='unit-image' /></div>
							<div onClick={handleUnitClick(unit)} className='unit-points'>
								{(unitTotalPoints > unit.points) && (
									<span className='unit-total-points'>{unitTotalPoints}</span>
								)}
								<span className='base-points'>{unit.points}</span>
							</div>
							<div>
								<a href={unit.datasheet_link} target='_blank' rel='noreferrer' className='datasheet-link'>
									Datasheet
								</a>
							</div>
						</div>
						{_.includes(selectedUnitIds, unit.id) && (
							<div>
								<a className='edit-variation' title='Edit Variation'
									onClick={handleEditVariations(unit)}>
									Edit
								</a>
							</div>
						)}
					</React.Fragment>
				)
			})
		)
	}

	const detachmentDef = (detachment.detachment_def_id)
		? detachmentDefById[detachment.detachment_def_id]
		: undefined
	const total = totalPoints()
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
								onChange={handleKeywordChange}
								multiple={true}
								labelKey='key'
								valueKey='value'
								value={selectedKeywords}
								options={keywords} />
						</div>
					</div>

					<div className='units'>
						{(detachmentDef.hq_max > 0) && (
							<div className='role hq'>
								<div className='unit-type'>HQ</div>
								<div className='unit-min-max'>{detachmentDef.hq_min}-{detachmentDef.hq_max}</div>
								<div className='unit-symbol'>☠︎</div>

								<UnitCard type='HQ' />
							</div>
						)}
						{(detachmentDef.troop_max > 0) && (
							<div className='role troops'>
								<div className='unit-type'>TROOPS</div>
								<div className='unit-min-max'>{detachmentDef.troop_min}-{detachmentDef.troop_max}</div>
								<div className='unit-symbol troops-icon'>◁</div>

								<UnitCard type='Troops' />
							</div>
						)}
						{(detachmentDef.elite_max > 0) && (
							<div className='role elites'>
								<div className='unit-type'>ELITES</div>
								<div className='unit-min-max'>{detachmentDef.elite_min}-{detachmentDef.elite_max}</div>
								<div className='unit-symbol'>✠</div>

								<UnitCard type='Elites' />
							</div>
						)}
						{(detachmentDef.fast_attack_max > 0) && (
							<div className='role fast-attacks'>
								<div className='unit-type'>FAST ATTACK</div>
								<div className='unit-min-max'>{detachmentDef.fast_attack_min}-{detachmentDef.fast_attack_max}</div>
								<div className='unit-symbol'>⚡︎</div>

								<UnitCard type='Fast Attack' />
							</div>
						)}
						{(detachmentDef.heavy_support_max > 0) && (
							<div className='role heavy-supports'>
								<div className='unit-type'>HEAVY SUPPORT</div>
								<div className='unit-min-max'>{detachmentDef.heavy_support_min}-{detachmentDef.heavy_support_max}</div>
								<div className='unit-symbol'>❋</div>

								<UnitCard type='Heavy Support' />
							</div>
						)}
						{(detachmentDef.flyer_max > 0) && (
							<div className='role flyers'>
								<div className='unit-type'>FLYERS</div>
								<div className='unit-min-max'>{detachmentDef.flyer_min}-{detachmentDef.flyer_max}</div>
								<div className='unit-symbol'>🦋</div>

								<UnitCard type='Flyers' />
							</div>
						)}
						{(detachmentDef.fortification_max > 0) && (
							<div className='role fortifications'>
								<div className='unit-type'>FORTIFICATIONS</div>
								<div className='unit-min-max'>{detachmentDef.fortification_min}-{detachmentDef.fortification_max}</div>
								<div className='unit-symbol'>🏰</div>

								<UnitCard type='Fortification' />
							</div>
						)}
						{(detachmentDef.lord_of_war_max > 0) && (
							<div className='role lord-of-war'>
								<div className='unit-type'>LORD OF WAR</div>
								<div className='unit-min-max'>{detachmentDef.lord_of_war_min}-{detachmentDef.lord_of_war_max}</div>
								<div className='unit-symbol'>🏰</div>

								<UnitCard type='Lord of War' />
							</div>
						)}
					</div>
				</div>
			</div>

			<VariationModal
				show={Boolean(selectedUnit)}
				onDismiss={handleDismissVariationModal}
				onSubmit={handleSetVariation}
				detachmentUnit={detachmentUnit}
				unit={selectedUnit} />
		</div>
	) : null;
}

export default bindReactClass(Detachment)
