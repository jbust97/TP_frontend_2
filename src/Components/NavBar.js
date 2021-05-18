import {useState} from 'react';
import axios from 'axios';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
} from '@material-ui/core';
import NuevaReserva from './NuevaReserva'

export default function NavBar(){
    const [open,setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                    Restop
                    </Typography>
                    <Button variant="contained" onClick={handleClickOpen}>Nueva Reserva</Button> 
                </Toolbar>
            </AppBar>
            <NuevaReserva open={open} handleClose={() => {handleClose()}}/>
        </div>
    );
}
