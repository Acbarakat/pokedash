import * as React from "react";
import ReactCardFlip from 'react-card-flip';
import {
    Card,
    Container,
    Row,
    Col
} from 'react-bootstrap';
import {githubapi, PUBLIC_URL} from "./common";

class PokeFlipCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFlipped: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    }

    render(){
        let gifUrl = this.props.shiny === true ? "https://play.pokemonshowdown.com/sprites/ani-shiny/" : "https://play.pokemonshowdown.com/sprites/ani/";
        gifUrl += `${this.props.name}.gif`;
        let displayName = this.props.name.replace("-mega", " (Mega)").replace("-gmax", " (GMAX)");
        let frontElem = (<br/>);
        if(this.props.gmax === true){
            frontElem = (<img src={`${PUBLIC_URL}/gmax.png`} alt="GMAX symbol"/>);
        }else if(this.props.mega === true){
            frontElem = (<img src={`${PUBLIC_URL}/mega.png`} alt="MEGA stone"/>);
        }else{
            let imgUrl = ""
            switch (displayName){
                case "urshifu":
                    imgUrl = "20161209233033%21Dream_Choice_Band_Sprite.png";
                    break;
                case "reshiram":
                    imgUrl = "Dream_Dragon_Fang_Sprite.png";
                    break;
                case "espeon":
                    imgUrl = "Dream_Eevium_Z_Sprite.png";
                    break;
                case "grimmsnarl":
                    imgUrl = "Dream_Light_Clay_Sprite.png";
                    break;
                default:
                    break;
            }
            frontElem = (<img src={`${PUBLIC_URL}/${imgUrl}`} alt="an item"/>);
        }

        return(
        <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal">
            <Card onClick={this.handleClick} className="card-front">
                {frontElem}
            </Card>
    
            <Card onClick={this.handleClick} className="card-back" id={this.props.name}>
                <img src={gifUrl} alt={`${displayName} animated`}/>
                <h2>{displayName}</h2>
            </Card>
        </ReactCardFlip>
        );
    }
}
class Trainers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar_url: 'https://avatars.githubusercontent.com/u/1971886?v=4',
            description: 'This is a Pokémon Dashboard for my CS410 class.',
            html_url: "https://github.com/Acbarakat/pokedash",
            username: "Acbarakat",
            user_html_url: "https://github.com/Acbarakat",
            blog: "https://linktr.ee/thatbearkat"
        };
    }

    componentDidMount() {
        githubapi.get(`users/Acbarakat`)
        .then(async (response) => {
            let {data} = response;

            this.setState({
                username: data.login,
                user_html_url: data.html_url,
                avatar_url: data.avatar_url
            });
        })
        .catch((error) => 
            console.error('There was an ERROR: ', error)
        );

        githubapi.get(`repos/Acbarakat/pokedash`)
        .then(async (response) => {
            let {data} = response;

            this.setState({
                description: data.description,
                html_url: data.html_url
            });
        })
        .catch((error) => 
            console.error('There was an ERROR: ', error)
        );
    }


    render(){
        let {
            avatar_url,
            description,
            html_url,
            user_html_url,
            username,
            blog
        } = this.state;

        return (
            <main className="developer">
                <Container className="me">
                    <Row>
                        <Col xs={4} md={4}>
                            <img src={avatar_url} alt="developer" />
                            <h1><a href={user_html_url}>@{username}</a></h1>
                        </Col>
                        <Col>
                            <span>{description}</span>
                            <span>This project can also be found on <a href={html_url}>GitHub</a>.</span>
                            <span>You can also check out my other projecs <a href={blog}>here</a>.</span>
                            <span>Flip the cards below to reveal my favorite team of 6!</span>
                        </Col>
                    </Row>
                </Container>
                <Container className="favorites">
                    <Row>
                        <Col sm={12} md={4} xl={2}><PokeFlipCard name="ampharos-mega" mega/></Col>
                        <Col sm={12} md={4} xl={2}><PokeFlipCard name="grimmsnarl" shiny/></Col>
                        <Col sm={12} md={4} xl={2}><PokeFlipCard name="espeon" shiny/></Col>
                        <Col sm={12} md={4} xl={2}><PokeFlipCard name="urshifu" /></Col>
                        <Col sm={12} md={4} xl={2}><PokeFlipCard name="corviknight-gmax" shiny gmax/></Col>
                        <Col sm={12} md={4} xl={2}><PokeFlipCard name="reshiram" shiny/></Col>
                    </Row>
                </Container>
            </main>
          );
    }
}

export default Trainers;