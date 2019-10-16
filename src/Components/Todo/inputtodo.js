import React from 'react';
import {Grid, TextField,Paper} from "@material-ui/core";
import anotherTodo from '../../actions/anotherTodo'
import { connect } from 'react-redux';
import swal from 'sweetalert';
import ls from 'local-storage';
import axios from 'axios';


function Inputtodo(props){

  const [todo, setTodo] = React.useState(null)
  const [assignedto, setAssigned] = React.useState(null)


  console.log(todo,'and',assignedto)

  let addtodo = (e) => {
    if(e.key === 'Enter'){
          if(todo && assignedto){
            console.log('add todo is working')
            axios.post('http://13.126.45.215:2000/todo', {
                  projectid:Number(props.cardid),
                  assignedto:assignedto, 
                  todo:todo,
                  done:false ,
                  token:ls.get('credentials')
                })
            .then(data => {
              if(data.data === 'invalid'){
                swal("This user does not exists!", "No user exists to this email...!", "error")
              }
              else{
                  setAssigned('')
                  setTodo('')
                  props.change('listoftodo',data.data)
              }
            })
            .catch(err => console.log(err))
          }
      }
  }


    return(
        <Paper style={{ margin: 16, padding: 14}} >
                <Grid container>
                    <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
                        <TextField
                            placeholder="Add Your Todo Here"
                            id="todo"
                            onChange={(event) => setTodo(event.target.value)}
                            onKeyPress={addtodo}
                            value={todo}
                            fullWidth
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
                        <TextField
                            placeholder="Assigned To"
                            id="assignedto"
                            onChange={(event) => setAssigned(event.target.value)}
                            value={assignedto}
                            type="email"
                            onKeyPress={addtodo}
                            // onKeyPress={}
                            fullWidth
                        />
                    </Grid>
                </Grid>
        </Paper>
        
    )
}

const mapStateToProps = (state) => {
  
  return {
    list:state.listoftodo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    change: (type,name) => {
      dispatch(anotherTodo(type,name))
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Inputtodo);
