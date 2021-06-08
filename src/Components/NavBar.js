import {useState} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
} from '@material-ui/core';
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
                    Restp
                    </Typography>
                    <Button variant="contained" onClick={handleClickOpenPlan} style={{marginRight:"20px"}}>Plano del restaurante</Button>
                    <Button variant="contained" onClick={handleClickOpen}>Nueva Reserva</Button> 
                </Toolbar>
            </AppBar>
            <NuevaReserva open={open} handleClose={() => {handleClose()}}/>
            <Plan open ={openPlan} handleClose={()=>{handleClosePlan()}}/>
        </div>
    );
}
