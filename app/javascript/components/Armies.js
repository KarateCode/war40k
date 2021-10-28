/* globals document */
import React from 'react'
const axios = require('axios');

const Modal = require('components/Modal');
const bindReactClass = require('lib/bind-react-class');

class Armies extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			armies: [],
			showAddArmyModal: false,
			newArmy: {
				name: '',
				'point_battle': null,
				'command_points': 0,
			},
		}
	}

	async componentDidMount() {
		const response = await axios.get(`/api/armies.json`)
		const armies = response.data
		this.setState({armies})
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

	async handleCreateArmy() {
		const token = document.querySelector('meta[name="csrf-token"]').content
		const headers = {headers: {'X-CSRF-Token': token}}
		await axios.post(`/api/armies.json`, this.state.newArmy, headers)
		this.setState({showAddArmyModal: false})

		const response = await axios.get(`/api/armies.json`)
		const armies = response.data
		this.setState({armies})
	}

	render () {
		const {armies, newArmy, showAddArmyModal} = this.state
		console.log('newArmy:');
		console.log(require('util').inspect(newArmy, false, null));

		return (
			<div className='Armies'>
				<header>Armies</header>

				<div className='main-body'>
					<table className='table has-clickable-rows'>
						<thead>
							<tr>
								<th>Name</th>
								<th>Point Battle</th>
								<th>Command Points</th>
							</tr>
						</thead>
						<tbody>
							{armies.map((set) => (
								<tr key={`set-${set.id}`}>
									<td className='link-field'><a href={`/armies/${set.id}`}>{set.name}</a></td>
									<td className='link-field'><a href={`/armies/${set.id}`}>{set.point_battle}</a></td>
									<td className='link-field'><a href={`/armies/${set.id}`}>{set.command_points}</a></td>
								</tr>
							))}
						</tbody>
					</table>

					<a className='btn' onClick={this.handleToggleAddArmyModal}>
						Add Army
					</a>
				</div>

				<Modal
					headerText='Add Army'
					show={showAddArmyModal}
					onDismiss={this.handleToggleAddArmyModal}>

					<div className='form-group'>
						<label htmlFor='name-input'>Name:</label>
						<input type='text'
							className='form-control'
							id='name-input'
							autoFocus
							onChange={this.handleNameChange}
							value={newArmy.name} />
					</div>
					<div className='form-group'>
						<label htmlFor='name-input'>Command Points:</label>
						<input type='number'
							className='form-control'
							id='name-input'
							autoFocus
							onChange={this.handleCommandPointChange}
							value={newArmy.command_points} />
					</div>

					<div className='form-group'>
						<label>Choose Number of Points in Battle:</label>

						<div className='radio-group'>
							<input
								type='radio'
								onChange={this.handlePointBattleChange}
								name='point-battle'
								id='point-battle-500'
								value='500' />
							<label htmlFor='point-battle-500' className='point-battle-label'>
								500 1 Detachment
							</label>
						</div>
						<div className='radio-group'>
							<input
								type='radio'
								onChange={this.handlePointBattleChange}
								name='point-battle'
								id='point-battle-1000'
								value='1000' />
							<label htmlFor='point-battle-1000' className='point-battle-label'>
								1,000 2 Detachments
							</label>
						</div>
						<div className='radio-group'>
							<input
								type='radio'
								onChange={this.handlePointBattleChange}
								name='point-battle'
								id='point-battle-2000'
								value='2000' />
							<label htmlFor='point-battle-2000' className='point-battle-label'>
								2,000 3 Detachments
							</label>
						</div>
						<div className='radio-group'>
							<input
								type='radio'
								onChange={this.handlePointBattleChange}
								name='point-battle'
								id='point-battle-3000'
								value='3000' />
							<label htmlFor='point-battle-3000' className='point-battle-label'>
								3,000 4 Detachments
							</label>
						</div>
					</div>

					<div className='bottom-buttons'>
						<div className='bottom-buttons__left' />
						<div className='bottom-buttons__right'>
							<a className='btn'
								onClick={this.handleCreateArmy}>
								Create Army
							</a>
						</div>
					</div>

				</Modal>

			</div>
		);
	}
}

export default bindReactClass(Armies)
