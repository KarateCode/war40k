import React from "react"
import PropTypes from "prop-types"
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import TeamBuilder from './TeamBuilder'

class App extends React.Component {
	render () {
		return (
			<BrowserRouter>
				<Switch>
					{/*
						<Route exact path="/" render={() => ("Home!")} />
						<Route path="/hello" render={() => } />
					*/}
					<Route exact path="/" render={() => <TeamBuilder greeting="Friend" />} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App
