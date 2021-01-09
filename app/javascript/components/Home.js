import React from "react"
import PropTypes from "prop-types"
class Home extends React.Component {
	render () {
		return (
			<React.Fragment>
				Home Page
				<a href='/team'>Team Builder</a>
			</React.Fragment>
		);
	}
}

export default Home
