import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from "d3";
import {Dialog,DialogActions,DialogTitle,DialogContent,DialogContentText,Button,Select,InputLabel,MenuItem} from '@material-ui/core';
export default function Plan(props){
    const ref = useRef(null)
    const [restaurantes,setRestaurantes] = useState([])
    const [restauranteId,setRestauranteId] = useState([])
    const [step,setStep] = useState(0)
    const [mesas,setMesas] = useState(0)
    const cancelar = ()=>{
        setStep(0);
        props.handleClose();
    }
    const onClickContinue = ()=>{
        axios.get("http://localhost:9090/api/restaurante/" + restauranteId + "/horario",{params: {capacidad: 0,fecha: "2021/08/05"}}).then(response => {
            console.log(response.data);
            setMesas(response.data);
        }).catch(err => console.log(err));

        setStep(1);
    }
  useEffect(()=>{
    axios.get("http://localhost:9090/api/restaurante")
    .then(response => response.data).then(data => {
      return setRestaurantes(data)
    }).catch(err => console.log(err));
  },[])


  switch(step){
    case 0:
        return (
            <Dialog open = {props.open} onClose={props.onClose}>
                <DialogTitle>
                    Plan del restaurante
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Seleccione un restaurante para visualizar su plano.
                    </DialogContentText>       
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelar} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={onClickContinue} color="primary">
                        Ver el plano del restaurante   
                    </Button>
                </DialogActions>    
            </Dialog>     
        );
    case 1:
        let infoText = "Mesa 1 Capacidad 1"
        if (ref.current != null){
            const svg = d3.select(ref.current);
            console.log(svg);
            svg
            .append('circle')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', 20)
            .style('fill', 'green');
        }
        return(
            <Dialog open = {props.open} onClose={props.onClose}>
                <DialogTitle>
                    Plan del restaurante
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                       {infoText}
                    </DialogContentText>       
                <svg ref={ref}></svg>        
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelar} color="primary">
                        Salir
                    </Button>
                </DialogActions>    
            </Dialog>     

        )
    }
}

