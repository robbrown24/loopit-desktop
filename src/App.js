import React, { useEffect, useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import background from "./assets/kidsBackground.jpg";
//import sample from "./assets/kidsBackgroundVideo.mp4"
const { ipcRenderer } = window.require('electron');

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    //backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundImage: 'url('+background+')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    left: '50%',
    top: '50%',
    height: '100%',
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)',
    zIndex: '-1',
  },
  paper: {
    minWidth: 200,
    opacity: 0.8,
  },
  text: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 1,
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
  },
  fab: {
    position: "fixed",
  },
  logo: {
    maxHeight: 25,
  }
}));

export default function App() {

  const classes = useStyles();

  const [patient, setPatient] = useState('');
  const [type, setType] = useState('');
  const [chair, setChair] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    ipcRenderer.on('test', (event, arg) => {
      setPatient(arg[0].fname);
      setType(arg[0].procdescript);
      setChair(arg[0].op);
      setTime(arg[0].apttime);
    })
  })

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
        <Grid item xs={false} sm={12} md={12} className={classes.image}>
        
       {/*<Grid item xs={false} sm={12} md={12} >
        <video autoPlay loop muted className={classes.video}>  
          <source src={sample} type="video/mp4" />
        </video>   */}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}
      >

        <Grid item xs={3}>
          <div >
            <Typography component="h1" variant="h1" className={classes.text}>
              Hi {patient}!
            </Typography>
            <Typography component="h1" variant="h5" className={classes.text}>
              Welcome to Chair #{chair} for your {time} appointment 
            </Typography>
            <Typography component="h1" variant="h5" className={classes.text}>
              The plan today is {type}, sit back and relax.
            </Typography>
          </div>
        </Grid>   

      </Grid> 
          
      </Grid>  
      <Typography className={classes.fab}>
        Powered by Loopit
      </Typography>
    </Grid>
 
  )
}