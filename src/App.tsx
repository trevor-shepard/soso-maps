import React from 'react'
import './styles/App.css'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import Subscribe from 'components/subscribe'
import TabNav from 'features/tab-nav'
import Map from 'features/map'
import Inventory from 'features/inventory'
import CreateTouch from 'features/touch/create'
import DetailTouch from 'features/touch/detail'
import DetailList from 'features/touch/list'
import CommunityMemberList from 'features/community-member/list'
import CommunityMemberDetail from 'features/community-member/detail'
import Profile from 'features/profile'
import store from 'store'
import { AuthRoute, ProtectedRoute } from 'utils/routeUtils'
import Login from 'features/login'
export const persistor = persistStore(store)

function App() {

	return (
		<div className="App">
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Subscribe />
					<Router>
						<Switch>
							<AuthRoute path="/login" component={Login} />
							<ProtectedRoute
								path="/touch-create/:coords"
								exact={true}
								component={CreateTouch}
							/>
							<ProtectedRoute
								path="/touch-detail/:id"
								exact={true}
								component={DetailTouch}
							/>
							<ProtectedRoute
								path="/touch-list"
								exact={true}
								component={DetailList}
							/>
							<ProtectedRoute
								path="/community-member-detail/:id"
								exact={true}
								component={CommunityMemberDetail}
							/>
							<ProtectedRoute
								path="/community-member-list"
								exact={true}
								component={CommunityMemberList}
							/>
							<ProtectedRoute
								path="/inventory"
								exact={true}
								component={Inventory}
							/>
							<ProtectedRoute
								path="/profile"
								exact={true}
								component={Profile}
							/>
							<ProtectedRoute path="/" component={Map} />
						</Switch>
						<ProtectedRoute component={TabNav} />
					</Router>
				</PersistGate>
			</Provider>
		</div>
	)
}

export default App
