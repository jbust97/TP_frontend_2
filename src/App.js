//import Plan from './Plan.js'
import {Grid, Paper} from '@material-ui/core';
import NavBar from './Components/NavBar';
  import Reservas from './Components/Reservas';

function App() {
  return (
    <div>
      <NavBar/> 
      <Grid container xs={12}>     
        <Grid item xs={10} style={{margin: 'auto', marginTop: "20px"}}>
        <Paper style={{maxWidth: 1300}}> 
          <Reservas/> 
        </Paper>
        </Grid> 
      </Grid>
    </div>
  );
}

export default App;
