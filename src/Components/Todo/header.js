import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuIcon from '@material-ui/icons/Menu';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { Redirect } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import Drawer from '@material-ui/core/Drawer';
import Avatar from '@material-ui/core/Avatar';
import { useSelector } from  'react-redux';
import ls from 'local-storage';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [isopenprofile, setBoolean]  = React.useState(false)
  const [isProject, setProject]  = React.useState(false)
  const [logout, setLogout] = React.useState(false)
  const [state, setState] = React.useState({
    left: false,
  });

  const listoftodo = useSelector((state) => state.listoftodo)

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  if(!ls.get('credentials')){
    ls.clear();
    return <Redirect push to ='/login' />
  }

  var done = listoftodo.filter((i) => {
    return i.done === true || i.done === 1;
  })

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListItem onClick={() => setBoolean(true)} button key={'Profile'}>
          <ListItemIcon> < SupervisedUserCircleIcon /> </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </ListItem>
        <ListItem button key={'Project'} onClick={() => setProject(true)} >
          <ListItemIcon> <LibraryBooksIcon /> </ListItemIcon>
          <ListItemText>Project</ListItemText>
        </ListItem>
        <ListItem button key={'Logout'} onClick={() => setLogout(true)} >
          <ListItemIcon> <ExitToAppIcon /> </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItem>
      </List>
    </div>
  );
  
  let openprofile = () => {
    setBoolean(true)
  }

  if(isopenprofile){
    return <Redirect push to="/profile" />
  }
  if(isProject){
    return <Redirect push to='/projects' />
  }
  if(logout){
    ls.clear('credentials')
    return <Redirect to="/login" />
  }
  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon onClick={toggleDrawer('left', true)} />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
          Collaborative Todo
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={listoftodo.length-done.length} color="secondary">
                <HighlightOffIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={done.length} color="secondary">
                <CheckCircleOutlineIcon />
              </Badge>
            </IconButton>
            <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer"
            >
                <InsertEmoticonIcon onClick={openprofile} />
            </IconButton>
          </div>
        </Toolbar>
        <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
          {sideList('left')}
        </Drawer>
      </AppBar>
    </div>
  );
}
