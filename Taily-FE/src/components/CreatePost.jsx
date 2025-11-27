import { Container, Row, Col,  Button } from "react-bootstrap";
import { useSelector, useDispatch} from "react-redux";
import { useState, useEffect } from "react";
import pin from "../assets/img/LogoPin.png";
import pattern from "../assets/img/svg/pattern.svg";
import { fetchUserPosts, deletePost, removeGuest } from "../redux/actions/postActions";
import CardPost from "./CardPost";
import {Trash } from "react-bootstrap-icons";
import ModalPost from "./ModalPost";


const CreatePost = ( )=> {
    const dispatch = useDispatch();
    const { city } = useSelector((state) => state.location);
    const { userPosts } = useSelector((state) => state.post);
    const { token } = useSelector((state) => state.auth);
    const { data: currentProfile } = useSelector((state) => state.profile);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
    if (token) {
      dispatch(fetchUserPosts(token));
    }
  }, [dispatch, token]);

   const subDelete = (post) => {
    const isAuthor = post.author.id === currentProfile?.id;
    if (isAuthor) {
      dispatch(deletePost(token, post.id))
        .then((result) => {
           if (result.success) {
                        dispatch(fetchUserPosts(token));
                    } else {
                        alert("Errore nell'eliminazione: " + result.error);
                    }
                })
        .catch((error) => {
          alert("Errore nell'eliminazione del post:", error);
        });
    } else {
      dispatch(removeGuest(token, post.id))
        .then((result) => {
         if (result.success) {
                        dispatch(fetchUserPosts(token));
                    } else {
                        alert("Errore nella rimozione: " + result.error);
                    }
                })
        .catch((error) => {
          alert("Errore nella rimozione dalla lista partecipanti:", error);
        });
    }
  };

   const subShowModal = () => setShowModal(true);
   const subCloseModal = () => setShowModal(false);

    return (
      <>
        <Container fluid className="d-flex flex-column">
          <Row className="w-100 d-flex justify-content-center justify-content-lg-end p-0 m-0">
            <Col
              xs={12}
              lg={3}
              className="d-flex justify-content-center align-items-center my-2">
              <img src={pin} alt="icon pin location" className="icon-pin" />
              <span className="text-orange fw-bold align-self-end fs-4">
                {" "}
                {city || "Caricamento..."}
              </span>
            </Col>
          </Row>

          <Row
            className="mt-4  rounded-5"
            style={{
              backgroundColor: "#e7e7e7ff",
              backgroundImage: `url(${pattern})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}>
            {" "}
            {/*  quella con il pattern, grigia, fill  */}
            <Col xs={12} className="text-center">
              <Button
                className="light-rounded-btn my-4"
                type="button"
                onClick={subShowModal}>
                Crea nuovo evento
              </Button>
            </Col>
            <Col xs={12}>
              <Row className="dott pt-3 justify-content-center pb-5">
                <Col xs={12} className="text-center mt-2">
                  <p className="text-green fs-3 fw-bold">I tuoi eventi</p>
                </Col>

                {userPosts && userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <Col  xs={12} md={6} lg={3}key={post.id} className="mb-4 position-relative">
                      <CardPost post={post} />
                      <Trash className="trash-icon" onClick={() => subDelete(post)}/>
                    </Col>
                  ))
                ) : (
                  <Col xs={12} className="text-center">
                    <p className="text-muted">
                      Non hai ancora creato alcun evento...
                    </p>
                  </Col>
                )}
              </Row>
            </Col>
          </Row>
        </Container>
        
         <ModalPost 
        show={showModal} 
        onClose={subCloseModal}
        onPostCreated={() => dispatch(fetchUserPosts(token))} 
      />
      </>
    );
}
export default CreatePost