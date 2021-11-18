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
            <Navbar className="flex-column justify-content-around side_menu" expand="lg" bg="dark" variant="dark"> 
                <Navbar.Brand className="m-auto">
                    ICON HERE
                </Navbar.Brand>
                <Nav fill className="m-auto mt-0 w-100 flex-column align-items-start">
                    <Nav.Item>
                        <Nav.Link href="/party">Party Planner</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/pokedex">Pokedex</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/trainers">Developers</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/news">News</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/information">Information</Nav.Link>
                    </Nav.Item>
                </Nav>
                <form className="m-auto">
                    <div>
                    <button className="btn btn-outline-secondary" type="submit">S</button>
                    <input className="form-control search_input" type="search" placeholder="Search" />
                    </div>
                </form>
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
