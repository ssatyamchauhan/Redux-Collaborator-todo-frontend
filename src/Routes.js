import React from 'react';
import Todo from './Components/Todo/index'
import Project from './Components/Project/index'
import Login from './Components/Authentication/login'
import Signup from './Components/Authentication/signup'
import Forget from './Components/Authentication/forget'
import Reset from './Components/Authentication/reset'
import Profile from './Components/Profile/profile';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


export default class Routes  extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/signup" exact component={Signup} />
                    <Route path='/login' exact component={Login} />
                    <Route path='/forget' exact component={Forget} />
                    <Route path='/reset' exact component={Reset} />
                    <Route path='/projects' exact component={Project} />
                    <Route path='/projects/view/' exact component={Todo} />
                    <Route path= '/profile' exact component={Profile} />
                </Switch> 
            </Router>
        )
    }

}