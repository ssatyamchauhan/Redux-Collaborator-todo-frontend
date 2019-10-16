import React from 'react'
import  Project from './createproject'
import Listofproject from './listofproject'
import { Redirect } from 'react-router-dom';
import ls from 'local-storage';


class Main extends React.Component{

    render(){
        if(!ls.get('credentials')){
            return <Redirect to="/login" />
        }
        else{
                return  (
                    <React.Fragment>
                        <Project />
                        <Listofproject />
                    </React.Fragment>
                )
        }
    }
}




export default Main;