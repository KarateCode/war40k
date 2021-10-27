import React from 'react'

const bindReactClass = require('lib/bind-react-class');

class Detachment extends React.Component {
	constructor(props) {
		super(props)
	}

	render () {
		return (
			<div className='Detachments'>
				<h1>Detachment !!!</h1>

			</div>
		);
	}
}

export default bindReactClass(Detachment)
