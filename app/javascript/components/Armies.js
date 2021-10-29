/* globals document */
import React from 'react'
const axios = require('axios');

const bindReactClass = require('lib/bind-react-class');

const {default: ArmyEditModal} = require('components/ArmyEditModal');

class Armies extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			armies: [],
			showAddArmyModal: true,
			newArmy: {
				name: '',
				'point_battle': null,
				'command_points': 0,
			},
			editArmy: {},
		}
	}

	async componentDidMount() {
		const response = await axios.get(`/api/armies.json`)
		const armies = response.data
		this.setState({armies})
	}

	handleShowAddArmyModal() {
		this.setState({showAddArmyModal: true, editArmy: {}})
	}

	handleToggleAddArmyModal() {
		this.setState({showAddArmyModal: !this.state.showAddArmyModal})
	}

	handleNameChange(event) {
		const newArmy = Object.assign({}, this.state.newArmy, {name: event.target.value})
		this.setState({newArmy})
	}

	handleCommandPointChange(event) {
		const newArmy = Object.assign({}, this.state.newArmy, {'command_points': parseInt(event.target.value)})
		this.setState({newArmy})
	}

	handlePointBattleChange(event) {
		const newArmy = Object.assign({}, this.state.newArmy, {'point_battle': parseInt(event.target.value)})
		this.setState({newArmy})
	}

	async handleSaveArmy(army) {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		if (army.id) {
			await axios.put(`/api/armies/${army.id}.json`, army, headers)
		} else {
			await axios.post(`/api/armies.json`, army, headers)
		}

		const response = await axios.get(`/api/armies.json`)
		const armies = response.data
		this.setState({armies, showAddArmyModal: false})
	}

	handleEditArmy(editArmy) {
		return () => {
			this.setState({showAddArmyModal: true, editArmy})
		}
	}

	handleDeleteArmy(army) {
	}

	render () {
		const {armies, editArmy, showAddArmyModal} = this.state

		return (
			<div className='Armies'>
				<header>
					<a className='btn btn-cancel left' href='/'>Back</a>
					Armies
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
									<td className='icon-field edit'><a onClick={this.handleEditArmy(army)}>✎</a></td>
									<td className='icon-field delete'><a onClick={this.handleDeleteArmy(army)}>✗</a></td>
									<td className='link-field'><a href={`/armies/${army.id}`}>{army.name}</a></td>
									<td className='link-field'><a href={`/armies/${army.id}`}>{army.point_battle}</a></td>
									<td className='link-field'><a href={`/armies/${army.id}`}>{army.command_points}</a></td>
								</tr>
							))}
						</tbody>
					</table>

					<a className='btn' onClick={this.handleShowAddArmyModal}>
						Add Army
					</a>
				</div>

				<ArmyEditModal
					show={showAddArmyModal}
					onDismiss={this.handleToggleAddArmyModal}
					army={editArmy}
					onSaveArmy={this.handleSaveArmy} />
			</div>
		);
	}
}

export default bindReactClass(Armies)
