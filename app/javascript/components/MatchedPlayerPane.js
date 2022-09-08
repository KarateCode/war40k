const _ = require('lodash');
import React from 'react'
const {useState} = React;
// import {useParams} from 'react-router-dom';
const axios = require('axios');

// const {handleInputChange} = require('lib/hook-helper')
const Selectimus = require('components/Selectimus');
const factions = [
	{code: 'necron', label: 'Necrons'},
	{code: 'tau', label: 'T\'au'},
	{code: 'space_marine', label: 'Space Marines'},
	{code: 'chaos', label: 'Chaos'},
]

const MatchedPlayerPane = ({paneData, player, onDataChange}) => {
	// const {id} = useParams();
	// const [game, setGame] = useState({})
	// const [name, handleNameChange] = useState(openPlay.name);
	const [warlordTraits, setWarlordTraits] = useState([]);
	const [relics, setRelics] = useState([]);
	const [faction, setFaction] = useState();

	// useEffect(async () => {
	// 	// const response = await axios.get('/api/units.json')
	// 	// const units = response.data;
	// 	// const unitsById = _.keyBy(units, 'id')
	// 	// setUnitsById(unitsById);

	// 	const response = await axios.get(`/api/open_plays/${id}.json`)
	// 	const game = response.data;
	// 	// setUnitsCheckedA(JSON.parse(game.teamA) || {})
	// 	// setUnitsCheckedB(JSON.parse(game.teamB) || {})
	// 	setGame(game)
	// }, [])

	// useEffect(() => {
		// handleNameChange(openPlay.name || '')
		// handleNotesChange(openPlay.notes || '')
	// }, [openPlay])

	async function handleFactionsChange(row) {
		setFaction(row)

        const {data: warlordTraits} = await axios.get(
            '/api/matched_plays/warlord_traits.json',
            {params: {faction: row.code}}
        )
        setWarlordTraits(warlordTraits);
        // enable warlord trait select

        const {data: relics} = await axios.get(
            '/api/matched_plays/relics.json',
            {params: {faction: row.code}}
        )
        setRelics(relics);
	}

    // function handleWarlordTrait1Change(row) {
	// 	onDataChange(Object.assign({}, paneData, {warlord_trait_id_1: row.id}))
    // }
	function handlePaneTraitChange(field) {
		return (row) => {
			onDataChange(Object.assign({}, paneData, {[field]: row.id}))
		}
	}

	const warlordTrait1 = _.find(warlordTraits, {id: _.get(paneData, 'warlord_trait_id_1')})
	const warlordTrait2 = _.find(warlordTraits, {id: _.get(paneData, 'warlord_trait_id_2')})
	const relic1 = _.find(relics, {id: _.get(paneData, 'relic_id_1')})
	const relic2 = _.find(relics, {id: _.get(paneData, 'relic_id_2')})

	return (
		<div className='matched_player_pane'>
			<div className='playerA'>
				<h2>Player {player.toUpperCase()}</h2>

				<div className='form-group'>
					<label htmlFor='name-input'>Factions:</label>
					<Selectimus
						onChange={handleFactionsChange}
						multiple={false}
						labelKey='label'
						valueKey='code'
						value={faction}
						options={factions} />
				</div>
			</div>

			<div className='form-group'>
				<label htmlFor='name-input'>Warlord Trait:</label>
				<Selectimus
					onChange={handlePaneTraitChange('warlord_trait_id_1')}
					multiple={false}
					labelKey='name'
					valueKey='id'
					value={warlordTrait1}
					options={warlordTraits} />
			</div>
			<div className='form-group'>
				<label htmlFor='name-input'>Secondary Warlord Trait:</label>
				<Selectimus
					onChange={handlePaneTraitChange('warlord_trait_id_2')}
					multiple={false}
					labelKey='name'
					valueKey='id'
					value={warlordTrait2}
					options={warlordTraits} />
			</div>

			<div className='form-group'>
				<label htmlFor='name-input'>Relic:</label>
				<Selectimus
					onChange={handlePaneTraitChange('relic_id_1')}
					multiple={false}
					labelKey='name'
					valueKey='id'
					value={relic1}
					options={relics} />
			</div>
			<div className='form-group'>
				<label htmlFor='name-input'>Secondary Relic:</label>
				<Selectimus
					onChange={handlePaneTraitChange('relic_id_2')}
					multiple={false}
					labelKey='name'
					valueKey='id'
					value={relic2}
					options={relics} />
			</div>
		</div>
	)
}

export default MatchedPlayerPane
