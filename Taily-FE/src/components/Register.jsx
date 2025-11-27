import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Dropdown,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { registerUser } from "../redux/actions/authActions";
import pPlace from "../assets/img/dogsun.jpg";
import mk from "../assets/img/mk.png";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dogName, setDogName] = useState("");
  const [sex, setSex] = useState("");
  const [size, setSize] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveForm = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const newDogOwner = {
      username,
      email,
      password,
      dogName,
      sex,
      size,
      age,
      bio: bio || undefined,
    };

    dispatch(registerUser(newDogOwner))
      .then((result) => {
        setIsLoading(false);
        if (result.success) {
          navigate("/");
        } else {
          setError(result.error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || "Errore durante la registrazione");
      });
  };

  return (
    <>
      <Container fluid className="bg-orange vh-100">
        <Row className="vh-100 justify-content-center align-items-end align-items-lg-center justify-content-lg-start ">
          <Col lg={4} className="d-none d-lg-block p-0 text-center ms-5 ">
            <img src={mk} alt="Logo" className="w-100" />
            <p className="text-tail">Prova anche l'app!</p>
          </Col>

          <Col xs={12} md={10} lg={7} className="bg-white main-col">
            <img
              src={pPlace}
              alt="photo upload icon"
              className="placeholder-registration"
            />

            <Form onSubmit={saveForm} className="mt-3 position-relative">
              <a href="/" className="arrow">
                {"\u21A9"}
              </a>
              <Form.Group controlId="username">
                <Form.Control
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="input-register"
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-register"
                />
              </Form.Group>

              <Form.Group
                controlId="formBasicPassword"
                className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-register"
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye /> : <EyeSlash />}
                </span>
              </Form.Group>

              <Form.Group controlId="dogName">
                <Form.Control
                  type="text"
                  placeholder="Nome cucciolo"
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  required
                  className="input-register"
                />
              </Form.Group>
              
              <Form.Group controlId="sex">
                <Dropdown onSelect={(eventKey) => setSex(eventKey)}>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    className="input-register-drop w-100 text-start">
                    {sex ? (sex === "MALE" ? "Maschio" : "Femmina") : "Sesso"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100 dropdown-menu-rounded">
                    <Dropdown.Item eventKey="MALE">Maschio</Dropdown.Item>
                    <Dropdown.Item eventKey="FEMALE">Femmina</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Form.Group controlId="size">
                <Dropdown onSelect={(eventKey) => setSize(eventKey)}>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    className="input-register-drop w-100 text-start">
                    {size
                      ? size === "SMALL"
                        ? "Piccola"
                        : size === "MEDIUM"
                        ? "Media"
                        : size === "LARGE"
                        ? "Grande"
                        : "Gigante"
                      : "Taglia"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100 dropdown-menu-rounded">
                    <Dropdown.Item eventKey="SMALL">Piccola</Dropdown.Item>
                    <Dropdown.Item eventKey="MEDIUM">Media</Dropdown.Item>
                    <Dropdown.Item eventKey="LARGE">Grande</Dropdown.Item>
                    <Dropdown.Item eventKey="GIANT">Gigante</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Form.Group controlId="age">
                <Dropdown onSelect={(eventKey) => setAge(eventKey)}>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    className="input-register-drop w-100 text-start">
                    {age
                      ? age === "JUNIOR"
                        ? "Cucciolo"
                        : age === "ADULT"
                        ? "Adulto"
                        : "Senior"
                      : "Età"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="w-100 dropdown-menu-rounded">
                    <Dropdown.Item eventKey="JUNIOR">Cucciolo</Dropdown.Item>
                    <Dropdown.Item eventKey="ADULT">Adulto</Dropdown.Item>
                    <Dropdown.Item eventKey="SENIOR">Senior</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>

              <Form.Group controlId="bio">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Razza, giochi preferiti, interessi..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="input-register"
                />
              </Form.Group>

              <Form.Group controlId="terms-checkbox">
                <Form.Check
                  type="checkbox"
                  label={
                    <span>
                      Comprendo e accetto i{" "}
                      <a href="/conditions" className="a-green">
                        Termini e Condizioni
                      </a>
                    </span>
                  }
                  className="custom-checkbox"
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                disabled={isLoading}
                className="green-rounded-btn centered mt-3">
                {isLoading ? "Registrazione..." : "Salva"}
              </Button>
            </Form>

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;
