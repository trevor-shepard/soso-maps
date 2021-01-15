import React from 'react'
import './styles/App.css'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Map from 'features/map'
import CreateTouch from 'features/touch/create'
import DetailTouch from 'features/touch/detail'
import DetailList from 'features/touch/list'

import store from 'store'

export const persistor = persistStore(store)

function App() {
	return (
		<div className="App">
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Router>
						<Switch>
							<Route
								path="/touch-create/:coords"
								exact={true}
								component={CreateTouch}
							/>
							<Route
								path="/touch-detail/:id"
								exact={true}
								component={DetailTouch}
							/>
							<Route path="/touch-list" exact={true} component={DetailList} />
							<Route path="/" component={Map} />
						</Switch>
					</Router>
				</PersistGate>
			</Provider>
		</div>
	)
}

export default App
