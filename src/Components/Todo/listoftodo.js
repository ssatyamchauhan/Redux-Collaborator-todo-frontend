import React from 'react';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import {
     ListItem, 
     ListItemText, 
     Checkbox,
     IconButton,
     Card,
     Input
    } from '@material-ui/core'
import anotherTodo from '../../actions/anotherTodo';

import Avatar from '@material-ui/core/Avatar';
import { Redirect } from 'react-router-dom';
import ls from 'local-storage';
import swal  from 'sweetalert';
import axios from 'axios';
import _ from 'underscore';




class Listoftodo extends React.Component {

    state={
        isEdit:false,
        editId:null,
        editText:null
    }

    componentDidMount () {
        axios.get('http://13.126.45.215:2000/todo', {
            params:{
                token:ls.get('credentials'),
                projectid:Number(this.props.cardid)
            }
        })
        .then(data => {
            if(data.data){
                this.props.change('listoftodo',data.data)
            }
        })
        .catch(err => console.log(err))
    }

    delete = (e) => {
        axios.post('http://13.126.45.215:2000/delete/'+e+'', {
                token:ls.get('credentials'),
                projectid: this.props.cardid
            })
            .then(data => {
                this.props.change('listoftodo',data.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    checkbox = (e) => {
        axios.post('http://13.126.45.215:2000/done/'+Number(e.target.id)+'',{
            done:e.target.checked,
            token:ls.get('credentials'),
            projectid: this.props.cardid
        })
        .then(data => {
            this.props.change('listoftodo',data.data)
        })
        .catch(err => console.log(err))
    }

    doubleClick = (e) => {

        var listoftodo = this.props.listoftodo;
        var dict = _.findWhere(listoftodo,{id:e})
        this.setState({
            editId: dict.id,
            editText:dict.todo,
            isEdit:true
        })
    }

    addtodo = (e) => {
        if(e.key === 'Enter'){
            if(this.state.isEdit){
                axios.put('http://13.126.45.215:2000/todo', {
                    projectid:this.props.cardid,
                    todo:this.state.editText,
                    id:this.state.editId,
                    token:ls.get('credentials')
                })
                .then(data => {
                    if(data.data === 'invalid'){
                        swal("This user does not exists!", "No user exists to this email...!", "error")
                    }
                    else{
                        this.setState({
                            isEdit:false,
                            editText:null,
                            editId:null
                        })
                        this.props.change('listoftodo',data.data)
                    }
                })
                .catch(err => console.log(err))
                }
            }
        }
    
 
    render() {
        if(this.props.listoftodo === 'token is expired'){
            ls.clear('credentials')
            return <Redirect to="/login" />
        }
        var todos = this.props.listoftodo.map((i) => {
            if(this.state.isEdit){
                return <Card key={i.id} style={{ margin: 16, padding: 10}}>
                            <ListItem style={{backgroundColor:"black", color:"white"}}>
                                <Avatar 
                                    alt="Remy Sharp" 
                                    src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"
                                />
                                <ListItemText>
                                    By: {i.assignedby}
                                </ListItemText>
                                <Avatar 
                                    alt="Remy Sharp" 
                                    src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"  
                                />
                                <ListItemText>
                                    To: {i.assignedto}
                                </ListItemText>
                            </ListItem>

                            <ListItem>
                                <Checkbox 
                                    id={String(i.id)}
                                    aria-label="checkbox"
                                    onClick={this.checkbox} 
                                    checked={i.done}
                                />
                                 <Input
                                    type="text" 
                                    value={this.state.editText} 
                                    onKeyPress={this.addtodo}
                                    onChange={(e) => this.setState({editText:e.target.value})} 
                                    autoFocus
                                    fullWidth
                                />
                            </ListItem>
                        </Card>
                    }
            else{
                return  <Card key={i.id} style={{ margin: 16, padding: 10}}>
                        <ListItem style={{backgroundColor:"black", color:"white"}}>
                            <Avatar 
                                alt="Remy Sharp" 
                                src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"
                            />
                            <ListItemText>
                                By: {i.assignedby}
                            </ListItemText>
                            <Avatar 
                                alt="Remy Sharp" 
                                src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png"  
                            />
                            <ListItemText>
                                To: {i.assignedto}
                            </ListItemText>
                        </ListItem>
                        <ListItem onDoubleClick={() => this.doubleClick(i.id)}> 
                            <Checkbox 
                                id={String(i.id)}
                                aria-label="checkbox"
                                onClick={this.checkbox} 
                                checked={i.done}
                            />
                            <ListItemText> {i.todo}</ListItemText>
                            <IconButton onClick={() => this.delete(i.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    </Card>
            }
        })

        return (
            <React.Fragment>
                {todos}                    
            </React.Fragment>
        )
    }
}



const mapStateToProps = (state) => {
    console.log(state)
    return  {
        listoftodo: state.listoftodo,
        projectid: state.projectid
    }  
}

const mapDispatchToProps = (dispatch) => {
    return{
        change: (type,name) => {
            dispatch(anotherTodo(type,name))
          }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Listoftodo);