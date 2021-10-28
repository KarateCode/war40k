import React from 'react'
const _ = require('lodash');
const axios = require('axios');

const bindReactClass = require('lib/bind-react-class');

class Detachment extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			detachmentDefById: {},
			detachment: {},
		}
	}

	async componentDidMount() {
		const response = await axios.get(`/api/detachment_defs.json`)
		const detachmentDefs = response.data
		const detachmentDefById = _.keyBy(detachmentDefs, 'id')
		this.setState({detachmentDefById})

		const response2 = await axios.get(`/api/detachments/${this.props.match.params.id}.json`)
		const detachment = response2.data
		this.setState({detachment})

		// const response3 = await axios.get(`/api/armies/${this.props.match.params.id}.json`)
		// const army = response3.data
		// this.setState({army})
	}

	render () {
		const {detachment, detachmentDefById} = this.state
		const detachmentDef = (detachment.detachment_def_id)
			? detachmentDefById[detachment.detachment_def_id]
			: undefined

		return (detachmentDef) ? (
			<div className='Detachment'>
				<header>{detachment.name}</header>

				<div className='detachment main-body'>
					<div className='title'>
						<span>{detachmentDef.name}</span>
						<span className='spacer'>.....</span>
						<span>COMMAND COST: {detachmentDef.command_cost}CP</span>
					</div>

					<div className='body'>
						<div className='desc'>
							<div>
								Restrictions: {detachmentDef.restrictions}
							</div>
							<div>
								Command Benefits: {detachmentDef.command_benefits}
							</div>
							<div>
								Dedicated Transports: {detachmentDef.dedicated_transports}
							</div>
						</div>

						<div className='units'>
							{(detachmentDef.hq_max > 0) && (
								<div className='hq'>
									<div className='unit-type'>HQ</div>
									<div className='unit-min-max'>{detachmentDef.hq_min}-{detachmentDef.hq_max}</div>
									{_.range(detachmentDef.hq_max).map((index) => (
										<div className='unit-symbol' key={`hq-${index}`}>☠︎</div>
									))}
								</div>
							)}
							{(detachmentDef.troop_max > 0) && (
								<div className='troops'>
									<div className='unit-type'>TROOPS</div>
									<div className='unit-min-max'>{detachmentDef.troop_min}-{detachmentDef.troop_max}</div>
									{_.range(detachmentDef.troop_max).map((index) => (
										<div className='unit-symbol' key={`troop-${index}`}>◁</div>
									))}
								</div>
							)}
							{(detachmentDef.elite_max > 0) && (
								<div className='elites'>
									<div className='unit-type'>ELITES</div>
									<div className='unit-min-max'>{detachmentDef.elite_min}-{detachmentDef.elite_max}</div>
									{_.range(detachmentDef.elite_max).map((index) => (
										<div className='unit-symbol' key={`elite-${index}`}>✠</div>
									))}
								</div>
							)}
							{(detachmentDef.fast_attack_max > 0) && (
								<div className='fast-attacks'>
									<div className='unit-type'>FAST ATTACK</div>
									<div className='unit-min-max'>{detachmentDef.fast_attack_min}-{detachmentDef.fast_attack_max}</div>
									{_.range(detachmentDef.fast_attack_max).map((index) => (
										<div className='unit-symbol' key={`fast-attack-${index}`}>⚡︎</div>
									))}
								</div>
							)}
							{(detachmentDef.heavy_support_max > 0) && (
								<div className='heavy-supports'>
									<div className='unit-type'>HEAVY SUPPORT</div>
									<div className='unit-min-max'>{detachmentDef.heavy_support_min}-{detachmentDef.heavy_support_max}</div>
									{_.range(detachmentDef.heavy_support_max).map((index) => (
										<div className='unit-symbol' key={`heavy-support-${index}`}>❋</div>
									))}
								</div>
							)}
							{(detachmentDef.flyer_max > 0) && (
								<div className='flyers'>
									<div className='unit-type'>FLYERS</div>
									<div className='unit-min-max'>{detachmentDef.flyer_min}-{detachmentDef.flyer_max}</div>
									{_.range(detachmentDef.flyer_max).map((index) => (
										<div className='unit-symbol' key={`flyer-${index}`}>🦋</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		) : null;
	}
}

export default bindReactClass(Detachment)
