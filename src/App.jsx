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
import Pokedex from './Pokedex';
import Party from './Party';
import Trainers from './Trainers'
import Welcome from './Welcome';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  return (
        <BrowserRouter>
            <Navbar expand="lg" bg="dark" variant="dark" fixed="top"> 
                <Container>
                    <Navbar.Brand className="m-auto">ICON HERE</Navbar.Brand>
                    <Nav fill className="m-auto w-100 ">
                        <Nav.Item>
                            <Nav.Link href="/pokedex">Pokedex</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/party">Party Planner</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/trainers">Trainers/Developers</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>
            <Switch>
                <Route path="/pokedex">
                    <Pokedex />
                </Route>
                <Route path="/party">
                    <Party />
                </Route>
                <Route path="/trainers">
                    <Trainers />
                </Route>
                <Route path="/">
                    <Welcome />
                </Route>
            </Switch>
        </BrowserRouter>
  );
}

export default App;
