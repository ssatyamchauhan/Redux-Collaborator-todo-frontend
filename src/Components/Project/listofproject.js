import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import anotherTodo from '../../actions/anotherTodo';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from './header';
import ls from 'local-storage';
import axios from 'axios';
// import Header from './header'

class Listofproject extends React.Component {

    state = {
        isProfile: false,
        isLoggedIn: false,
        isCardClick: false,
        cardid: null
    }

    profile = () => {
        this.setState({
            isProfile: true
        })
    }

    logout = () => {
        ls.clear('credentials')
        this.setState({
            isLoggedIn: true
        })
    }

    UNSAFE_componentWillMount() {
        axios.get('https://todobackend.learnreact.ml/project', { params: { token: ls.get('credentials') } })
            .then(data => {
                this.props.change('listofproject', data.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    cardClick = (e) => {
        this.setState({
            isCardClick: true,
            cardid: e
        })
    }

    render() {
        if (this.state.isCardClick) {
            return <Redirect push to={`/projects/view/?cardid=${this.state.cardid}`} />
        }
        if (this.props.listofproject === 'token is expired') {
            ls.clear('credentials')
            return <Redirect push to="/login" />
        }
        var Cards;
        if (this.props.listofproject === undefined || this.props.listofproject === [] || this.props.listofproject[0] === null) {
            return Cards = <Typography variant="h1">You Have not created any Project yet.</Typography>
        }
        else {
            // console.log('else is working',this.props.listofproject)
            Cards = this.props.listofproject.map((i, index) => {
                return <Card key={i.id} style={{
                    maxWidth: 345,
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    margin: 10, color: 'black', marginTop: 120,
                    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
                }}
                    onClick={() => this.cardClick(i.id)}
                >
                    <CardHeader
                        avatar={
                            <Avatar alt="Remy Sharp" src="https://www.searchpng.com/wp-content/uploads/2019/02/Profile-ICon.png" />
                        }
                        action={
                            <IconButton aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        }
                        title={i.name}
                        subheader={i.createdon}
                    />
                    <CardMedia
                        image="https://upload.wikimedia.org/wikipedia/en/2/27/The_Project_Title_Card.jpg"
                        title="click to open"
                    />
                    <CardContent>
                        <Typography variant="body2" color="textPrimary" component="p">
                            Welcome By clicking it! There is todos that is assigned by/to you. You can add, edit, delete and mark as done todos.
                        </Typography>
                    </CardContent>
                    <CardHeader subheader={`Created By ${i.email}`} />
                </Card>
            })
        }
        return (
            <div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end" }} >
                    < Header />
                    {Cards}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        listofproject: state.listofproject
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        change: (type, payload) => {
            dispatch(anotherTodo(type, payload))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Listofproject);