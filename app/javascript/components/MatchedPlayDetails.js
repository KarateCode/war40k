import React from 'react'
const {useEffect, useState} = React;
import {useParams} from 'react-router-dom';
const axios = require('axios');

import MatchedPlayerPane from './MatchedPlayerPane'

const {handleInputChange} = require('lib/hook-helper')
const Selectimus = require('components/Selectimus');
const factions = [
	{code: 'necrons', label: 'Necrons'},
	{code: 'tau', label: 'T\'au'},
	{code: 'space_marines', label: 'Space Marines'},
	{code: 'chaos', label: 'Chaos'},
]

const MatchedPlayDetails = ({show, onSaveMatchedPlay, onDismiss}) => {
	const {id} = useParams();
	const [game, setGame] = useState({})
	// const [name, handleNameChange] = useState(openPlay.name);
	// const [notes, handleNotesChange] = useState(openPlay.notes);
	// const [factionA, setFactionA] = useState();
	// const [factionB, setFactionB] = useState();

	useEffect(async () => {
		// const response = await axios.get('/api/units.json')
		// const units = response.data;
		// const unitsById = _.keyBy(units, 'id')
		// setUnitsById(unitsById);

		const response = await axios.get(`/api/open_plays/${id}.json`)
		const game = response.data;
		// setUnitsCheckedA(JSON.parse(game.teamA) || {})
		// setUnitsCheckedB(JSON.parse(game.teamB) || {})
		setGame(game)
	}, [])

	function handleSaveMatchedPlay(event) {
		event.preventDefault(); // form submission attempts to change url
		// onSaveMatchedPlay(Object.assign({}, openPlay, {name, notes}))
	}

	function handleDataChangeA(data) {
		console.log('onDataChange');
		console.log('data:');
		console.log(require('util').inspect(data, false, null));
		const newGame = Object.assign({}, game, {
			faction_a: data.faction,
			detachment_id_a: data.detachment_id,
			warlord_trait_id_a1: data.warlord_trait_id_1,
			warlord_trait_id_a2: data.warlord_trait_id_2,
			relic_id_a1: data.relic_id_1,
			relic_id_a2: data.relic_id_2,
			detachment_ability_id_a: data.detachment_ability_id,
			secondary_objective_id_a: data.secondary_objective_id,
		})
		console.log('newGame:');
		console.log(require('util').inspect(newGame, false, null));
		setGame(newGame)
	}
	function handleDataChangeB(data) {
		const newGame = Object.assign({}, game, {
			faction_b: data.faction,
			detachment_id_b: data.detachment_id,
			warlord_trait_id_b1: data.warlord_trait_id_1,
			warlord_trait_id_b2: data.warlord_trait_id_2,
			relic_id_b1: data.relic_id_1,
			relic_id_b2: data.relic_id_2,
			detachment_ability_id_b: data.detachment_ability_id,
			secondary_objective_id_b: data.secondary_objective_id,
		})
		setGame(newGame)
	}

	const paneDataA = {
		faction: game.faction_a,
		detachment_id: game.detachment_id_a,
		warlord_trait_id_1: game.warlord_trait_id_a1,
		warlord_trait_id_2: game.warlord_trait_id_a2,
		relic_id_1: game.relic_id_a1,
		relic_id_2: game.relic_id_a2,
		detachment_ability_id: game.detachment_ability_id_a,
		secondary_objective_id: game.secondary_objective_id_a,
	}
	console.log('paneDataA:');
	console.log(require('util').inspect(paneDataA, false, null));
	const paneDataB = {
		faction: game.faction_b,
		detachment_id: game.detachment_id_b,
		warlord_trait_id_1: game.warlord_trait_id_b1,
		warlord_trait_id_2: game.warlord_trait_id_b2,
		relic_id_1: game.relic_id_b1,
		relic_id_2: game.relic_id_b2,
		detachment_ability_id: game.detachment_ability_id_b,
		secondary_objective_id: game.secondary_objective_id_b,
	}

	return (

		<form onSubmit={handleSaveMatchedPlay} className='matched_play_details'>
			<MatchedPlayerPane
				onDataChange={handleDataChangeA}
				paneData={paneDataA}
				player='a' />

			<MatchedPlayerPane
				onDataChange={handleDataChangeB}
				paneData={paneDataB}
				player='b' />
		</form>
	)
}

export default MatchedPlayDetails
