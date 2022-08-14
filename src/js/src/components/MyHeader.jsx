import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
// import * as Conf from "../config.json";
import { LinkContainer } from "react-router-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";

// const { appTitle } = Conf;

function MyHeader() {
  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Spectra Test</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/allspectraincidents">
                <Nav.Link>All Incidents</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/openspectraincidents">
                <Nav.Link>Open Incidents</Nav.Link>
              </LinkContainer>
              <NavDropdown title="CDR-DB" id="collasible-nav-dropdown">
                <LinkContainer to="/opencdrdbincidents">
                  <NavDropdown.Item>Open Issues</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/closedcdrdbincidents">
                  <NavDropdown.Item>Closed Issues</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <LinkContainer to="/adhocoutages">
                <Nav.Link>AdHoc Outages</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/stats">
                <Nav.Link>Stats</Nav.Link>
              </LinkContainer>
            </Nav>

            <Nav>
              <Nav.Link eventKey={2} href="/logout">
                Log Out
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

function ExtraBar() {
  const location = useLocation();
  let myStyle = { display: "none", opacity: "0" };

  if (location.pathname === "/openspectraincidents") {
    myStyle = { display: "block", opacity: "100", transition: "all 2.2s" };
  }

  return (
    <div className="row">
      <div className="col-6 bg-light"></div>
      <div
        className="col-6 d-flex justify-content-end align-items-center bg-light"
        style={myStyle}
      >
        <div className="p-1 d-inline-block">
          <input type="checkbox" name="hidescheduled" id="hidescheduled" />
          <label htmlFor="hidescheduled" style={{ marginLeft: "15px" }}>
            Hide Scheduled
          </label>
        </div>
        <div className="p-1 d-inline-block">
          <input
            type="text"
            name="search"
            placeholder="Search by Incident ID"
          />
        </div>
      </div>
    </div>
  );
}

export default MyHeader;
