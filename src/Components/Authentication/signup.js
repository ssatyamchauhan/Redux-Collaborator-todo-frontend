import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Redirect, Link as Links } from 'react-router-dom'
import ls from 'local-storage'
import swal from 'sweetalert'
import axios from 'axios'



function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default class SignUp extends Component {

    constructor(){
      super()
      this.state={
        first:null,
        last:null,
        email:null,
        password:null,
        isSignup:false
      }
    }


    changeHandler = (e) => {
      console.log(e.target.name)
      if(e.target.name==='first'){
        this.setState({first:e.target.value})
      }
      else if(e.target.name === 'last'){
        this.setState({last:e.target.value})
      }
      else if(e.target.name === 'email'){
        this.setState({email:e.target.value},()=>console.log(this.state.email))
      }
      else if(e.target.name === 'password'){
        this.setState({password:e.target.value})
      }
    }


      postData = (e) =>{
            e.preventDefault()
            axios.post('http://13.126.45.215:2000/signup',{
                name:this.state.first,
                email:this.state.email,
                password:this.state.password})
            .then((data) =>
                  {if(data.data==='Error'){
                    swal("OOP's!", "Email is already exists!", "info")
                  }
                  else{
                    swal("Good job!", "You are signup successfully!", "success");
                    this.setState({isSignup:true});
                  }
                })
            .catch((err) => {swal("OOP's!", "This data is already exists!", "info");
          })
        }

        render() {

          if(this.state.isSignup){
            return <Redirect to='/login' />
          }
          if(ls.get('credentials')){
              return <Redirect to ="/projects" />
          }

          return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={useStyles.paper}>
                <Avatar className={useStyles.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign up
                </Typography>
                <form className={useStyles.form} onSubmit={this.postData}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        onChange={this.changeHandler}
                        autoComplete="fname"
                        name="first"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        onChange={this.changeHandler}
                        variant="outlined"
                        required
                        fullWidth
                        name="last"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        onChange={this.changeHandler}
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        name="email"
                        type="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        onChange={this.changeHandler}
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        type="password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                        label="Accepts the term and condition of this App."
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={useStyles.submit}
                  >
                    Sign Up
                  </Button>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Links to="/login" >
                        Already have an account? Sign in
                      </Links>
                    </Grid>
                  </Grid>
                </form>
              </div>
              <Box mt={5}>
                <Copyright />
              </Box>
            </Container>
          );
    }
}