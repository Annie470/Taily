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
} from "react-bootstrap";
import { loginUser } from "../redux/actions/authActions";
import mk from "../assets/img/mk.png";
import cPlace from "../assets/img/chihuahua.jpg";
import { Eye, EyeSlash } from "react-bootstrap-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const credentials = {
      email,
      password,
    };

    dispatch(loginUser(credentials))
      .then((result) => {
        setIsLoading(false);
        if (result.success) {
          navigate("/home");
        } else {
          setError(result.error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message || "Errore durante il login");
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
              src={cPlace}
              alt="photo upload icon"
              className="placeholder-registration"
            />
            <p className="text-tail mb-3 centered text-center">
              Benvenuto in Taily!
            </p>
            <Form onSubmit={submitLogin}>
              <Form.Group className="mb-3" controlId="loginEmail">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-register"
                  required
                />
              </Form.Group>

              <Form.Group
                className="mb-3 position-relative"
                controlId="loginPassword"
              >
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-register"
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </span>
              </Form.Group>
              <p className="text-center">
                Non sei ancora nella comunity?{" "}
                <a href="/register" className="a-green ">
                  Iscriviti!
                </a>
              </p>

              <Button
                className="green-rounded-btn d-block mx-auto"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Accesso..." : "Accedi"}
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

export default Login;