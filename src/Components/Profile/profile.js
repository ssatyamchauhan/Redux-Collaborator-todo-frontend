import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Avatar } from '@material-ui/core'
import swal from 'sweetalert'
import axios from 'axios';
import ls from 'local-storage';



class CardExample extends Component {

  constructor() {
    super()
    this.state = {
      data: {},
    }
  }


  componentDidMount() {
    axios.get('https://todobackend.learnreact.ml/profile', { params: { token: ls.get('credentials') } })
      .then(data => {
        this.setState({
          data: data.data[0]
        })
        console.log('this.is the fetched data', this.state.data)
      })
      .catch(err => {
        swal('You are troubling any issue, You need to checkout that...., error')
        console.log(err)
      })
  }

  render() {
    const colStyle = { maxWidth: "22rem" };
    return (
      <Card style={{ width: '20rem', margin: '0 auto', float: 'none', marginBottom: '10px', marginTop: '200px' }}>
        <div style={{ position: 'relative', left: 0, top: 0, }}>
          <Card.Img variant="top" src="http://eskipaper.com/images/beautiful-blurred-wallpaper-2.jpg" />
          <Avatar alt="Remy Sharp" src={this.state.data.imagelink || "https://p7.hiclipart.com/preview/980/304/8/computer-icons-user-profile-avatar.jpg"}
            style={{ height: 80, width: 80, position: 'absolute', top: '140px', left: '125px' }} />
        </div>
        <Card.Body>
    <Card.Title>{this.state.data.name}</Card.Title>
          <Card.Text>
            Love only grows by sharing. You can only have more for yourself by giving it away to others.
      </Card.Text>
    <Button variant="secondary">{this.state.data.email}</Button>
        </Card.Body>
      </Card>
    )
  }
}

export default CardExample;
