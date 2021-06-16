import {useState} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
} from '@material-ui/core';
import {
    Link
} from 'react-router-dom';
import NuevaReserva from './NuevaReserva'
import Plan from './Plan'
export default function NavBar(){
    const [open,setOpen] = useState(false);
    const [openPlan,setOpenPlan] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleClickOpenPlan = () => {
        setOpenPlan(true);
    };
    const handleClosePlan = () => {
        setOpenPlan(false);
    };
    
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                    Restop
                    </Typography>
                    <Link to="/consumo"><Button variant="contained" onClick={handleClickOpenPlan} style={{marginRight:"20px"}}>Consumición</Button></Link>
                    <Link to="/reservas"><Button variant="contained" onClick={handleClickOpenPlan} style={{marginRight:"20px"}}>Reservas</Button></Link>
                    <Button variant="contained" onClick={handleClickOpen}>Nueva Reserva</Button> 
                </Toolbar>
            </AppBar>
            <NuevaReserva open={open} handleClose={() => {handleClose()}}/>
            
        </div>
    );
}
