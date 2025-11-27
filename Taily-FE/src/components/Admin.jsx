import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import pattern from "../assets/img/svg/pattern.svg";
import {
  registerChairman,
  searchUserByEmail,
  deleteUser,
  deleteExpiredPosts,
} from "../redux/actions/adminActions";
import { Eye, EyeSlash, Trash } from "react-bootstrap-icons";
import { logout } from "../redux/actions/authActions";
import { useNavigate } from "react-router-dom";
import { Power } from 'react-bootstrap-icons';

const Admin = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const searchedUser = useSelector((state) => state.admin.searchedUser);
  const [searchError, setSearchError] = useState(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDeletingPosts, setIsDeletingPosts] = useState(false);
  const [deletePostsError, setDeletePostsError] = useState(null);

  const saveForm = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const newChairman = {
      email,
      password,
      fullName,
    };
    dispatch(registerChairman(token, newChairman)).then((result) => {
      setIsLoading(false);
      if (result.success) {
        setEmail("");
        setPassword("");
        setFullName("");
        alert("Chairman registrato con successo");
      } else {
        setError(
          result.error || "Errore durante l'inserimento in DB del Chairman"
        );
      }
    });
  };

  const searchUser = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError(null);
    dispatch(searchUserByEmail(token, searchEmail)).then((result) => {
      setIsSearching(false);
      if (!result.success) {
        setSearchError(result.error || "User o Chairman non trovato");
      }
    });
  };

  const subDelete = () => {
    setIsDeleting(true);
    setIsSearching(true);
    setSearchError(null);
    dispatch(deleteUser(token, searchedUser.id)).then((result) => {
      setIsDeleting(false);
      setIsSearching(false);
      if (result.success) {
        setSearchEmail("");
        alert("Eliminato con successo");
      } else {
        setSearchError(result.error || "Errore durante l'eliminazione");
      }
    });
  };

  const subDeletePosts = () => {
    setIsDeletingPosts(true);
    setDeletePostsError(null);
    dispatch(deleteExpiredPosts(token)).then((result) => {
      setIsDeletingPosts(false);
      if (result.success) {
        alert("Post scaduti eliminati con successo");
      } else {
        setDeletePostsError(result.error || "Errore durante l'eliminazione");
      }
    });
  };

  const subLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <Container
        fluid
        className="p-0 d-flex flex-column align-items-center pb-5 pb-lg-0 bg-orange min-vh-100"
        style={{
          backgroundImage: `url(${pattern})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}>
        <Row className="g-0">
          <Col xs={12} className="py-2 text-center">
            <h1 className="text-tail my-5">Pannello di controllo Admin</h1>
          </Col>
        </Row>
        <Row className="d-flex justify-content-around bg-white rounded-top-5 w-100 flex-fill p-2 ">
          <Col xs={12} lg={4} className="p-4">
            <h3 className="text-green fw-bold mb-4">Registra nuovo Chairman</h3>
            <Form onSubmit={saveForm}>
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Nome Completo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Inserisci nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-register"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-register"
                  required
                />
              </Form.Group>

              <Form.Group
                className="mb-3 position-relative"
                controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Inserisci password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-register"
                  required
                />
                <Form.Text className="text-muted">
                  Minimo 8 caratteri, 1 maiuscola e 2 numeri
                </Form.Text>
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye /> : <EyeSlash />}
                </span>
              </Form.Group>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              <div className="text-center mt-4">
                <Button
                  className="green-rounded-btn"
                  type="submit"
                  disabled={isLoading}>
                  {isLoading ? "Registrazione..." : "Registra Chairman"}
                </Button>
              </div>
            </Form>
          </Col>

          <Col xs={12} lg={4} className="p-4">
            <h3 className="text-green fw-bold mb-3">Cerca ed Elimina</h3>
            <Form onSubmit={searchUser}>
              <Form.Group className="mb-3">
                <Form.Label>Email </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Inserisci email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="input-register"
                  required
                />
              </Form.Group>

              {searchError && (
                <Alert variant="danger" className="mb-3">
                  {searchError}
                </Alert>
              )}

              <div className="text-center mt-4">
                <Button
                  className="green-rounded-btn"
                  type="submit"
                  disabled={isSearching}>
                  {isSearching ? "Ricerca..." : "Cerca"}
                </Button>
              </div>
            </Form>

            {searchedUser && (
              <>
                <Form className="mt-4">
                  <Form.Group className="mb-3">
                    <Form.Label>{searchedUser.email}</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={
                        searchedUser.role === "CHAIRMAN"
                          ? searchedUser.fullName
                          : searchedUser.username
                      }
                      className="input-register"
                      disabled
                    />
                  </Form.Group>
                </Form>
                <div className="text-center mt-4">
                  <Button
                    className="green-rounded-btn"
                    onClick={subDelete}
                    disabled={isDeleting}>
                    <Trash className="me-2" />
                    {isDeleting ? "Eliminazione..." : "Elimina"}
                  </Button>
                </div>
              </>
            )}

            <div className="text-center mt-5">
              <h3 className="text-green fw-bold mb-3 d-block text-start ">
                Elimina post scaduti
              </h3>
              <p className="m-0 mb-4 p-0 text-start">
                Premendo RESET tutti i post precedenti alla data di oggi
                verranno eliminati
              </p>
              <Button
                className="green-rounded-btn"
                onClick={subDeletePosts}
                disabled={isDeletingPosts}>
                {isDeletingPosts ? "Eliminazione in corso..." : "Reset"}
              </Button>

              {deletePostsError && (
                <Alert variant="danger" className="mb-3">
                  {deletePostsError}
                </Alert>
              )}
            </div>
          </Col>
          <Col xs={12} className="text-center dott">
            {" "}
            <Button onClick={subLogout} className="green-rounded-btn mt-4 mb-4">
              <Power />
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Admin;
