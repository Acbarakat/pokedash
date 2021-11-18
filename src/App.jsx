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
import Logo from './images/pokemon_logo.png';


function App() {
  return (
        <BrowserRouter>
            {/* <Navbar className="flex-column justify-content-around side_menu" expand="lg" bg="dark" variant="dark">  */}
            <Navbar className="menu_bar" expand="lg" bg="dark" variant="dark"> 
                <Navbar.Brand className="m-auto">
                    <img class="menu_logo_icon" />
                    <img src={Logo} className="logo_img" alt="Pokemon Catch-Em-All Logo" />
                </Navbar.Brand>
                <Nav className="m-auto mt-0 w-100 flex-column align-items-start">
                    <Nav.Item>
                        <Nav.Link href="/party">
                            <img class="menu_icon"  />
                            <span className="menu_text">Party Planner</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/pokedex">
                            <img class="menu_icon" />
                            <span className="menu_text">Pokedex</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/trainers">
                            <img class="menu_icon"  />
                            <span className="menu_text">Developers</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/news">
                            <img class="menu_icon" />
                            <span className="menu_text">News</span>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/information">
                            <img class="menu_icon" />
                            <span className="menu_text">Information</span>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <img class="menu_search_icon" />
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
