import React from 'react';
// import './App.css';
import Todo from './inputtodo';
import Listoftodo from './listoftodo'
import Header from './header'
import { Redirect } from 'react-router-dom';
import queryString from 'query-string'
import ls from 'local-storage'

class App extends React.Component {

  render(){
      if(!ls.get('credentials')){
        return <Redirect to="/login" />
      }

      return(
        <React.Fragment>
          <Header />
          <Todo cardid={queryString.parse(this.props.location.search).cardid} />
          <Listoftodo cardid={queryString.parse(this.props.location.search).cardid}/>
        </React.Fragment>
      ); 
    }
}

export default App;