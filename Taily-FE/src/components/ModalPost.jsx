import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProvince, fetchComuni } from "../redux/actions/locationActions.js";
import { createPost } from "../redux/actions/postActions";
import { Toast } from "react-bootstrap";

const ModalPost = ({ show, onClose, onPostCreated }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { province, comuni } = useSelector((state) => state.location);

  const [formPayload, setFormPayload] = useState({
    street: "",
    date: "",
    codiceIstat: "",
    note: "",
    allowedDogSex: "",
    allowedDogSize: "",
    allowedDogAge: "",
  });

  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [selectedComune, setSelectedComune] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (show && token) {
      dispatch(fetchProvince(token));
    }
  }, [show, token, dispatch]);

  useEffect(() => {
    if (selectedProvincia && token) {
      dispatch(fetchComuni(token, selectedProvincia));
      setSelectedComune("");
      setFormPayload((prev) => ({ ...prev, codiceIstat: "" }));
    }
  }, [selectedProvincia, token, dispatch]);

  const setForm = (e) => {
    const { name, value } = e.target;
    setFormPayload((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormPayload({
      street: "",
      date: "",
      codiceIstat: "",
      note: "",
      allowedDogSex: "",
      allowedDogSize: "",
      allowedDogAge: "",
    });
    setSelectedProvincia("");
    setSelectedComune("");
  };

  const subProvincia = (e) => {
    setSelectedProvincia(e.target.value);
  };

  const subComune = (e) => {
    const selectedCodiceIstat = e.target.value;
    setSelectedComune(selectedCodiceIstat);
    setFormPayload((prev) => ({
      ...prev,
      codiceIstat: selectedCodiceIstat,
    }));
  };

  const subCreatePost = (e) => {
    e.preventDefault();

    const postPayload = {
      street: formPayload.street,
      date: formPayload.date,
      codiceIstat: formPayload.codiceIstat,
      note: formPayload.note || null,
      allowedDogSex: formPayload.allowedDogSex || null,
      allowedDogSize: formPayload.allowedDogSize || null,
      allowedDogAge: formPayload.allowedDogAge || null,
    };
    console.log("Payload inviato:", postPayload);
    dispatch(createPost(token, postPayload))
      .then((result) => {
        if (result.success) {
          console.log("Post creato con successo");
          resetForm();
          onPostCreated();
          onClose();
        } else {
          setToastMessage(
            <>
     <ul>
        <li>Compila con attenzione i campi obbligatori *</li>
        <li>Data permessa solo presente o futura</li>
        <li>Ricorda di inserire un indirizzo valido</li>
        <li>Nelle note puoi specificare ove fosse un luogo privato indicazioni più specifiche</li>
     </ul>
     <p className="text-muted">Se il problema persiste ti preghiamo di segnalare il bug all'email taily.app.info@gmail.com!</p> 
    </>
          );
          setShowToast(true);
        }
      })
      .catch(() => {
        setShowToast(true);
      });
  };

  const subClose = () => {
    resetForm();
    onClose();
  };

  const subDropdown = (fieldName) => (eventKey) => {
  setFormPayload((prev) => ({
    ...prev,
    [fieldName]: eventKey,
  }));
};


  return (
    <>
    <Modal show={show} onHide={subClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="text-green fw-bold">
          Crea nuovo evento
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="dott">
        <Form onSubmit={subCreatePost}>
          <Form.Group className="mb-3">
            <Form.Label>Giorno e ora *</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={formPayload.date}
              onChange={setForm}
              className="input-register"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Indirizzo *</Form.Label>
            <Form.Control
              type="text"
              name="street"
              value={formPayload.street}
              onChange={setForm}
              required
              placeholder="Via, numero civico"
              className="input-register"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Provincia *</Form.Label>
            <Form.Select
              value={selectedProvincia}
              onChange={subProvincia}
              className="input-register-drop"
              required>
              <option value="">Seleziona una provincia</option>
              {province.map((prov) => (
                <option key={prov.siglaProvincia} value={prov.siglaProvincia}>
                  {prov.denominazioneProvincia}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Comune *</Form.Label>
            <Form.Select
              value={selectedComune}
              onChange={subComune}
              disabled={!selectedProvincia}
              className="input-register-drop"
              required>
              <option value="">Seleziona un comune</option>
              {comuni.map((comune) => (
                <option key={comune.codiceIstat} value={comune.codiceIstat}>
                  {comune.denominazioneIta}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Note</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="note"
              value={formPayload.note}
              onChange={setForm}
              placeholder="Aggiungi dettagli sull'evento..."
              className="input-register"
            />
          </Form.Group>

  <Form.Group controlId="sex">
  <Form.Label>Sesso cani ammessi</Form.Label>
  <Dropdown onSelect={subDropdown('allowedDogSex')}>
    <Dropdown.Toggle
      variant="outline-secondary"
      className="input-register-drop w-100 text-start">
      {formPayload.allowedDogSex 
        ? (formPayload.allowedDogSex === "MALE" ? "Maschio" : "Femmina") 
        : "Entrambi"}
    </Dropdown.Toggle>

    <Dropdown.Menu className="w-100 dropdown-menu-rounded">
      <Dropdown.Item eventKey="">Entrambi</Dropdown.Item>
      <Dropdown.Item eventKey="MALE">Maschio</Dropdown.Item>
      <Dropdown.Item eventKey="FEMALE">Femmina</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</Form.Group>

         <Form.Group controlId="size">
  <Form.Label>Taglia cani ammessi</Form.Label>
  <Dropdown onSelect={subDropdown('allowedDogSize')}>
    <Dropdown.Toggle
      variant="outline-secondary"
      className="input-register-drop w-100 text-start">
      {formPayload.allowedDogSize 
        ? (formPayload.allowedDogSize === "SMALL" 
            ? "Piccola" 
            : formPayload.allowedDogSize === "MEDIUM" 
              ? "Media" 
              : formPayload.allowedDogSize === "LARGE"
                ? "Grande"
                  : formPayload.allowedDogSize === "SMALL_AND_MEDIUM"
                    ? "Piccola e Media"
                    : formPayload.allowedDogSize === "MEDIUM_AND_LARGE"
                      ? "Media e Grande"
                      : "Qualsiasi") 
        : "Qualsiasi"}
    </Dropdown.Toggle>

    <Dropdown.Menu className="w-100 dropdown-menu-rounded">
      <Dropdown.Item eventKey="">Tutte</Dropdown.Item>
      <Dropdown.Item eventKey="SMALL">Piccola</Dropdown.Item>
      <Dropdown.Item eventKey="MEDIUM">Media</Dropdown.Item>
      <Dropdown.Item eventKey="LARGE">Grande</Dropdown.Item>
      <Dropdown.Item eventKey="SMALL_AND_MEDIUM">Piccola e Media</Dropdown.Item>
      <Dropdown.Item eventKey="MEDIUM_AND_LARGE">Media e Grande</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</Form.Group>
         <Form.Group controlId="age">
  <Form.Label>Età cani ammessi</Form.Label>
  <Dropdown  onSelect={subDropdown('allowedDogAge')}>
    <Dropdown.Toggle
      variant="outline-secondary"
      className="input-register-drop w-100 text-start">
      {formPayload.allowedDogAge 
        ? (formPayload.allowedDogAge === "JUNIOR" 
            ? "Junior" 
            : formPayload.allowedDogAge === "ADULT" 
              ? "Adulto" 
              : "Senior") 
        : "Qualsiasi"}
    </Dropdown.Toggle>

    <Dropdown.Menu className="w-100 dropdown-menu-rounded">
      <Dropdown.Item eventKey="">Tutte</Dropdown.Item>
      <Dropdown.Item eventKey="JUNIOR">Junior</Dropdown.Item>
      <Dropdown.Item eventKey="ADULT">Adulto</Dropdown.Item>
      <Dropdown.Item eventKey="SENIOR">Senior</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
</Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="dott">
        <Button className="green-rounded-btn centered mt-2 mb-3" onClick={subCreatePost}>
          Crea evento
        </Button>
      </Modal.Footer>
    </Modal>


     <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        delay={5000} 
        autohide
        style={{
          position: 'fixed',
           top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
          zIndex: 9999
        }}>
        <Toast.Header>
          <strong className="me-auto text-orange fs-4">Impossibile creare evento!</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      </>
  );
};

export default ModalPost;
