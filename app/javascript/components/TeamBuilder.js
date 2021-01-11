import React from 'react'
import PropTypes from 'prop-types'
const _ = require('lodash');
const axios = require('axios');
console.log('lodash');
console.log(_);

class TeamBuilder extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			unitsCheckedA: {},
			unitsCheckedB: {},
		}
	}

	async componentDidMount() {
		const response = await axios.get('/api/units.json')
		const units = response.data;
		const unitsById = _.keyBy(units, 'id')
		this.setState({unitsById});
	}

	handleOnClickA(event) {
		const {checked, value} = event.target
		const unitsCheckedA = Object.assign({}, this.state.unitsCheckedA, {[value]: checked})
		this.setState({unitsCheckedA})
	}

	handleOnClickB(event) {
		const {checked, value} = event.target
		const unitsCheckedB = Object.assign({}, this.state.unitsCheckedB, {[value]: checked})
		this.setState({unitsCheckedB})
	}

	render () {
		const {unitsCheckedA, unitsCheckedB, unitsById} = this.state
		const totalA = _(unitsCheckedA)
			.toPairs()
			.filter((pair) => pair[1])
			.map((pair) => unitsById[pair[0]].power)
			.sum()
		const totalB = _(unitsCheckedB)
			.toPairs()
			.filter((pair) => pair[1])
			.map((pair) => unitsById[pair[0]].power)
			.sum()

		return (
			<div>
				<header>
					<span className='team'>Team A: {totalA}</span>
					<span className='team'>Team B: {totalB}</span>
				</header>
				{unitsById && _.values(unitsById).map((unit) => (
					<div key={unit.id} className='row'>
						<span className='unit'>
							<label>{unit.name}</label>
							<span className='power'>{unit.power}</span>
							<input
								type='checkbox'
								value={unit.id}
								onChange={this.handleOnClickA.bind(this)}
								checked={unitsCheckedA[unit.id] || false} />
						</span>

						<span className='unit'>
							<input
								type='checkbox'
								value={unit.id}
								onChange={this.handleOnClickB.bind(this)}
								checked={unitsCheckedB[unit.id] || false} />
							<label>{unit.name}</label>
							<span className='power'>{unit.power}</span>
						</span>
					</div>
				))}
			</div>
		);
	}
}

TeamBuilder.propTypes = {
	greeting: PropTypes.string
}

export default TeamBuilder
