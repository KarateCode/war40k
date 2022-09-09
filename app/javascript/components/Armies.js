/* globals document */
import React from 'react'
const {useEffect, useState} = React;
const axios = require('axios');

const bindReactClass = require('lib/bind-react-class');

const {default: ArmyEditModal} = require('components/ArmyEditModal');

const Armies = () => {
	const [armies, setArmies] = useState([])
	const [showAddArmyModal, setShowAddArmyModal] = useState()
	const [editArmy, setEditArmy] = useState({})

	useEffect(async () => {
		const response = await axios.get(`/api/armies.json`)
		const armies = response.data
		setArmies(armies)
	})

	function handleShowAddArmyModal() {
		setShowAddArmyModal(true)
		setEditArmy({})
	}

	function handleToggleAddArmyModal() {
		setShowAddArmyModal(!showAddArmyModal)
	}

	async function handleSaveArmy(army) {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		if (army.id) {
			await axios.put(`/api/armies/${army.id}.json`, army, headers)
		} else {
			await axios.post(`/api/armies.json`, army, headers)
		}

		const response = await axios.get(`/api/armies.json`)
		const armies = response.data
		setArmies(armies)
		setShowAddArmyModal(false)
	}

	function handleEditArmy(editArmy) {
		return () => {
			setShowAddArmyModal(true)
			setEditArmy(editArmy)
		}
	}

	function handleDeleteArmy(army) {
	}

	return (
		<div className='Armies'>
			<header>
				<span className='left'><a className='btn btn-cancel left' href='/'>Home</a></span>
				<span className='middle'>Armies</span>
				<span className='right'><span className='placeholder'> </span></span>
			</header>

			<div className='main-body'>
				<table className='table has-clickable-rows'>
					<thead>
						<tr>
							<th> </th>
							<th> </th>
							<th>Name</th>
							<th>Point Battle</th>
							<th>Command Points</th>
						</tr>
					</thead>
					<tbody>
						{armies.map((army) => (
							<tr key={`army-${army.id}`}>
								<td className='icon-field edit'><a onClick={handleEditArmy(army)}>✎</a></td>
								<td className='icon-field delete'><a onClick={handleDeleteArmy(army)}>✗</a></td>
								<td className='link-field'><a href={`/armies/${army.id}`}>{army.name}</a></td>
								<td className='link-field'><a href={`/armies/${army.id}`}>{army.point_battle}</a></td>
								<td className='link-field'><a href={`/armies/${army.id}`}>{army.command_points}</a></td>
							</tr>
						))}
					</tbody>
				</table>

				<a className='btn' onClick={handleShowAddArmyModal}>
					Add Army
				</a>
			</div>

			<ArmyEditModal
				show={showAddArmyModal}
				onDismiss={handleToggleAddArmyModal}
				army={editArmy}
				onSaveArmy={handleSaveArmy} />
		</div>
	)
}

export default bindReactClass(Armies)
