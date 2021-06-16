import {useState,useEffect} from 'react';
import React from 'react';
import axios from 'axios';
import {useParams,Redirect} from 'react-router-dom'; 
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions} from "@material-ui/core";
import {InputLabel,Card,CardContent,Typography,Select,MenuItem,TextField} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Consumo from './Consumo';

const date_format = (date_string) => {
    let  date = new Date(date_string);
    return  ("00" + date.getDate()).slice(-2) + "/" +
    ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
    date.getFullYear() + " " +
    ("00" + date.getHours()).slice(-2) + ":" +
    ("00" + date.getMinutes()).slice(-2);
}
export default function DetalleConsumo (){
    let { id } = useParams();
    const [openUser,setOpenUser] = useState(false);
    const [openNewUser,setOpenNewUser] = useState(false);
    const [cliente,setCliente] = useState({})
    const [consumo,setConsumo] = useState({cerrado: false});
    const [detalles,setDetalles] = useState([]);
    const [mesa,setMesa] = useState()
    const [mustUpdate,setMustUpdate] = useState(false);
    const [open,setOpen] = useState(false);
    const [detalle,setDetalle] = useState({})
    const [productos,setProductos] = useState([]);
    const [clientes,setClientes] = useState([]);
    const [clientesFlag,setClientesFlag] = useState(0);
    useEffect(()=>{
        axios.get("http://localhost:9090/api/cliente")
        .then(response => setClientes(response.data))
        .catch(console.log)
    },[clientesFlag]);
    const updateMonto = (id,cantidad) => {
        axios.get("http://localhost:9090/api/producto/" + id)
        .then(response => response.data)
        .then(data => setConsumo((prev)=>({
            ...prev,
            total: parseInt(prev.total) + parseInt(data.precio*cantidad)
        }))).catch(console.log)
    }
    const crearDetalle = () => {
        axios.post("http://localhost:9090/api/gestiondetalle",detalle)
        .then(response => {
            if (response.status == 200){
                return updateMonto(detalle.ProductoId,detalle.cantidad);
            } 
        }).catch(err=>console.log(err));

        
    }
    const handleOpen = () => {
        setDetalle({"GestionCabeceraId": consumo.id})
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setDetalle({});
    }
    const handleCloseUser = () =>{
        setOpenNewUser(false);
        setCliente({})
    }
    const crearUsuario = () => {
        setOpenNewUser(false);
        axios.post("http://localhost:9090/api/cliente",cliente)
        .then(response => setClientesFlag(clientesFlag + 1))
        .catch(console.log);
    }

    useEffect(() => {
        axios.get("http://localhost:9090/api/producto")
               .then(response => response.data).then(data => {
                 return setProductos(data)
               }).catch(err => console.log(err));
         },[open]);
    
    const handleChange = (name,value) => {
        setDetalle((prev)=>({
            ...prev,
            [name]: value
        }))
    }
    useEffect(()=>{
        axios.get("http://localhost:9090/api/mesa/" + id)
        .then(response => setMesa(response.data))
        .catch(err => console.log(err));
    },[]);
    useEffect(()=>{
        axios.get("http://localhost:9090/api/mesa/" + id + "/consumo")
        .then(response => {
            if (response.data){
            
                setConsumo(response.data)
                axios.get("http://localhost:9090/api/cliente/" + response.data.ClienteId)
                    .then(response => setConsumo(prev=>(
                        {
                            ...prev,
                            cliente: response.data,
                            ClienteId: response.data.id 
                        }
                    )))
            }else{
                
                axios.post("http://localhost:9090/api/gestioncabecera/", {
                    "cerrado": false,
                    "total": 0,
                    "creacion": new Date(),
                    "MesaId": id
                })
                .then(response => setConsumo(response.data))
                .catch(err=> console.log("Error en: " + err));
            }
        }).then(() => {
            
            }
        )
        .catch(err => {
            
            if(err.response){
                axios.post("http://localhost:9090/api/gestioncabecera/", {
                    "cerrado": false,
                    "total": 0,
                    "creacion": "2021/06/10",
                    "MesaId": id
                })
                .then(response => setConsumo(response.data))
                .catch(err=> console.log("Error2: " + err));
            }
        });
    },[]);
    
    console.log("Cliente: " + consumo.cliente)
    useEffect(()=>{
        if (consumo.id){
            console.log("update al consumo: " + consumo.id)
            axios.get("http://localhost:9090/api/gestiondetalle/consulta",{params: {cabeceraId: consumo.id}})
            .then(response => setDetalles(response.data)).catch(err=>console.log(err));
            
            axios.put("http://localhost:9090/api/gestioncabecera/" + consumo.id, consumo)
            .then(()=>{
                if (consumo.cerrado){ 
                    axios({
                        url: "http://localhost:9090/api/gestioncabecera/" + consumo.id + "/ticket",
                        method: 'GET',
                        responseType: 'blob', // important
                    }).then((response) => {
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'file.pdf');
                        document.body.appendChild(link);
                        link.click();
                    }).catch(err=>console.log(err))
                }
            }).
            catch(err=> {console.log("Error al actualizar: " + err); console.log(consumo)}); 
        }
    },[consumo])  
    
    const cerrarConsumo = async () => {
        setConsumo((prev)=>({
            ...prev,
            cerrado: true,
            cierre: new Date()
        }));
        console.log("Aca recibo un pdf")
        
    }
    
    return (
        <React.Fragment>
        {
            ! consumo?.cerrado ?
            <div>
             <Paper style={{marginTop: "50px",marginLeft:"100px",marginRight:"100px",padding: "50px"}}>      
            Número de mesa: {mesa?.numero}<br/>
            Nombre del cliente: <br/><br/>{consumo?.cliente ? consumo?.cliente?.nombre + " " + consumo?.cliente?.apellido : " -"}<Button onClick={()=>setOpenUser(true)} style={{marginLeft: "10px"}}variant="contained" color="primary">Seleccionar Cliente</Button><Button onClick={()=>setOpenNewUser(true)} style={{marginLeft: "10px"}}variant="contained" color="primary">Nuevo Cliente</Button><br/><br/>
            Fecha de creacion: {date_format(consumo?.creacion)}<br/>
            Total: Gs. {consumo?.total}<br/> 
            
            {
                
                detalles.map((detalle)=>{
                    return (
                        <div>
                            <br/>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {detalle.producto?.nombre}
                                </Typography>
                                <Typography color="textSecondary">
                                    {"Cantidad: " + detalle.cantidad}
                                 </Typography>
                                 <Typography color="textSecondary">
                                    {"Total: " + parseInt(detalle.producto?.precio)*parseInt(detalle.cantidad)}  
                                 </Typography>
                            </CardContent>
                          
                        </Card>
                        
                        </div>
                    );

                })
            }
            
            <br/>
            <Button variant="contained" style={{marginRight: "20px"}} onClick = {cerrarConsumo}>Cerrar Consumo</Button>
            <Button variant="contained" color = "primary" onClick={()=>handleOpen()}>Agregar Detalle</Button>
            </Paper>
            <Dialog open = {open} onClose={handleClose}>
            <DialogTitle>
                Nuevo Detalle
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Seleccione el producto y la cantidad.
                </DialogContentText>
                <InputLabel htmlFor="productoX">Producto</InputLabel>
                <Select
                    autofocus
                    fullWidth
                    labelId="xid_concepto"
                    inputProps={{
                        name: 'producto',
                        id: 'productoX',
                    }}
                    value={detalle.producto}
                    onChange={(event) => handleChange("ProductoId",event.target.value)}
                >
                    {
                        productos.map((producto)=>(
                            <MenuItem value={producto.id}>{producto.nombre}</MenuItem>   
                        ))
                    }
                </Select>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Cantidad"
                    type="number"
                    fullWidth
                    value={detalle.cantidad}
                    onChange={(event) => handleChange("cantidad",event.target.value)}   
                />     
                </DialogContent>
            <DialogActions>
                <Button  onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button  color="primary" onClick = {() => {
                    crearDetalle();
                    handleClose();
                }}>
                    Crear Detalle
                </Button>
            </DialogActions>
        </Dialog> 
        <Dialog open = {openUser} onClose={()=>setOpenUser(false)}>
            <DialogTitle>
                Seleccionar Cliente
            </DialogTitle>
            <DialogContent>
            <Autocomplete
                id="combo-box-demo"
                options={clientes}
                getOptionLabel={(option) => option.nombre + " " + option.apellido + " - " + option.cedula}
                style={{ width: 300 }}
                value = {consumo.cliente}
                onChange = {(event,newValue) => {
                    console.log( "El nuevo valor es: ")
                    console.log(newValue)
                    setConsumo((prev)=>({
                        ...prev,
                        cliente: newValue,
                        ClienteId: newValue?.id
                    }))
                }}
                renderInput={(params) => <TextField {...params} label="Clientes" variant="outlined" />}
                />         
            </DialogContent>    
        </Dialog> 
        <Dialog open = {openNewUser} onClose={handleCloseUser}>
                        <DialogTitle>
                            Nuevo Cliente
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Para crear una reserva necesitamos los datos del cliente.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Número de Cedula"
                                type="email"
                                fullWidth
                                value={cliente.cedula}
                                onChange={(event) => {
                                    let nuevo_cliente = {
                                        nombre: cliente.nombre,
                                        apellido: cliente.apellido,
                                        cedula: event.target.value,
                                    }
                                    setCliente(nuevo_cliente);
                                }}
                                
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Nombre"
                                type="text"
                                fullWidth
                                value = {cliente.nombre}
                                onChange={(event) => {
                                    let nuevo_cliente = {
                                        nombre: event.target.value,
                                        apellido: cliente.apellido,
                                        cedula: cliente.cedula,
                                    }
                                    setCliente(nuevo_cliente);
                                }}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Apellido"
                                type="text"
                                fullWidth
                                value = {cliente.apellido}
                                onChange={(event) => {
                                    let nuevo_cliente = {
                                        nombre: cliente.nombre,
                                        apellido: event.target.value,
                                        cedula: cliente.cedula,
                                    }
                                    setCliente(nuevo_cliente);
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseUser} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={crearUsuario} color="primary">
                                Crear Cliente
                            </Button>
                        </DialogActions>
                    </Dialog>

        </div>  
            :
            <Redirect to="/consumo" />
        }
        </React.Fragment>
    );
} 