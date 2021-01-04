import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom"

// Views
import Login from "./views/authentication/Login"
import Signup from "./views/authentication/Signup"
import PasswordReset from "./views/authentication/PasswordReset"
import Home from "./views/Home"
import PersonelDetails from './views/PersonelDetails'

// Authenticated User Routes
// import Home from "./Home"
// import { getAuthInfo } from "./shared/helpers"
// import AllReviews from "./views/dashboard/detail_pages/AllReviews"

function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/signup/"
          exact
          render={props => {
            return <Signup {...props} />
          }}
        />
        <Route
          path="/login/"
          exact
          render={props => {
            return <Login {...props} />
          }}
        />

<Route
          path="/passwordReset/"
          exact
          render={props => {
            return <PasswordReset {...props} />
          }}
        />
       
       <Route
          path="/home/"
          exact
          render={props => {
            return <Home {...props} />
          }}
        />


       <Route
          path="/personelDetails/"
          exact
          render={props => {
            return <PersonelDetails {...props} />
          }}
        />
      </Switch>
    </Router>
  )
}

export default App