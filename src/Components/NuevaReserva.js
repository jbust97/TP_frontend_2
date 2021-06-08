import {useEffect, useState} from 'react';
import axios from 'axios';
import {
    MenuItem,
    Button,
    DialogActions,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
    TextField,
    Select,
    InputLabel,
    Checkbox,
    FormControlLabel,
    RadioGroup,
    Radio
} from '@material-ui/core';
import { MonochromePhotosSharp } from '@material-ui/icons';
export default function NuevaReserva(props){
    const [cliente,setCliente] = useState({cedula: "", nombre: "", apellido: ""})
    const [step,setStep] = useState(0);
    const [restaurantes,setRestaurantes] = useState([]);
    const [reserva,setReserva] = useState({});
    const [mesas,setMesas] = useState([]);
    const [capacidad,setCapacidad] = useState();
    const [horarios,setHorarios] = useState([{inicio:13,fin:14,disponible: true},{inicio:14,fin:15, disponible: true},{inicio:15,fin:16, disponible: false},{inicio:16,fin:17,  disponible: true}]);
    const [checkedHorarios,setCheckedHorarios] = useState(new Set())
    const [mesasFiltradas,setMesasFiltradas] = useState([]);
    const horas = [12,13,14,15,16,17,18,19,20,21,22]
    const onClickContinue = () => {
        axios.get("http://localhost:9090/api/cliente/consulta", {params: {cedula: cliente.cedula}})
        .then(response => response.data)
        .then(data => {
            console.log("datos = " + data);
            setCliente(data)
            handleChange("ClienteId",data.id)
            setStep(2)
        }).catch(err => {
            console.log("Error: " + err);
            if (err.response.status == 404){
                setStep(1);
            }
            
        });
    };
    const handleChange = (field, value) => setReserva((prev) => ({ ...prev, [field]: value }));
    const onClickCrear = () => {
        setStep(2);
        axios.post("http://localhost:9090/api/cliente",cliente)
        .then(response => handleChange("ClienteId",response.data.id))
        .catch(err => console.log(err));    
    }
    const cancelar = () => {
        setStep(0);
        setCheckedHorarios(new Set())
        setCliente({cedula: "", nombre: "", apellido: ""});
        setReserva({}); 
        props.handleClose();

    }
    useEffect(() => {
        const disponibilidad = []
        horas.forEach((hora)=>{
            const franja = {inicio: hora, fin: hora + 1, disponible: false}
            mesas.forEach((mesa)=>{
                
                if (mesa.disponibilidad[hora]){
                    franja.disponible = true;               
                }
            }); 
            disponibilidad.push(franja)
        });
        
        setHorarios(disponibilidad)
    },[mesas]);
  	useEffect(() => {
        axios.get("http://localhost:9090/api/restaurante")
               .then(response => response.data).then(data => {
                 
                 return setRestaurantes(data)
               }).catch(err => console.log(err));
         },step);
    const onClickElegirHorario = () => {
        
   
        axios.get("http://localhost:9090/api/restaurante/" + reserva.RestauranteId + "/horario",{params: {capacidad: capacidad,fecha: reserva.fecha}}).then(response => {
            console.log(response.data);
            setMesas(response.data);
        }).catch(err => console.log(err));

        setStep(3)
    }
    const onClickElegirMesa = () => {
        let minimo = 25;
        let maximo = 0;
        checkedHorarios.forEach((horario)=>{
            
            minimo = Math.min(horarios[horario].inicio,minimo)
            maximo = Math.max(horarios[horario].fin,maximo)
        })
        handleChange("horaInicio",minimo)
        handleChange("horaFin",maximo)
        const nuevasMesas = mesas.filter((mesa)=>{
            let disponible = true;
            for(let i = 0; i < maximo-minimo; i++){
                const hora = minimo + i;
                if (!mesa.disponibilidad[hora])
                    disponible = false;
            }
            return disponible;
        })
        setMesasFiltradas(nuevasMesas)
        setStep(4);
    };
    const onClickNuevaReserva = () => {
        axios.post("http://localhost:9090/api/reserva",reserva).catch(err=>console.log(err));
        console.log(reserva)
        cancelar()
    }
    switch(step){
        case 0:
            return (
                <div>
                    <Dialog open = {props.open} onClose={props.onClose}>
                        <DialogTitle>
                            Nueva Reserva
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Para crear una reserva se necesita el numero de cedula del cliente.
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
                                        nombre: "",
                                        apellido: "",
                                        cedula: event.target.value
                                    }
                                    setCliente(nuevo_cliente);
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={cancelar} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={onClickContinue} color="primary">
                                Continuar   
                            </Button>
                        </DialogActions>
                    </Dialog>            
                </div>
            );
        case 1:
            return (
                <div>
                    <Dialog open = {props.open} onClose={props.onClose}>
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
                                InputProps={{
                                    readOnly: true,
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
                            <Button onClick={cancelar} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={onClickCrear} color="primary">
                                Crear Cliente
                            </Button>
                        </DialogActions>
                    </Dialog>            
                </div>
            );
       case 2:
           console.log(reserva)
           return(
            <div>
                <Dialog open = {props.open} onClose={props.onClose}>
                        <DialogTitle>
                            Nueva Reserva
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Seleccione el restaurante, la cantidad de personas a atender y la fecha de la reserva.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Número de Cedula"
                                type="email"
                                fullWidth
                                value={cliente.cedula}
                                InputProps={{
                                    readOnly: true,
                                }}
                                
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Nombre"
                                type="text"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                value = {cliente.nombre}
                                
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Apellido"
                                type="text"
                                fullWidth
                                value = {cliente.apellido}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                             <InputLabel htmlFor="restaurante">Seleccione un restaurante</InputLabel>
                            <Select
                                autofocus
                                fullWidth
                                labelId="xid_concepto"
                                inputProps={{
                                    name: 'age',
                                    id: 'restaurante',
                                  }}
                                value={reserva.RestauranteId}
                                onChange={(event) => handleChange("RestauranteId",event.target.value)}
                            >
                                    {
                                        restaurantes.map((restaurante)=>(
        	                                <MenuItem value={restaurante.id}>{restaurante.nombre}</MenuItem>   
        	                            ))
                                    }
                            </Select>
                            <TextField
                                
                                margin="dense"
                                id="number"
                                label="Cantidad de personas"
                                type="number"
                                fullWidth
                                value = {capacidad}
                                onChange={(event) => setCapacidad(event.target.value)}
                                />
                                  
                             <TextField
                                margin="dense"
                                id="name"
                                label="Fecha de la reserva"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                DefaultValue = {reserva.fecha}
                                onChange={(event) => handleChange("fecha",event.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={cancelar} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={onClickElegirHorario} color="primary">
                                Elegir horario
                            </Button>
                        </DialogActions>
                    </Dialog>       
            </div>

           );
        case 3:
            return (
                <div>
                <Dialog open = {props.open} onClose={props.onClose}>
                        <DialogTitle>
                            Nueva Reserva
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                De la lista de horas disponibles para la reserva. Seleccione horas contiguas.
                            </DialogContentText>
                            {
                              horarios.map((horario,index) => (
                                <div><FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedHorarios.has(index)}
                                        onChange={(event) => {
                                            const newChecked = new Set(checkedHorarios)
                                            if (event.target.checked)
                                                newChecked.add(index);
                                            else
                                                newChecked.delete(index);
                                            setCheckedHorarios(newChecked);
                                        }}
                                        name="checkedB"
                                        color="primary"
                                        disabled={!(horario.disponible && (checkedHorarios.size == 0 || checkedHorarios.has(index-1) || checkedHorarios.has(index) || checkedHorarios.has(index+1)))}
                                        />
                                }
                                label={horario.inicio + " - " + horario.fin}
                                />
                                <br/>
                                </div>
                                ))
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={cancelar} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={onClickElegirMesa} color="primary">
                                Elegir mesa
                            </Button>
                        </DialogActions>
                    </Dialog>       
            </div>

            );
        case 4:
            return (
                <div>
                <Dialog open = {props.open} onClose={props.onClose}>
                        <DialogTitle>
                            Nueva Reserva
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                               Seleccione una mesa
                            </DialogContentText>
                            <RadioGroup value={reserva.MesaId} onChange={event => handleChange("MesaId",event.target.value)}>
                            {
                                mesasFiltradas.map((mesa) => (
                                    <FormControlLabel value={mesa.id} control={<Radio />} label={"número de mesa: " + mesa.numero + " Capacidad: " + mesa.capacidad} />
                                ))
                            }
                            </RadioGroup>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={cancelar} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={onClickNuevaReserva} color="primary">
                                Crear Reserva
                            </Button>
                        </DialogActions>
                    </Dialog>       
            </div>
            );
    }
        
}