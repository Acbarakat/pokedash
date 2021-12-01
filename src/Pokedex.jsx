import * as React from "react";
import {Collection, AutoSizer} from 'react-virtualized';
import {
    Modal,
    Carousel,
    Container,
    Row,
    Col,
    Form,
    InputGroup,
    FormControl,
    Badge
} from 'react-bootstrap';
import Typical from 'react-typical';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    defaults
  } from 'chart.js';
  import {
    Bar
  } from 'react-chartjs-2';
import { Icon } from '@iconify/react';
import { pokeapi, types_name, types_chart, PUBLIC_URL } from "./common";
import 'react-virtualized/styles.css'; // only needs to be imported once

defaults.font.family = 'pokemon-font';

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    Title,
    Tooltip
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
            ],
            sprites: {},
            flavor_text: " ",
            types: [
                {type: {name: 'normal'}}
            ]
        };

        this.fetchData = this.fetchData.bind(this);
    }

    fetchData() {
        pokeapi.get(`/pokemon-species/${this.state.name}`)
        .then((response) => {
            let flavor_text = response.data.flavor_text_entries;
            flavor_text = flavor_text.filter((fte)=>fte.language.name === "en");
            flavor_text = flavor_text[Math.floor(Math.random() * flavor_text.length)].flavor_text;
            flavor_text = flavor_text.replaceAll("\n", " ").replaceAll("\f", " ");
            this.setState({flavor_text: flavor_text});
        })
        .catch((error) => {
            console.debug('pokemon-species ERROR: ', error);
            this.setState({flavor_text: "Hmm I seem to be missing notes on this POKEMON."})
        });
    }

    render(){
        let {
            name,
            stats,
            sprites,
            flavor_text,
            types
        } = this.state;

        let data = {
            labels: ['HP', "ATK", "DEF", "SATK", "SDEF", "SPD"],
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
            animateScale: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Base Stats"
                },
                tooltip: {
                    callbacks: {
                        title : () => null,
                        label: function(context) {
                            let {formattedValue, label} = context;
                            let description = '';
                            switch(label){
                                case "HP":
                                    description = "Hit Points";
                                    break;
                                case "ATK":
                                    description = "Attack";
                                    break;
                                case "DEF":
                                    description = "Defense";
                                    break;
                                case "SATK":
                                    description = "Special Attack";
                                    break;
                                case "SDEF":
                                    description = "Special Defense";
                                    break;
                                case "SPD":
                                    description = "Speed";
                                    break;
                                default:
                                    description = "?"
                            };
                            description += " : " + formattedValue;

                            return description;
                        }
                    }
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

        let carouselSprites = [];
        Object.entries(sprites).forEach((data)=>{
            let [key, url] = data;
            if(key.startsWith("front") && url !== null){
                carouselSprites.push((
                    <Carousel.Item key={key}>
                    <img
                      className="pokemon-img"
                      src={url}
                      alt={`${this.state.name} ${key} sprite`}
                    />
                    <Carousel.Caption>
                      <p>({key.replaceAll("_", " ")})</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ));
            }
        });

        let typeIcons = types.map((v)=>{
            let {name} = v.type;
            return (<img key={name} src={`${PUBLIC_URL}\\${name}.png`} alt={`${name} type symbol`} />);
        });

        let weaknessGraphic = types_name.map((typing, idx)=>{
            let type1 = types_name.indexOf(types[0].type.name);
            let type2 = types.length > 1 ? types_name.indexOf(types[1].type.name) : 18;
            let effectiveness = (types_chart[idx][type1] * types_chart[idx][type2]);
            let dmg_type = 'dmg_normal'
            switch(effectiveness){
                case 1:
                    dmg_type = "dmg_normal";
                    break;
                case 0:
                    dmg_type = "dmg_immune";
                    break;
                default:
                    if(effectiveness < 1){dmg_type = "dmg_resist"};
                    if(effectiveness < 0.5){dmg_type = "dmg_resist2"};
                    if(effectiveness > 1){dmg_type= "dmg_weak"};
                    if(effectiveness > 2){dmg_type = "dmg_weak2"};
            }

            return (
                <Col className={dmg_type} key={typing}>
                    <Badge bg={typing}>{typing}</Badge>
                    <br/>
                    <span className="dmg_value">x{effectiveness}</span>
                </Col>
            )
        });

        return (
            <Modal
                contentClassName="pokemodal"
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
                    {typeIcons}
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col xs={12} lg={4}>
                                <Carousel fade variant="dark">
                                    {carouselSprites}
                                </Carousel>
                            </Col>
                            <Col className="pokemon-chart">
                                <Bar data={data} options={options} aria-label="base stats graph" role="img"/>
                            </Col>
                        </Row>
                        <Row className="effectiveness mt-4 justify-content-md-center" xs={2} md="auto">
                            {weaknessGraphic}
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <img src={`${PUBLIC_URL}/prof-oak.png`} id="prof-oak" alt="professor oak" />
                    <Typical
                        steps={[flavor_text]}
                        />
                </Modal.Footer>
            </Modal>
        );
  }
}

class PokedexEntry extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event){
        let data = Object.assign({show: true}, this.state, {flavor_text: " "});
        this.props.modal.current.setState({...data},()=>this.props.modal.current.fetchData());
    }

    componentDidMount() {
        pokeapi.get(`/pokemon/${this.props.name}`)
        .then((response) => {
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
        super(props);
        
        this.state = {
            data: [],
            columnCount: Math.floor(window.innerWidth / (100 + GUTTER)),
            leftOffset: (window.innerWidth % 100) / 2,
        };

        this._cellRenderer = this._cellRenderer.bind(this);
        this._cellSizeAndPositionGetter = this._cellSizeAndPositionGetter.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.handleChange = this.handleChange.bind(this);

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
            // WA to not include the totem pokemon
            results = results.filter((pokemon)=>!pokemon.name.includes("-totem"));
            this.setState({data: results, fullData: results});
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

    handleChange(event) {
        let {value} = event.target;
        let data = this.state.fullData.filter((pokemon)=>pokemon.name.match(value.toLowerCase(), "g"));
        
        // My only way to work around saved <PokedexEntry />
        this.setState({data: []}, ()=>this.setState({data: data}, ()=>this.updateDimensions()));
    }

    render(){
        let navbarHeight = document.getElementsByClassName('navbar');
        navbarHeight = navbarHeight.length !== 0 ? navbarHeight[0].offsetHeight : 0;

        let formHeight = document.getElementsByClassName('pokemon-search-form');
        formHeight = formHeight.length !== 0 ? formHeight[0].offsetHeight : 0;

        return (
            <AutoSizer>
            {({width, height}) => (
                <main>
                    <Form className="pokemon-search-form">
                        <Row className="align-items-center">
                            <Col>
                                <Form.Label htmlFor="inlineFormInputGroup" visuallyHidden>
                                    Search Pokemon
                                </Form.Label>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text>
                                        <Icon icon="ic:twotone-catching-pokemon" width="30" />
                                    </InputGroup.Text>
                                    <FormControl
                                        id="inlineFormInputGroup"
                                        placeholder="Search Pokemon..." 
                                        onChange={this.handleChange}
                                        />
                                </InputGroup>
                            </Col>
                        </Row>
                    </Form>
                    <Collection
                        ref={this.collection}
                        cellCount={this.state.data.length}
                        cellRenderer={this._cellRenderer}
                        cellSizeAndPositionGetter={this._cellSizeAndPositionGetter}
                        className="pokedex"
                        overscanRowCount={1}
                        height={height - navbarHeight - formHeight}
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