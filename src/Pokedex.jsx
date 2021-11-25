import * as React from "react";
import {Collection, AutoSizer} from 'react-virtualized';
import {Modal, Button} from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Back
  } from 'chart.js';
  import {
    Bar
  } from 'react-chartjs-2';
import { pokeapi } from "./common";
import 'react-virtualized/styles.css'; // only needs to be imported once

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    Title
);

class PokeModal extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            show: false,
            name: "Unknown",
            stats: [
                {base_stat: 10},
                {base_stat: 10},
                {base_stat: 10},
                {base_stat: 10},
                {base_stat: 10},
                {base_stat: 10}
            ]
        };
    }

    render(){
        let {
            name,
            stats
        } = this.state;
        let data = {
            labels: ['HP', "Attack", "Defense", "Special Attack", "Special Defense", "Speed"],
            datasets: [{
                data: stats.map((v)=>v.base_stat),
                backgroundColor: [
                    "rgba(255,0,0,0.5)",
                    "rgba(245,172,120,0.75)",
                    "rgba(250,224,120,0.75)",
                    "rgba(157,183,245,0.75)",
                    "rgba(167,219,141,0.75)",
                    "rgba(250,146,178,0.75)",
                ],
            }]
        };
        let options ={
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Base Stats"
                }
            },
            scales: {
                x: {
                    max: 255,
                    min: 0,
                    type: 'linear'
                }
            }
        };
        console.log(this.state);
        console.log(data);
        return (
            <Modal
                className="pokemodal"
                show={this.state.show}
                onHide={()=>this.setState({show: false})}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    {name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Centered Modal</h4>
                    <p>
                    Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
                    dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                    </p>
                    <Bar data={data} options={options} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={()=>this.setState({show: false})}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
  }
}

class PokedexEntry extends React.Component {
    constructor(props) {
        super(props)

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(event){
        let data = Object.assign({show: true}, this.state);
        this.props.modal.current.setState({...data});
    }

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
            <div
                className={`entry type1-${type1} type2-${type2}`}
                style={this.props.style}
                onClick={this.handleClick}
                >
                <img src={sprite} alt={`${this.props.name} sprite`} />
            </div>
        );
    }
}

const GUTTER = 15;

class Pokedex extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            data: [],
            columnCount: Math.floor(window.innerWidth / (100 + GUTTER)),
            leftOffset: (window.innerWidth % 100) / 2,
        };

        this._cellRenderer = this._cellRenderer.bind(this);
        this._cellSizeAndPositionGetter = this._cellSizeAndPositionGetter.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);

        this.collection = React.createRef();
        this.modal = React.createRef();
    }

    updateDimensions() {
        let {columnCount} = this.state;
        let newCount = Math.floor(window.innerWidth / (100 + GUTTER));

        this.setState({
            columnCount: newCount,
            leftOffset: (window.innerWidth % (100+GUTTER)) / 2
        },() => {
            console.debug("Changed from", columnCount, "to", newCount);
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
            });
            // results = results.filter((pokemon)=>pokemon.id < 10000);
            this.setState({data: results});
        })
        .catch((error) => {
          console.error('There was an ERROR: ', error);
        });
    }

    _cellRenderer({index, key, style}){
        let pokemon = this.state.data[index];

        return (<PokedexEntry key={key} style={style} modal={this.modal} {...pokemon}/>);
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
                    <PokeModal
                        ref={this.modal}
                        />
                </main>
            )}
          </AutoSizer>
        )
    }
}

export default Pokedex;