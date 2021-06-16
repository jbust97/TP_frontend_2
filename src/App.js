//import Plan from './Plan.js'
import {Grid, Paper} from '@material-ui/core';
import NavBar from './Components/NavBar';
import Reservas from './Components/Reservas';
import Consumo from './Components/Consumo';
import DetalleConsumo from './Components/DetalleConsumo';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
    <div>
      <NavBar/>       
    </div>
    <Switch>
      <Route exact path="/reservas">
      <Grid container xs={12}>     
        <Grid item xs={10} style={{margin: 'auto', marginTop: "20px"}}>
        <Paper style={{maxWidth: 1300}}> 
          <Reservas/> 
        </Paper>
      </Grid> 
      </Grid>
      </Route>
      <Route path="/consumo/:id">
        <DetalleConsumo/>
      </Route>
      <Route path="/consumo">
        <Consumo/>
      </Route>
      
    </Switch>
    </Router>
  );
}

export default App;
