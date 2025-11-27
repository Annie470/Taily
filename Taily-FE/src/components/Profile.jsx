import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Form,
  Dropdown,
  Alert,
} from "react-bootstrap";
import pattern from "../assets/img/svg/pattern.svg";
import camera from "../assets/img/svg/camera.svg"
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/actions/authActions";
import { useState, useRef} from "react";
import { updateProfile, updatePassword,  uploadAvatar } from "../redux/actions/profileActions";
import {Trash } from "react-bootstrap-icons";
import { deleteProfile} from "../redux/actions/profileActions";
import { Power } from 'react-bootstrap-icons';


const Profile = () => {
  const { data: profile } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(true);
  const [mod, setMod] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dogName, setDogName] = useState("");
  const [sex, setSex] = useState("");
  const [size, setSize] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const file = useRef(null);

  const subLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const subSave = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const profileToSend = {
      username: username || profile.username,
      email: email || profile.email,
      dogName: dogName || profile.dogName,
      sex: sex || profile.sex,
      size: size || profile.size,
      age: age || profile.age,
      bio: bio || profile.bio,
    };

    dispatch(updateProfile(token, profileToSend)).then((result) => {
      setIsLoading(false);

      if (result.success) {
        setEdit(true);
        setMod(false);
      } else {
        setError(result.error || "Errore durante l'aggiornamento");
      }
    });
  };

  const subPassword = (e) => {
    e.preventDefault();
    setIsLoadingPassword(true);
    setPasswordError("");

    const passwordToSend = {
      password: newPassword,
    };

    dispatch(updatePassword(token, passwordToSend)).then((result) => {
      setIsLoadingPassword(false);
      if (result.success) {
        setNewPassword("");
      } else {
        setPasswordError(result.error);
      }
    });
  };
 
const subUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dispatch(uploadAvatar(token, profile.id, file)).then((result) => {
      if(result.error) {
        alert(result.error);
      }   else {
      window.location.reload();
    } 
    });
  };

 const subClick = () => {
    file.current.click();
  };
  
  const subDelete = () => {
  if (window.confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.")) {
    dispatch(deleteProfile(token)).then((result) => {
      if (result.success) {
        navigate("/");
      } else {
        alert(result.error || "Errore durante l'eliminazione");
      }
    });
  }
};


  if (!profile) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
        </Spinner>
      </Container>
    );
  }

  return (
    <>
      <Container fluid className="p-0 d-flex flex-column align-items-center pb-5 pb-lg-0 bg-orange"style={{
            backgroundImage: `url(${pattern})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}>
        <Row
          className=" w-100 d-flex justify-content-center p-0  "
          >
          <Col xs={8} lg={2} className="text-center p-5 position-relative">
            <img
              src={profile.avatar}
              alt="photo profile"
              className="photo-main-profile w-100"
            />
            <img src={camera} alt="photo upload icon" className="camera-upload" onClick={subClick} />
             <input
                  type="file"
                  ref={file}
                  onChange={subUpload}
                  accept="image/jpeg,image/jpg,image/png"
                  className="d-none"
                />
          </Col>
           </Row>

<Row className="d-flex flex-column align-items-center p-0  bg-white rounded-top-5 w-100 ">

 <Col xs={12} className=" pt-3 pb-5 position-relative">     
            {/** questo è il wrapper  */} 
             <Button onClick={subLogout}  className="logout">
               <Power />
            </Button>
            <Form onSubmit={subSave}>
              <Row className="d-flex justify-content-around p-0 w-100 g-0 ">
                <Col xs={11} lg={4} className="pt-3">
                  <p className="text-green fs-3 fw-bold">Info personali</p>

                  <Form.Group className="mb-3 text-start" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={profile.username}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-register"
                      required
                      disabled={edit}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 text-start" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={profile.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-register"
                      required
                      disabled={edit}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3 text-start" controlId="bio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      type="textarea"
                      rows={2}
                      placeholder={profile.bio || "..."}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="input-register"
                      required
                      disabled={edit}
                    />
                  </Form.Group>
                </Col>

                <Col xs={11} lg={4} className="pt-3">
                  <p className="text-green fs-3 fw-bold">Info Cane</p>
                  <Form.Group className="mb-3 text-start" controlId="dogName">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={profile.dogName}
                      value={dogName}
                      onChange={(e) => setDogName(e.target.value)}
                      className="input-register"
                      required
                      disabled={edit}
                    />
                  </Form.Group>

                  <Form.Group controlId="age" className="text-start">
                    <Form.Label>Età</Form.Label>
                    <Dropdown onSelect={(eventKey) => setAge(eventKey)}>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        className="input-register-drop w-100 text-start"
                        disabled={edit}>
                        {age
                          ? age === "JUNIOR"
                            ? "Cucciolo"
                            : age === "ADULT"
                            ? "Adulto"
                            : "Senior"
                          : profile.age}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="w-100 dropdown-menu-rounded">
                        <Dropdown.Item eventKey="JUNIOR">
                          Cucciolo
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="ADULT">Adulto</Dropdown.Item>
                        <Dropdown.Item eventKey="SENIOR">Senior</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>

                  <Form.Group controlId="size" className="text-start">
                    <Form.Label>Taglia</Form.Label>
                    <Dropdown onSelect={(eventKey) => setSize(eventKey)}>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        className="input-register-drop w-100 text-start"
                        disabled={edit}>
                        {size
                          ? size === "SMALL"
                            ? "Piccola"
                            : size === "MEDIUM"
                            ? "Media"
                            : size === "LARGE"
                            ? "Grande"
                            : "Gigante"
                          : profile.size}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="w-100 dropdown-menu-rounded">
                        <Dropdown.Item eventKey="SMALL">Piccola</Dropdown.Item>
                        <Dropdown.Item eventKey="MEDIUM">Media</Dropdown.Item>
                        <Dropdown.Item eventKey="LARGE">Grande</Dropdown.Item>
                        <Dropdown.Item eventKey="GIANT">Gigante</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>

                  <Form.Group controlId="sex" className="text-start">
                    <Form.Label>Sesso</Form.Label>
                    <Dropdown onSelect={(eventKey) => setSex(eventKey)}>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        className="input-register-drop w-100 text-start"
                        disabled={edit}>
                        {sex
                          ? sex === "MALE"
                            ? "Maschio"
                            : "Femmina"
                          : profile.sex}
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="w-100 dropdown-menu-rounded">
                        <Dropdown.Item eventKey="MALE">Maschio</Dropdown.Item>
                        <Dropdown.Item eventKey="FEMALE">Femmina</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="d-flex justify-content-center p-0 w-100 g-0">
                <Col xs={11} className="text-center pb-3">
                   {!mod && (
                <Button
                  className="green-rounded-btn mt-3 mx-auto
                  "
                  type="button"
                  onClick={() => {
                    setMod(true);
                    setEdit(false);
                    setUsername(profile.username);
                    setEmail(profile.email);
                    setDogName(profile.dogName);
                    setAge(profile.age);
                    setSize(profile.size);
                    setSex(profile.sex);
                    setBio(profile.bio || "");
                  }}>
                  Modifica
                </Button>
              )}

              {mod && (
                <Button
                  className="green-rounded-btn mt-3 "
                  type="submit"
                  disabled={isLoading}>
                  {isLoading ? "Salvataggio..." : "Salva"}
                </Button>
              )}
                </Col>
              </Row>
           
            </Form>
               {error && (
              <Alert variant="danger" className="mx-3 mt-3">
                {error}
              </Alert>
            )}
          </Col> 
              
<Col xs={12}  className="d-flex flex-column align-items-center p-2  pb-5">
<Form onSubmit={subPassword} className="dott pt-4 w-100">
   <Row className="d-flex justify-content-around  g-0">
                <Col xs={11} lg={4} className="pt-3">
                <p className="text-green fs-5 fw-bold m-0 p-0">Modifica Password</p>
                <Form.Group
                    className="mb-3 text-start"
                    controlId="newPassword">
                    <Form.Label>Nuova Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Inserisci nuova password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-register"
                      required
                    />
                    <Form.Text className="text-muted">
                      Minimo 8 caratteri, 1 maiuscola e 2 numeri
                    </Form.Text>
                  </Form.Group>
                </Col>
                </Row>
                   <Row className="d-flex justify-content-center p-0 w-100 g-0">
                    <Col xs={12} className="text-center pb-3">
                    <Button
                    className="green-rounded-btn"
                    type="submit"
                    disabled={isLoadingPassword}>
                    {isLoadingPassword ? "Salvataggio..." : "Salva"}
                  </Button>
                    </Col>
                   </Row>                
                </Form>
                {passwordError && (
                  <Alert variant="danger">{passwordError}</Alert>
                )}
              </Col>
 <Col xs={12} className=" d-flex align-items-center justify-content-end p-3 pe-5">
 <span onClick={() => subDelete()} className="text-decoration-underline trash-profile">Elimina account </span>
 <Trash className="trash-profile" onClick={() => subDelete()}/>
 </Col>
         </Row> 
           
      </Container>
    </>
  );
};
export default Profile;
