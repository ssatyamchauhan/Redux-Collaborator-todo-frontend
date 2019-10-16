import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ls from 'local-storage';
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { List, ListItem, ListItemText, Typography, Avatar } from '@material-ui/core';
import swal from 'sweetalert'

export default class Profile extends Component {

    constructor(){
        super()
        this.state={
            data:{},
        }
    }


    componentDidMount(){
        axios.get('http://13.126.45.215:2000/profile', {params:{token:ls.get('credentials')}})
            .then(data => {
                console.log('fetched data',data.data)
                this.setState({
                    data:data.data[0]
                })
                console.log('this.is the fetched data',this.state.data)
            })
            .catch(err => {
                swal('You are troubling any issue, You need to checkout that...., error')
                console.log(err)
            })
    }

    render(){

        if(!ls.get('credentials')){
            return <Redirect pushto="/login" />
        }
        return (
            <Card style={{height:180, width:300, display:"flex", flexDirection:"column",justifyContent:"flex-end", alignSelf:"center"}}>
                <List>
                    <ListItem>
                        <ListItemText>
                            <Avatar 
                                alt="Remy Sharp" 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLow_IPNDld2elH-g6Sqgpy1KGCh3RAd_78dRXPPejqaJDAiuI"
                            />
                        </ListItemText>
                        <ListItemText>
                            {this.state.data.name}
                        </ListItemText>
                    </ListItem>
                </List>
                <CardContent>

                    <Typography variant="h6" color="primaryText">
                        Email
                    </Typography>
                    <Typography variant="body2">
                        {this.state.data.email}
                    </Typography>

                </CardContent>
            </Card>
        )
    }
}