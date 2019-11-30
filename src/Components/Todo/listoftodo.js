import React from 'react';
import { connect } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import { DropzoneArea } from 'material-ui-dropzone'
import {
    ListItem,
    ListItemText,
    Checkbox,
    IconButton,
    Typography,
    Card,
    List,
    Link
} from '@material-ui/core'
// import { ListItemIcon } from '@material-ui/core';
// import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import CommentIcon from '@material-ui/icons/Comment';
// import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import anotherTodo from '../../actions/anotherTodo';
import AttachmentIcon from '@material-ui/icons/Attachment';
import EditIcon from '@material-ui/icons/Edit';
import Avatar from '@material-ui/core/Avatar';
import { Redirect } from 'react-router-dom';
import ReactS3 from 'react-s3';
import ls from 'local-storage';
import swal from 'sweetalert';
import axios from 'axios';
import _ from 'underscore';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button
} from '@material-ui/core'




class Listoftodo extends React.Component {

    state = {
        isEdit: false,
        editId: null,
        editText: '',
        open: false,
        todoid: null,
        projectid: null,
        description: '',
        file: [],
        isAttach: false,
        attachmentid: null,
        editDescription: false,
        attachedfile: [],
        comments: [],
        comment: null,
        openCommentbox: false,
        reply: false,
        replyid: null,
        replied: '',
        repliedcomments: []
    }

    componentDidMount() {
        Promise.all([
            axios.get('https://todobackend.learnreact.ml/todo', {
                params: {
                    token: ls.get('credentials'),
                    projectid: Number(this.props.cardid)
                }
            }),
            axios.get('https://todobackend.learnreact.ml/bucket', {
                params: {
                    token: ls.get('credentials'),

                }
            }),
            axios.get('https://todobackend.learnreact.ml/comments', {
                params: {
                    token: ls.get('credentials')
                }
            })
        ])
            .then(([todo, bucket, comments]) => {
                this.props.change('listoftodo', todo.data);
                this.props.change('listofbucket', bucket.data)
                this.setState({ comments: comments.data })

            })
            .catch((err) => console.log(err))

    }


