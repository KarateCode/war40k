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
				<h1>Armies</h1>

				<table>
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
								<td><a href={`/armies/${set.id}`}>{set.name}</a></td>
								<td>{set.point_battle}</td>
								<td>{set.command_points}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Armies
