import * as React from "react";
import {Collection, AutoSizer} from 'react-virtualized';
import { pokeapi } from "./common";
import 'react-virtualized/styles.css'; // only needs to be imported once

class PokedexEntry extends React.Component {
    componentDidMount() {
        pokeapi.get(`/pokemon/${this.props.name}`)
        .then((response) => {
            // console.log(response.request.fromCache);
            this.setState({...response.data});
        })
        .catch((error) => {
            console.error('There was an ERROR: ', error);
        });
    }

    render(){
        let sprite = this.state !== null ? this.state.sprites.front_default : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.props.id}.png`;
        let type = this.state !== null ? this.state.types : [{slot: 1, type: {name: "normal"}}];
        let type1 = type[0].type.name;
        let type2 = type.length === 2 ? type[1].type.name : type1;

        return (
            <div className={`entry type1-${type1} type2-${type2}`} style={this.props.style}>
                <img src={sprite} alt={`${this.props.name} sprite`} />
            </div>
        );
    }
}

const GUTTER = 20;

class Pokedex extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            data: [],
            columnCount: Math.floor(window.innerWidth / (100 + GUTTER)),
            leftOffset: (window.innerWidth % 100) / 2
        };

        this._cellRenderer = this._cellRenderer.bind(this);
        this._cellSizeAndPositionGetter = this._cellSizeAndPositionGetter.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);

        this.collection = React.createRef();
    }

    updateDimensions() {
        let {columnCount} = this.state;
        let newCount = Math.floor(window.innerWidth / (100 + GUTTER));

        this.setState({
            columnCount: newCount,
            leftOffset: (window.innerWidth % (100+GUTTER)) / 2
        },() => {
            console.log("Changed from", columnCount, "to", newCount);
            this.collection.current.recomputeCellSizesAndPositions();
        });
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);

        pokeapi.get("/pokemon", {params: {limit: 9999}})
        .then(async (response) => {
            let { results } = response.data;
            results.forEach((pokemon) => {
                pokemon.id = parseInt(pokemon.url.split("/")[6]);
                /*if (pokemon.id < 10000){
                    return (<PokedexEntry key={pokemon.id} {...pokemon}/>);
                }
                return null;*/
            });
            this.setState({data: results});
        })
        .catch((error) => {
          console.error('There was an ERROR: ', error);
        });
    }

    _cellRenderer({index, key, style}){
        let pokemon = this.state.data[index];

        return (<PokedexEntry key={key} style={style} {...pokemon}/>);
    }

    _cellSizeAndPositionGetter({index}) {
        let {columnCount, leftOffset} = this.state;
        let y = Math.floor(index / columnCount);
        y = (100 * y) + (GUTTER * (y + 1));
        let x  = (index % columnCount);
        x = (100 * x) + (GUTTER * x);
        x += leftOffset - GUTTER > 0 ? leftOffset : GUTTER;

        return {
            height: 100,
            width: 100,
            x: x,
            y: y,
          };
    }

    render(){
        let navbarHeight = document.getElementsByClassName('navbar');
        navbarHeight = navbarHeight.length !== 0 ? navbarHeight[0].offsetHeight : 0;

        return (
            <AutoSizer>
            {({width, height}) => (
                <main>
                    <Collection
                        ref={this.collection}
                        cellCount={this.state.data.length}
                        cellRenderer={this._cellRenderer}
                        cellSizeAndPositionGetter={this._cellSizeAndPositionGetter}
                        className="pokedex"
                        height={height - navbarHeight}
                        width={width}
                    />
                </main>
            )}
          </AutoSizer>
        )
    }
}

export default Pokedex;