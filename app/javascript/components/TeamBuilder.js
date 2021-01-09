import React from "react"
import PropTypes from "prop-types"

class TeamBuilder extends React.Component {
	render () {
		console.log('*');
		console.log('hit!');
		console.log('*');
		return (
			<React.Fragment>
				Greeting: {this.props.greeting}
				Woah, Team building!?!
			</React.Fragment>
		);
	}
}

TeamBuilder.propTypes = {
	greeting: PropTypes.string
};

export default TeamBuilder
