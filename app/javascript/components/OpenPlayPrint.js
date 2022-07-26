import _ from 'lodash';
import React from 'react'
const {useEffect, useState} = React;
import {useParams} from 'react-router-dom';
const axios = require('axios');

const OpenPlayPrint = () => {
	const {id} = useParams();
	const [unitsCheckedA, setUnitsCheckedA] = useState({})
	const [unitsCheckedB, setUnitsCheckedB] = useState({})
	const [unitsById, setUnitsById] = useState({})
	const [game, setGame] = useState({})
	const [modelsById, setModelsById] = useState({})

	useEffect(async () => {
		const response = await axios.get('/api/units.json')
		const units = response.data;
		const unitsById = _.keyBy(units, 'id')
		setUnitsById(unitsById);

		const response2 = await axios.get(`/api/open_plays/${id}.json`)
		const game = response2.data;
		setUnitsCheckedA(JSON.parse(game.teamA) || {})
		setUnitsCheckedB(JSON.parse(game.teamB) || {})

		const models = await fetchNeededModels(JSON.parse(game.teamA), JSON.parse(game.teamB))
		const modelsById = _.keyBy(models, 'id')
		setModelsById(modelsById)

		setGame(game)

	}, [])

	async function fetchNeededModels(teamA, teamB) {
		async function fetchModels(team) {
			let models = []
			for (const [unitId, options] of Object.entries(team)) {
				if (_.keys(options.slots).length > 0) {
					const response = await axios.get(`/api/units/${unitId}/variation-models.json`)
					models = [...models, ...response.data];
				}
			}
			return models
		}

		return [...await fetchModels(teamA), ...await fetchModels(teamB)]
	}

	function playerGameData(unitsChecked) {
		const filteredUnits = _(unitsChecked)
			.keys()
			.filter((unitId) => unitsChecked[unitId].included)
			.value()

		return (
			<table>
				<tbody>
					{filteredUnits.map((unitId) => (
						<React.Fragment key={unitId}>
							<tr>
								<td>{unitsById[unitId].name}</td>
							</tr>
							{_.map(_.values(_.get(unitsChecked, [unitId, 'slots'], {})), (slots) => (
								<React.Fragment key={JSON.stringify(slots)}>
									{_.map(_.values(slots), (modelId) => (
										<tr key={modelId}>
											<td className='variation-model'>{_.get(modelsById, [modelId, 'name'])}</td>
										</tr>
									))}
								</React.Fragment>
							))}
						</React.Fragment>
					))}
				</tbody>
			</table>
		)
	}


    return (
	<div className='OpenPlayPrint'>
		<h1>{game.name}</h1>

		<p>{game.desc}</p>

		<h2>Player 1:</h2>
		{playerGameData(unitsCheckedA)}

		<h2>Player 2:</h2>
		{playerGameData(unitsCheckedB)}
	</div>
    );
}

export default OpenPlayPrint
