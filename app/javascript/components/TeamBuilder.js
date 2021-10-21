import React from 'react'
import PropTypes from 'prop-types'
const _ = require('lodash');
const axios = require('axios');

class TeamBuilder extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			unitsCheckedA: {},
			unitsCheckedB: {},
			variationsA: {},
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

	handleToggleA(unit) {
		return () => {
			const unitsCheckedA = Object.assign(
				{},
				this.state.unitsCheckedA,
				{[unit.id]: !this.state.unitsCheckedA[unit.id]}
			)
			this.setState({unitsCheckedA})
		}
	}

	handleOnClickB(event) {
		const {checked, value} = event.target
		const unitsCheckedB = Object.assign({}, this.state.unitsCheckedB, {[value]: checked})
		this.setState({unitsCheckedB})
	}

	handleToggleB(unit) {
		return () => {
			const unitsCheckedB = Object.assign(
				{},
				this.state.unitsCheckedB,
				{[unit.id]: !this.state.unitsCheckedB[unit.id]}
			)
			this.setState({unitsCheckedB})
		}
	}

	handleToggleVariationA(variation) {
		return () => {
			console.log('variation:');
			console.log(require('util').inspect(variation, false, null));
			const variationsA = Object.assign(
				{},
				this.state.variationsA,
				{[variation.unit_id]: variation.id}
			)
			this.setState({variationsA})
		}
	}

	calcPowerA(unit) {
		if (unit.variations.length) {
			const variation = _.find(unit.variations, {id: this.state.variationsA[unit.id]});
			return unit.power + _.get(variation, 'extra_power', 0);
		} else {
			return unit.power
		}
	}

	render () {
		const {
			unitsCheckedA,
			unitsCheckedB,
			unitsById,
			variationsA,
		} = this.state

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
		console.log('variationsA:');
		console.log(require('util').inspect(variationsA, false, null));
		return (
			<div>
				<header>
					<span className='team'>Team A: {totalA}</span>
					<span className='team'>Team B: {totalB}</span>
				</header>
				<hr />
				{unitsById && _.values(unitsById).map((unit) => (
					<div key={unit.id} className='row' style={{color: unit.color}}>
						<span className='unit'>
							<a
								onClick={this.handleToggleA.bind(this)(unit)}
								className='clickable-area'>
								{unit.picture && (
									<img src={`assets/${unit.picture}`} className='unit-image' />
								)}
								<div className='unit-label'>
									<div>{unit.name.toUpperCase()}</div>
									<div className='variations'>
										{unit.variations.map((variation) => (
											<div className='variation'>
												<input type='radio' name={unit.id} onChange={this.handleToggleVariationA.bind(this)(variation)} />
												<span>{variation.name}</span>
												<span>{variation.extra_power}</span>
											</div>
										))}
									</div>
								</div>
								<span className='power'>{this.calcPowerA(unit)}</span>
							</a>
							<input
								type='checkbox'
								value={unit.id}
								className='included'
								onChange={this.handleOnClickA.bind(this)}
								checked={unitsCheckedA[unit.id] || false} />
						</span>

						<span className='unit'>
							<input
								type='checkbox'
								value={unit.id}
								className='included'
								onChange={this.handleOnClickB.bind(this)}
								checked={unitsCheckedB[unit.id] || false} />
							<a
								onClick={this.handleToggleB.bind(this)(unit)}
								className='clickable-area'>

								<span className='power'>{unit.power}</span>
								<div className='unit-label'>{unit.name.toUpperCase()}</div>
								{unit.picture && (
									<img src={`assets/${unit.picture}`} className='unit-image' />
								)}
							</a>
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
