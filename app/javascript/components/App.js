import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import TeamBuilder from './TeamBuilder'
import MatchedPlays from './MatchedPlays'
import MatchedPlayDetails from './MatchedPlayDetails'
import OpenPlays from './OpenPlays'
import OpenPlay from './OpenPlay'
import OpenPlayPrint from './OpenPlayPrint'
import Armies from './Armies'
import Army from './Army'
import Detachment from './Detachment'
import Home from './Home'

const {default: PromptRoot} = require('components/PromptRoot');

class App extends React.Component {
	render () {
		return (
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/team' component={TeamBuilder} />
					<Route path='/matched_plays/:id' component={MatchedPlayDetails} />
					<Route path='/matched_plays' component={MatchedPlays} />
					<Route path='/open_plays/:id/print' component={OpenPlayPrint} />
					<Route path='/open_plays/:id' component={OpenPlay} />
					<Route path='/open_plays' component={OpenPlays} />
					<Route path='/armies/:id' component={Army} />
					<Route path='/armies' component={Armies} />
					<Route path='/detachments/:id' component={Detachment} />
				</Switch>

				<PromptRoot />
			</BrowserRouter>
		);
	}
}

export default App
