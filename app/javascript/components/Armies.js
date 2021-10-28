import React from 'react'

const axios = require('axios');

class Armies extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			armies: [],
		}
	}

	async componentDidMount() {
		const response = await axios.get(`/api/armies.json`)
		const armies = response.data
		this.setState({armies})
	}


	render () {
		const {armies} = this.state

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

					<a className='btn' onClick={this.handleAddArmy}>
						Add Army
					</a>
				</div>
			</div>
		);
	}
}

export default Armies
