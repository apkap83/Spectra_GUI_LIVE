import { useContext } from "react";
import UserContext from "../../contexts/UserContext";
import { PERMISSION } from "./../../roles/permissions";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

import config from "../../config";
// const { appTitle } = Conf;

// MUI Icons
import BorderOuterIcon from "@mui/icons-material/BorderOuter";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import TimelineIcon from "@mui/icons-material/Timeline";
import RawOnIcon from "@mui/icons-material/RawOn";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import AutoModeOutlinedIcon from "@mui/icons-material/AutoModeOutlined";

export function MyHeader() {
  const userDetails = useContext(UserContext);
  const isUserAdmin =
    userDetails && userDetails.roles.includes(PERMISSION.USER_CAN_MANAGE_USERS);

  return (
    <>
      {userDetails && (
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/" className="navBar__brand">
              {config.appTitle}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                {isUserAdmin ? (
                  <Nav.Link
                    as={Link}
                    className="navBar__link"
                    to="/user_management"
                  >
                    User Management
                  </Nav.Link>
                ) : (
                  ""
                )}

                <NavDropdown
                  className="navBar__link"
                  title="Nova"
                  id="collasible-nav-dropdown"
                >
                  <LinkContainer to="/nova/allspectraincidents">
                    <NavDropdown.Item>All Incidents</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/nova/openspectraincidents">
                    <NavDropdown.Item>Open Incidents</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/nova/adhocoutages">
                    <NavDropdown.Item>Ad Hoc Outages</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/nova/stats">
                    <NavDropdown.Item>Stats</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>

                <NavDropdown
                  className="navBar__link"
                  title="Wind"
                  id="collasible-nav-dropdown"
                >
                  <LinkContainer to="/wind/allspectraincidents">
                    <NavDropdown.Item style={{ fontSize: "38px" }}>
                      All Incidents
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/wind/openspectraincidents">
                    <NavDropdown.Item>Open Incidents</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/wind/adhocoutages">
                    <NavDropdown.Item>Ad Hoc Outages</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/wind/stats">
                    <NavDropdown.Item>Stats</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>

                <NavDropdown
                  className="navBar__link"
                  title="CDR"
                  id="collasible-nav-dropdown"
                >
                  <LinkContainer to="/cdr-db/openincidents">
                    <NavDropdown.Item>
                      <BorderOuterIcon />
                      &nbsp;Open DSLAM Outages
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/cdr-db/closedincidents">
                    <NavDropdown.Item>
                      <HistoryToggleOffIcon />
                      &nbsp;Closed DSLAM Outages
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>

                <NavDropdown
                  className="navBar__link"
                  title="Graphs"
                  id="collasible-nav-dropdown"
                >
                  <LinkContainer to="/graphs/aaa-outagesplus-remedy">
                    <NavDropdown.Item
                      style={{
                        padding: "0.5rem 0.5rem",
                      }}
                    >
                      <TimelineIcon />
                      &nbsp;AAA Outages + Remedy
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/graphs/aaa-outages-rawdata">
                    <NavDropdown.Item
                      style={{
                        padding: "0.5rem 0.5rem",
                      }}
                    >
                      <TextSnippetOutlinedIcon />
                      &nbsp;AAA Raw Data
                    </NavDropdown.Item>
                  </LinkContainer>

                  {isUserAdmin ? (
                    <LinkContainer to="/graphs/openai_functions">
                      <NavDropdown.Item
                        style={{
                          padding: "0.5rem 0.5rem",
                        }}
                      >
                        <AutoModeOutlinedIcon />
                        &nbsp;Open AI Functions
                      </NavDropdown.Item>
                    </LinkContainer>
                  ) : (
                    ""
                  )}
                </NavDropdown>
              </Nav>

              <Nav>
                <Nav.Link as={Link} to="/logout" className="navBar__link">
                  Log Out &mdash; {userDetails?.username}
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
}
