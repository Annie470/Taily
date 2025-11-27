import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import iP from "../assets/img/svg/icona-profilo.svg";
import iR from "../assets/img/svg/icona-ricerca.svg";
import iA from "../assets/img/svg/icona-aggiungi.svg";
import iAd from "../assets/img/svg/clipboard.svg";
import bug from "../assets/img/svg/bug.svg";
import LogoPin from "../assets/img/LogoPin.png";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/actions/profileActions";
import { fetchLocationGeo, fetchLocationByIP } from "../redux/actions/locationActions";
import fI from "../assets/img/svg/friends-icon.svg";

const NavbarT = ({ userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
  if (token) {
    dispatch(fetchProfile(token));
  }
  // geo nativa
  dispatch(fetchLocationGeo())
    .catch((error) => {
      console.log(error);
      dispatch(fetchLocationByIP()); //geo fallback
    });
}, [dispatch, token]);

  const clickTo = (path) => {
    navigate(path);
  };

  return (
    <>
      <Container fluid className="d-none d-lg-flex p-0">
        <Navbar
          bg="light"
          className="d-flex shadow-sm w-100 justify-content-between px-5 py-0">
          <Navbar.Brand href="#home" className="d-flex align-items-center p-0">
            <img src={LogoPin} alt="Logo Taily" className="logo-navT me-2" />
            <span className="text-tail-orange">Taily</span>
          </Navbar.Brand>

          <Nav className="ms-auto">
            <Nav.Item
              className={`d-flex align-items-center justify-content-end ${
                location.pathname === "/home" ? "active" : ""
              }`}>
              <img
                onClick={() => clickTo("/home")}
                src={iR}
                alt="icona ricerca"
                className={`icon-navT ${
                  location.pathname === "/home" ? "icon-navT-active" : ""
                }`}
              />
              <span className="ms-2">Ricerca</span>
            </Nav.Item>

            <Nav.Item
              className={`d-flex align-items-center justify-content-end ${
                location.pathname === "/create" ||
                location.pathname === "/report"
                  ? "active"
                  : ""
              }`}>
              <img
                onClick={() =>
                  clickTo(userRole === "USER" ? "/create" : "/report")
                }
                src={userRole === "ADMIN" ? bug : iA}
                alt={userRole === "ADMIN" ? "icona admin report" : "icona crea"}
                className={`icon-navT ${
                  location.pathname === "/create" ||
                  location.pathname === "/report"
                    ? "icon-navT-active"
                    : ""
                }`}
              />
              <span className="ms-2">
                {" "}
                {userRole === "USER" ? "Crea post" : "Bug/Segnalazioni"}
              </span>
            </Nav.Item>

            <Nav.Item
              className={`d-flex align-items-center justify-content-end ${
                location.pathname === "/profile/me" ||
                location.pathname === "/admin"
                  ? "active"
                  : ""
              }`}>
              <img
                onClick={() =>
                  clickTo(userRole === "USER" ? "/profile/me" : "/admin")
                }
                src={userRole === "USER" ? iP : iAd}
                alt={userRole === "USER" ? "icona profilo" : "icona admin"}
                className={`icon-navT ${
                  location.pathname === "/profile/me" ||
                  location.pathname === "/admin"
                    ? "icon-navT-active"
                    : ""
                }`}
              />
              <span className="ms-2">
                {userRole === "USER" ? "Profilo" : "Admin"}
              </span>
            </Nav.Item>

            {userRole === "USER" && (
              <Nav.Item
                className={`d-flex align-items-center justify-content-end ${
                  location.pathname === "/friends" ? "active" : ""
                }`}>
                <img
                  onClick={() => clickTo("/friends")}
                  src={fI}
                  alt="icona friends"
                  className={`icon-navT ${
                    location.pathname === "/friends" ? "icon-navT-active" : ""
                  }`}
                />
                <span className="ms-2">Friends</span>
              </Nav.Item>
            )}
          </Nav>
        </Navbar>
      </Container>

      <Container
        fluid
        className="fixed-bottom bg-white border-top p-0 shadow-sm d-lg-none">
        <Row className="g-0">
          <Col
            className="text-center py-3"
            onClick={() => clickTo("/home")}
            style={{ cursor: "pointer" }}>
            <img
              src={iR}
              alt="icona ricerca"
              className={`navbar-icon ${
                location.pathname === "/home" ? "navbar-icon-active" : ""
              }`}
              style={{ width: "24px", height: "24px" }}
            />
          </Col>

          <Col
            className="text-center py-3"
            onClick={() => clickTo(userRole === "USER" ? "/create" : "/report")}
            style={{ cursor: "pointer" }}>
            <img
              src={userRole === "ADMIN" ? bug : iA}
              alt={userRole === "ADMIN" ? "icona admin report" : "icona crea"}
              className={`navbar-icon ${
                location.pathname === "/create" ||
                location.pathname === "/report"
                  ? "navbar-icon-active"
                  : ""
              }`}
              style={{ width: "24px", height: "24px" }}
            />
          </Col>

          <Col
            className="text-center py-3"
            onClick={() =>
              clickTo(userRole === "USER" ? "/profile/me" : "/admin")
            }
            style={{ cursor: "pointer" }}>
            <img
              src={userRole === "ADMIN" ? iAd : iP}
              alt={userRole === "ADMIN" ? "icona admin" : "icona profilo"}
              className={`navbar-icon ${
                location.pathname === "/profile/me" ||
                location.pathname === "/admin"
                  ? "navbar-icon-active"
                  : ""
              }`}
              style={{ width: "24px", height: "24px" }}
            />
          </Col>

          {userRole === "USER" && (
            <Col
              className="text-center py-3"
              onClick={() => clickTo("/friends")}
              style={{ cursor: "pointer" }}>
              <img
                src={fI}
                alt={"icona friends"}
                className={`navbar-icon ${
                  location.pathname === "/friends" ? "navbar-icon-active" : ""
                }`}
                style={{ width: "24px", height: "24px" }}
              />
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default NavbarT;
