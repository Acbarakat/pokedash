import React from "react";
import {
    BrowserRouter,
    Switch,
    Route,
} from "react-router-dom";
import {
    Navbar,
    Nav,
    Container
} from "react-bootstrap";
import { Icon } from '@iconify/react';
import Pokedex from './Pokedex';
import Pokenews from './Pokenews';
import Trainers from './Trainers'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  return (
        <BrowserRouter>
            <Navbar expand="lg" bg="pokemon"> 
                <Container>
                    <Nav fill className="m-auto w-100 ">
                        <Nav.Item>
                            <Nav.Link href="pokenews"><Icon icon="mdi:pokemon-go" width="40"/><br/>PokeNews</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="pokedex"><Icon icon="ic:twotone-catching-pokemon" width="40" /><br/>Pokedex</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="trainers"><Icon icon="fa-solid:id-badge" width="30"/><br/> Trainer/Developer</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>
            <Switch>
                <Route path="/pokedex">
                    <Pokedex />
                </Route>
                <Route path="/pokenews">
                    <Pokenews />
                </Route>
                <Route path="/trainers">
                    <Trainers />
                </Route>
                <Route path="/">
                    <Pokenews />
                </Route>
            </Switch>
        </BrowserRouter>
  );
}

export default App;