    delete = (e) => {
        axios.post('https://todobackend.learnreact.ml/delete/' + e + '', {
            token: ls.get('credentials'),
            projectid: this.props.cardid
        })
            .then(data => {
                this.props.change('listoftodo', data.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    checkbox = (e) => {
        axios.post('https://todobackend.learnreact.ml/done/' + Number(e.target.id) + '', {
            done: e.target.checked,
            token: ls.get('credentials'),
            projectid: this.props.cardid
        })
            .then(data => {
                this.props.change('listoftodo', data.data)
            })
            .catch(err => console.log(err))
    }

    editClick = (e) => {

        var listoftodo = this.props.listoftodo;
        var dict = _.findWhere(listoftodo, { id: e })
        this.setState({
            editId: dict.id,
            editText: dict.todo,
            isEdit: true
        })
    }

    addtodo = (e) => {
        if (e.key === 'Enter') {
            if (this.state.isEdit) {
                axios.put('https://todobackend.learnreact.ml/todo', {
                    projectid: this.props.cardid,
                    todo: this.state.editText,
                    id: this.state.editId,
                    token: ls.get('credentials')
                })
                    .then(data => {
                        if (data.data === 'invalid') {
                            swal("This user does not exists!", "No user exists to this email...!", "error")
                        }
                        else {
                            this.setState({
                                isEdit: false,
                                editText: null,
                                editId: null
                            })
                            this.props.change('listoftodo', data.data)
                        }
                    })
                    .catch(err => console.log(err))
            }
        }
    }

    updateDescription = () => {
        if (this.state.editDescription) {
            axios.post('https://todobackend.learnreact.ml/description', {
                id: this.state.todoid,
                projectid: this.state.projectid,
                token: ls.get('credentials'),
                description: this.state.description
            })
                .then(data => {
                    if (data.data === 'invalid') {
                        swal("This user does not exists!", "No user exists to this email...!", "error")
                    }
                    else {
                        this.setState({
                            editDescription: false,
                            open: true
                        })
                        this.props.change('listoftodo', data.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    fileHandler = (files) => {
        this.setState({
            files: files
        })
    }

    uploadFile = () => {
        //formdata object to store the files So that it can be send to the server-side
        const formdata = new FormData();
        // push data in the formdata object.
        for (var i = 0; i < this.state.files.length; i++) {
            formdata.append("files", this.state.files[i]);
        }
        formdata.append('todoId', this.state.attachmentid)
        // console.log('credentials',ls.get('credentials'))
        formdata.append('token', ls.get('credentials'))
        axios
            .post("https://todobackend.learnreact.ml/uploadFile", formdata)
            .then(response => {
                // Storing data in redux store
                this.props.change('listofbucket', response.data.data);
                // Serialize data in a react state list
                var list = _.where(this.props.listofbucket, { todoid: this.state.attachmentid })
                this.setState({
                    attachedfile: list,
                })
            })
            .catch(err => console.log(err));
    }


    attachmentHandler = (id) => {
        var list = _.where(this.props.listofbucket, { todoid: id })
        this.setState({
            isAttach: true,
            attachmentid: id,
            attachedfile: list
        })
    }
    closeAttachement = () => {
        this.setState({
            isAttach: false,
            isDownloadClick: false,
            openCommentbox: false
        })
    }

    openDialog = (todoid, projectid) => {
        this.setState({
            open: true,
            todoid: todoid,
            projectid: projectid
        })
    }
    closeDescription = (e) => {
        this.setState({
            open: false,
            editDescription: false
        })
    }

    editDescription = () => {
        let dict = _.findWhere(this.props.listoftodo, { id: this.state.todoid })
        let description = dict.description;
        this.setState({
            editDescription: true,
            description: description
        })
    }

    comment = (e) => {
        if (e.key === "Enter") {
            axios.post('https://todobackend.learnreact.ml/comment',
                {
                    token: ls.get('credentials'),
                    comment: this.state.comment,
                    todoid: this.state.todoid
                })
                .then((data) => {
                    this.setState({ comments: data.data, comment: '' })
                })
                .catch(err => console.log(err))
        }
    }

    reply = (id) => {
        this.setState({
            reply: true,
            replyid: id
        })
    }

    replied = (e) => {
        if (e.key === "Enter") {
            axios.post('https://todobackend.learnreact.ml/replied', {
                token: ls.get('credentials'),
                todoid: this.state.todoid,
                comment: this.state.replied,
                parentid: this.state.replyid
            })
                .then((data) => {
                    this.setState({ comments: data.data, replied: '', comment: '', reply: false })
                })
                .catch(err => {
                    console.log(err)
                })

        }
    }

    render() {
        // console.log(this.props.listofbucket)
        // console.log(this.props.listoftodo)
        if (this.props.listoftodo === 'token is expired') {
            ls.clear('credentials')
            return <Redirect to="/login" />
        }

        if (this.state.isAttach) {
            var attachmentBox = <Dialog
                open={this.state.isAttach}
                onClose={this.closeAttachement}
                aria-labelledby="form-dialog-title"
                fullWidth
            >
                <DialogTitle>Upload And Download Files</DialogTitle>
                <DialogContentText>Click to download the file</DialogContentText>
                <DialogContentText>
                    {this.state.attachedfile.map((i) => {
                        return <ListItem>
                            <Typography>
                                <Link href={i.location} > {i.filename} </Link>
                            </Typography>
                        </ListItem>
                    })}
                </DialogContentText>
                <DropzoneArea onChange={this.fileHandler} />
                <DialogActions>
                    <Button onClick={this.closeAttachement} color="primary">
                        Cancel
                                    </Button>
                    <Button onClick={this.uploadFile} color="primary">
                        upload
                                    </Button>
                </DialogActions>
            </Dialog>
        }
        if (this.state.open) {
            let dict = _.findWhere(this.props.listoftodo, { id: this.state.todoid })
            let description = dict.description;
            if (this.state.editDescription) {
                var dialog = <div>
                    <Dialog open={this.state.open} onClose={this.closeDescription} aria-labelledby="form-dialog-title" fullWidth>
                        <DialogTitle id="form-dialog-title">Description</DialogTitle>
                        <DialogContent >
                            <TextField
                                multiline={true}
                                margin="dense"
                                onChange={(event) =>
                                    this.setState({
                                        description: event.target.value
                                    })
                                }
                                value={this.state.description}
                                type="text"
                                placeholder="Yet not added any description"
                                fullWidth
                                autoFocus
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeDescription} color="primary">
                                Cancel
                                        </Button>
                            <Button onClick={this.updateDescription} color="primary">
                                Update
                                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            }
            else {
                dialog = <div>
                    <Dialog open={this.state.open} onClose={this.closeDescription} aria-labelledby="form-dialog-title" fullWidth>
                        <DialogTitle id="form-dialog-title">Description</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{description || "You have not added any description."}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.closeDescription} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.editDescription} color="primary">
                                Edit
                            </Button>
                        </DialogActions>
                        <List>
                            {this.state.comments.map((i) => {
                                if (this.state.reply && this.state.replyid === i.id) {
                                    var commenting = <List>
                                        <ListItem>
                                            <Card style={{ height: 40}}>
                                                <TextField
                                                    style={{width: 400}}
                                                    type="text"
                                                    variant="outlined"
                                                    onChange={
                                                        (event) => this.setState({
                                                            replied: event.target.value
                                                        })}
                                                    onKeyPress={(e) => this.replied(e)}
                                                    placeholder="Comment here"
                                                    autoFocus
                                                />
                                            </Card>
                                        </ListItem>
                                    </List>
                                }
                                if (true) {

                                    var childcomment = _.filter(this.state.comments, (dict) => {
                                        return i.id === dict.parentid;
                                    })
                                    {
                                        var child = childcomment.map((j) => {
                                            return <ListItem key={j.id} style={{ paddingLeft: 100 }}>
                                                <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp" src="https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto/gigs/111144127/original/796fac190959d25a639b38c89856df0a9d1f9e94/design-minimalist-flat-line-vector-avatar-of-you.jpg" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={j.name}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                style={{ display: "inline" }}
                                                                color="textPrimary"
                                                            >
                                                                {j.comment}
                                                            </Typography>
                                                            {/* {" — I'll be in your neighborhood doing errands this…"} */}
                                                        </React.Fragment>
                                                    }
                                                />
                                            </ListItem>
                                        })
                                    }
                                    if (this.state.todoid === i.todoid && i.parentid === null) {
                                        return <List>
                                            <ListItem key={i.id}>
                                                <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp" src="https://cdn.dribbble.com/users/199982/screenshots/4055552/burhan-avatar-dribbble-dark_1x.png" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={i.name}
                                                    secondary={
                                                        <React.Fragment>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                style={{ display: "inline" }}
                                                                color="textPrimary"
                                                            >
                                                                {i.comment}
                                                            </Typography>
                                                            {/* {" — I'll be in your neighborhood doing errands this…"} */}
                                                        </React.Fragment>
                                                    }
                                                />
                                                <IconButton>
                                                    <CommentIcon onClick={() => this.reply(i.id)} />
                                                </IconButton>
                                            </ListItem>
                                            {child}
                                            {commenting}
                                        </List>
                                    }
                                }
                            })}
                            <TextField
                                style={{ width: 550, marginLeft: 20 }}
                                type="text"
                                placeholder="Add Comment"
                                value={this.state.comment}
                                onChange={
                                    (event) => {
                                        this.setState({
                                            comment: event.target.value
                                        })
                                    }}
                                onKeyPress={(e) => this.comment(e)}
                                variant="outlined"
                                fullWidth
                            />
                        </List>
                    </Dialog>
                </div>
            }
        }

        var todos = this.props.listoftodo.map((i) => {
            if (this.state.editId !== i.id) {
                return <Card key={i.id} style={{ margin: 16, padding: 10 }}>
                    <ListItem style={{ backgroundColor: "black", color: "white" }}>
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
                        <ListItemText onClick={() => this.openDialog(i.id, i.projectid)}> {i.todo} </ListItemText>
                        <IconButton>
                            <AttachmentIcon onClick={() => this.attachmentHandler(i.id)} />
                        </IconButton>
                        <IconButton>
                            <EditIcon onClick={() =>
                                this.editClick(i.id)
                            }
                            />
                        </IconButton>
                        <IconButton onClick={() =>
                            this.delete(i.id)
                        }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                </Card>
            }
            else {
                return <Card key={i.id} style={{ margin: 16, padding: 10 }}>
                    <ListItem style={{ backgroundColor: "black", color: "white" }}>
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
                        <TextField
                            type="text"
                            value={this.state.editText}
                            onKeyPress={this.addtodo}
                            onChange={(e) =>
                                this.setState({
                                    editText: e.target.value
                                })}
                            autoFocus
                            fullWidth
                        />
                    </ListItem>
                </Card>
            }
        })

        return (
            <React.Fragment>
                {attachmentBox}
                {dialog}
                {todos}
            </React.Fragment>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        listoftodo: state.listoftodo,
        projectid: state.projectid,
        listofbucket: state.listofbucket
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        change: (type, name) => {
            dispatch(anotherTodo(type, name))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Listoftodo);