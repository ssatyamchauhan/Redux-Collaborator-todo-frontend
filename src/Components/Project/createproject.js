import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import anotherTodo from '../../actions/anotherTodo';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import ls from 'local-storage';
import axios from 'axios';


class Project extends Component {

    state={
            open:false,
            projectName:null
        }

    changeHandler = (event) => {
        this.setState({
            projectName: event.target.value
        })        
    }

    handleClickOpen = () => {
        this.setState({
            open:true
        })
    }

    handleClose = () => {
        this.setState({
            open:false,
            projectName:''
        })
    }

    addNewProject = () => {
        if(this.state.projectName){
            axios.post('http://13.126.45.215:2000/project',{
                token:ls.get('credentials'),
                name:this.state.projectName
                })
                .then((data) => {
                    this.props.change('listofproject',data.data)
                })
                .catch(err => {
                    console.log(err)
                })
            this.setState({
                open:false
            })
        }
        else{
            swal("Name Is Empty", "You have not entered then project name...!","error")
        }
    }


render() {

      return (
        <div>
            <LibraryAddIcon onClick={this.handleClickOpen} style={{position: "absolute", bottom: 120, right: 120}}/>
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
        change: (type,payload) => {
            dispatch(anotherTodo(type,payload))
        }
    }
}

export default connect(null,mapDispatchToProps)(Project);