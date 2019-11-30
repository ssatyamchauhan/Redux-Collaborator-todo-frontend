import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// import { AppBar, Toolbar, Menu, Typography } from '@material-ui/core';
// import MenuIcon from '@material-ui/icons/Menu';
// import IconButton from '@material-ui/core/IconButton';
// import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import anotherTodo from '../../actions/anotherTodo';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import ls from 'local-storage';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';


class Project extends Component {

    state = {
        open: false,
        projectName: null
    }

    changeHandler = (event) => {
        this.setState({
            projectName: event.target.value
        })
    }

    handleClickOpen = () => {
        this.setState({
            open: true
        })
    }

    handleClose = () => {
        this.setState({
            open: false,
            projectName: ''
        })
    }

    addNewProject = () => {
        if (this.state.projectName) {
            axios.post('https://todobackend.learnreact.ml/project', {
                token: ls.get('credentials'),
                name: this.state.projectName
            })
                .then((data) => {
                    this.props.change('listofproject', data.data)
                })
                .catch(err => {
                    console.log(err)
                })
            this.setState({
                open: false
            })
        }
        else {
            swal("Name Is Empty", "You have not entered then project name...!", "error")
        }
    }


    render() {

        return (

            <div>
                <div style={{ position: "fixed", right: 120, bottom: 120 }}>
                    <Fab color="secondary" aria-label="add" onClick={this.handleClickOpen} >
                        <AddIcon />
                    </Fab>
                </div>
                <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Create New Project</DialogTitle>
                    <DialogContent >
                        <TextField
                            autoFocus
                            margin="dense"
                            onChange={this.changeHandler}
                            id="project"
                            type="text"
                            placeholder="Project Name"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={this.addNewProject} color="primary">
                            Add
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        change: (type, payload) => {
            dispatch(anotherTodo(type, payload))
        }
    }
}

export default connect(null, mapDispatchToProps)(Project);