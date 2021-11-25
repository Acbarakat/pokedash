import * as React from "react";
import { Card } from "react-bootstrap";
import { pokeapi } from "./common";

class PokedexEntry extends React.Component {
    componentDidMount() {
        pokeapi.get(`/pokemon/${this.props.name}`)
        .then(async (response) => {
            console.log(response.request.fromCache);
            this.setState({...response.data});
        })
        .catch((error) => {
            console.error('There was an ERROR: ', error);
        });
    }

    render(){
        let sprite = this.state !== null ? this.state.sprites.front_default : "/pokeball.png";

        return (
            <Card>
                <Card.Img variant="top" src={sprite} />
                {this.props.name}
            </Card>
        );
    }
}

class Pokedex extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        pokeapi.get("/pokemon", {params: {limit: 9999}})
        .then(async (response) => {
            let { results } = response.data;
            this.setState({data: results});
        })
        .catch((error) => {
          console.error('There was an ERROR: ', error);
        });
    }

    render(){
        let pokemons = this.state.data.map((pokemon) => {
            pokemon.id = parseInt(pokemon.url.split("/")[6]);
            if (pokemon.id < 10000){
                return (<PokedexEntry key={pokemon.id} {...pokemon}/>);
            }
            return null;
        })

        return (
            <div className="pokedex">
                {pokemons}
            </div>
        )
    }
}

export default Pokedex;