import {React,useEffect,useState} from "react";
import axios from 'axios';
import { Button,Grid, TextField,Select,MenuItem,InputLabel } from "@material-ui/core"; 
import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";


function comparator(a,b){
    const compIni = a.horaInicio - b.horaInicio;
    if (compIni == 0){
        const compFin = a.horaFin - b.horaFin;
        if (compFin == 0)
            return a.mesa - b.mesa
        return compFin;
    }
    return compIni;
}
export default function Reservas() {
    const url = 'http://localhost:9090/api/reserva/consulta';
    const [reservasRaw,setReservasRaw] = useState([]);
    const [restauranteId,setRestauranteId] = useState();
    const [fecha,setFecha] = useState();
    const [clienteId,setClienteId] = useState();
    const [restaurantes,setRestaurantes] = useState([]);
    const [clientes,setClientes] = useState([])
    useEffect(() => {
        axios.get("http://localhost:9090/api/restaurante")
               .then(response => response.data).then(data => {
                 
                 return setRestaurantes(data)
               }).catch(err => console.log(err));
        axios.get("http://localhost:9090/api/cliente")
               .then(response => response.data).then(data => {
                 return setClientes(data)
               }).catch(err => console.log(err));
         },[]);
    const buscarReservas = ()=> {    
        if (clienteId == null){
            axios.get(url, {params: {RestauranteId: restauranteId,fecha: fecha}})
                .then(response => response.data)
                .then(data => setReservasRaw(data))
                .catch(err => console.log(err));  
        }else{
            axios.get(url, {params: {RestauranteId: restauranteId,fecha: fecha,ClienteId: clienteId}})
                .then(response => response.data)
                .then(data => setReservasRaw(data))
                .catch(err => console.log(err));  
        }  
    };
    const columns = [
        {field: 'restaurante', headerName: 'Restaurante', width: 200},
        {field: 'mesa', headerName: 'Mesa', width: 200},
        {field: 'hora', headerName: 'Horario', width: 200},
        {field: 'fecha', headerName: 'Fecha', width: 200},
        {field: 'cliente', headerName: 'Cliente', width: 200},
        {field: 'cedula', headerName: 'Cedula', width: 200},  
    ];
    
    const rows = reservasRaw.map((r) => {
        
        r.restaurante = r.Restaurante.nombre
        r.cedula = r.Cliente.cedula
        r.cliente = r.Cliente.nombre + " " +  r.Cliente.apellido
        r.mesa = r.Mesa.numero
        r.hora = r.horaInicio + ':00 - ' + r.horaFin + ':00'
        return r;
    });
    rows.sort(comparator);
    const  data = {columns,rows};
    console.log(data);
    return (
    <Grid container>
        <Grid item xs={12}>
        <InputLabel htmlFor="restaurante">Seleccione un restaurante</InputLabel>
        <Select
            autofocus
            fullWidth
            labelId="xid_concepto"
            inputProps={{
                name: 'age',
                id: 'restaurante',
                }}
            value={restauranteId}
            onChange={(event) => setRestauranteId(event.target.value)}
        >
            {
                restaurantes.map((restaurante)=>(
                    <MenuItem value={restaurante.id}>{restaurante.nombre}</MenuItem>   
                ))
            }
        </Select>
        </Grid>
        <Grid item  xs={12}>
            <TextField
                margin="dense"
                id="name"
                label="Fecha de la reserva"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                DefaultValue = {fecha}
                onChange={(event) => setFecha(event.target.value)}
            />
        </Grid>
        <Grid item xs={12}>
        <InputLabel htmlFor="cliente">Seleccione un cliente</InputLabel>
        <Select           
            autofocus
            fullWidth
            labelId="xid_concepto"
            inputProps={{
                name: 'age',
                id: 'cliente',
                }}
            value={clienteId}
            onChange={(event) => setClienteId(event.target.value)}
        >   
            <MenuItem value={null}>Ninguno</MenuItem>
            {
                clientes.map((cliente)=>(
                    <MenuItem value={cliente.id}>{cliente.nombre + " " +  cliente.apellido + " - " + cliente.cedula}</MenuItem>   
                ))
            }   
        </Select>
       
        </Grid>
       
        <Grid item xs = {1} style={{margin: "auto", marginTop: "20px"}}>
            <Button variant = "contained" color = "primary" onClick={buscarReservas}>Ver Reservas</Button>
        </Grid>
        
        <Grid item xs={12} style = { {marginTop: "20px"}}>
            <div style={{ height: 400, width: "100%"}}>
                <DataGrid
                {...data}
                columns={data.columns.map((column) => ({
                    ...column,
                    disableColumnMenu: true,
                    sortable: false,
                }))}
                />
            </div>
        </Grid>
    </Grid>
    );
}