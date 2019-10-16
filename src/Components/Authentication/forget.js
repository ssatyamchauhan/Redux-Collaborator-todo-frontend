import React, { Component } from 'react';
import { ValidatorForm } from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Redirect, Link as Links }  from 'react-router-dom';
import { Grid } from '@material-ui/core';
import ls from 'local-storage'
import swal from 'sweetalert';
import axios from 'axios';

export default class Recover extends Component{

    state={
            email:null,
            forget:false,
            message:null,
        }

    changeHandler = (e) =>{
        this.setState({
            email: e.target.value
        })
    }

    forget = (e) =>{

        
        console.log('forget password is requested by user!', e.target.label)
            if(this.state.email){
                axios
                    .post('http://13.126.45.215:2000/forget',{email:this.state.email})
                    .then(data => {
                        if(data.data === 'not a user'){
                            swal("Check your email!", "You have a entered the wrong email address!","error")
                        }
                        else{
                            swal("Check your email!", "Reset password link has sent to your email address!","success")
                        }
                        
                    })
                    .catch(err => console.log(err))
                    this.setState({
                        forget:true
                    })
            }
            else{
                swal("Enter your Email first!", "Hey Enter your email!","error")
            }
    }

    render(){
        if(ls.get('credentials')){
            return <Redirect to="/projects" />
        }

        return(

            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                background="white"
                style={{ minHeight: '100vh' }}
            >
                <form onSubmit={this.forget}>
                    <h2>Hey Enter you email to reset your password!</h2>
                    <ValidatorForm>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            value={this.state.email} 
                            onChange={this.changeHandler}
                            label="Email Address"
                            autoComplete="email"
                            type="email"
                            autoFocus
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            label="forget"
                            color="primary"
                            onClick={this.userLogin}>
                            Forget Password
                        </Button>
                        
                    </ValidatorForm>
                    <Links to="/login" >
                        Back to login page
                    </Links>
                </form>
            </Grid>            
        )
    }
}