import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { PERMISSION } from "./../../roles/permissions";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { useLocation } from "react-router-dom";

import config from "../../config.json";
// const { appTitle } = Conf;

// MUI Icons
import BorderOuterIcon from "@mui/icons-material/BorderOuter";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";

function MyHeader() {
  const userDetails = useContext(UserContext);
  const isUserAdmin =
    userDetails && userDetails.roles.includes(PERMISSION.USER_CAN_MANAGE_USERS);
  console.log("isUserAdmin", isUserAdmin);
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand
            href="/"
            style={{
              fontFamily: "Nunito, sans-serif",
              letterSpacing: 1.5,
            }}
          >
            {config.appTitle}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {isUserAdmin ? (
                <Nav.Link href="/user_management">User Management</Nav.Link>
              ) : (
                ""
              )}

              <NavDropdown title="WIND" id="collasible-nav-dropdown">
                <LinkContainer to="/allspectraincidents">
                  <NavDropdown.Item>All Spectra Incidents</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/openspectraincidents">
                  <NavDropdown.Item>Open Spectra Incidents</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/adhocoutages">
                  <NavDropdown.Item>Ad Hoc Outages</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/stats">
                  <NavDropdown.Item>Stats</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>

              <NavDropdown title="Nova" id="collasible-nav-dropdown">
                <LinkContainer to="/nova_allspectraincidents">
                  <NavDropdown.Item>All Spectra Incidents</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/nova_openspectraincidents">
                  <NavDropdown.Item>Open Spectra Incidents</NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/nova_adhocoutages">
                  <NavDropdown.Item>Ad Hoc Outages</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/nova_stats">
                  <NavDropdown.Item>Stats</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>

              <NavDropdown title="CDR-DB" id="collasible-nav-dropdown">
                <LinkContainer to="/opencdrdbincidents">
                  <NavDropdown.Item>
                    <BorderOuterIcon />
                    &nbsp;Opened DSLAM Outages
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/closedcdrdbincidents">
                  <NavDropdown.Item>
                    <HistoryToggleOffIcon />
                    &nbsp;Closed DSLAM Outages
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>

            <Nav>
              {userDetails ? (
                <Nav.Link eventKey={2} href="/logout">
                  Log Out &mdash; {userDetails?.username}
                </Nav.Link>
              ) : (
                ""
              )}
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
