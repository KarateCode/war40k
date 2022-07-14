import React from "react"
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import TeamBuilder from './TeamBuilder'
import Teams from './Teams'
import Armies from './Armies'
import Army from './Army'
import Detachment from './Detachment'
import Home from './Home'
import OpenPlay from './OpenPlay'

class App extends React.Component {
	goHome() {
		return <Home />
	}
	goTeamBuilder() {
		return <TeamBuilder />
	}
	goTeams() {
		return <Teams greeting='Friend' />
	}
	goArmies() {
		return <Armies />
	}
	goArmy() {
		return <Army />
	}

	render () {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path='/' render={this.goHome} />
					<Route path='/team' render={this.goTeamBuilder} />
					<Route path='/teams/:id' component={OpenPlay} />
					<Route path='/teams' render={this.goTeams} />
					<Route path='/armies/:id' component={Army} />
					<Route path='/armies' render={this.goArmies} />
					<Route path='/detachments/:id' component={Detachment} />
				</Switch>
			</BrowserRouter>
		);
	}
}

export default App
