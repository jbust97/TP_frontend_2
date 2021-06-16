import {useState,useEffect} from 'react';
import axios from 'axios';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {Link} from 'react-router-dom';
const RestauranteBarra = (props)=>{
    const [open,setOpen] = useState(false);
    const [mesas,setMesas] = useState(null);

    const handleClick = () => {
        setOpen((prev)=>{
            return !prev;
        });
        
    }
    useEffect(()=>{
        if(!mesas){
            axios.get("http://localhost:9090/api/restaurante/" + props.restaurante.id + "/mesas")
            .then(response => setMesas(response.data))
            .catch(err => console.log(err));
        }
    },[open]);
    return (
        <div>
            <ListItem button onClick={handleClick} style={{backgroundColor: "#39a6a3"}}>
                            <ListItemText primary={props.restaurante.nombre} />
                            {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {
            mesas ?
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                    {mesas.map((mesa)=>{
                        return (
                            <ListItem button>
                                <Link to={"consumo/" + mesa.id} ><ListItemText primary={"Número: " + mesa.numero } /></Link>
                            </ListItem>
                        )
                    })}
                    </List>
                </Collapse>
                :
                <Collapse in={open} timeout="auto" unmountOnExit>
                    No hay mesas para mostrar.
                </Collapse>
                
            }

            </div>
    );
}
export default function Consumo (){
    const [restaurantes,setRestaurantes] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:9090/api/restaurante")
               .then(response => response.data).then(data => {
                 return setRestaurantes(data)
               }).catch(err => console.log(err));           
    },[]);
    return (
        <div>
            <List>
            {
                restaurantes.map((restaurante)=> {
                    return (
                        <RestauranteBarra restaurante={restaurante}/>
                    )
                })
                
            }
        </List>
        </div>
    );

}
