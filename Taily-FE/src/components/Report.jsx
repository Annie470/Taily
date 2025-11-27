import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { PuffLoader } from "react-spinners";
import { Trash, ArrowClockwise } from "react-bootstrap-icons";
import { GeoAltFill } from 'react-bootstrap-icons';
import { fetchReports, deleteReport } from "../redux/actions/reportActions";
import { deletePostByAdmin, findPostById } from "../redux/actions/postActions";

const Report = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [reports, setReports] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(2);

  const [isLoading, setIsLoading] = useState(false);

  const [postId, setPostId] = useState("");
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [foundedPost, setFoundedPost] =useState(null);

  useEffect(() => {
    getReports();
  }, [currentPage]);

  const getReports = () => {
    setIsLoading(true);
    dispatch(fetchReports(token, currentPage, pageSize))
      .then((res) => {
        if (res.success) {
          setReports(res.data.content);
          setTotalPages(res.data.totalPages);
        } else {
          alert(res.error || "Errore nel caricamento delle segnalazioni");
        }
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const subDeleteReport = (reportId) => {
    dispatch(deleteReport(token, reportId))
      .then((result) => {
        if (result.success) {
          getReports();
        } else {
          alert(
            result.error || "Errore durante l'eliminazione della segnalazione"
          );
        }
      })
      .catch((error) => {
        alert(error.message);
      })
  };

  const findPost=(postId) => {
dispatch(findPostById(token, postId))
.then((result) => {
        if (result.success) {
          setFoundedPost(result.data)
        } else {
          alert(
            result.error || "Errore durante l'eliminazione della segnalazione"
          );
        }
      })
      .catch((error) => {
        alert(error.message);
      })
  }

  const subDeletePost = () => {
    setIsDeletingPost(true);
    dispatch(deletePostByAdmin(token, postId))
      .then((res) => {
        if (res.success) {
            getReports();
          setPostId("");
          setFoundedPost(null);
          alert("Post eliminato con successo");
        } else {
          alert(res.error || "Errore durante l'eliminazione del post");
        }
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        setIsDeletingPost(false);
      });
  };

  const dataFormatter = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

    const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const clearPostId =()=> {
setFoundedPost(null);
setPostId("");
  }

  return (
    <Container
      fluid
      className="p-0 d-flex flex-column align-items-center pb-5 pb-lg-0  min-vh-100">
      <Row className="g-0">
        <Col xs={12} className="py-2 text-center">
          <h1 className="text-tail my-5">Gestione segnalazioni</h1>
        </Col>
      </Row>

      <Row className="d-flex justify-content-around bg-white rounded-top-5 w-100 flex-fill p-2 ">
        <Col xs={12} lg={4} className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="text-green fw-bold mb-0">Gestione Post</h3>
            <Button 
              variant="outline-secondary" 
              onClick={clearPostId}
              className="rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
              title="Ricarica form"
            >
              <ArrowClockwise size={18} />
            </Button>
          </div>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Post ID</Form.Label>
              <Form.Control
                type="text"
                placeholder=" es. 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                className="input-register"
                disabled={isDeletingPost}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

  {!foundedPost ? (

      <Button
        onClick={() => findPost(postId)}
        disabled={!postId.trim()}
        className="light-rounded-btn centered"
      >
        Cerca
      </Button>
    
  ) : (
<>
      <Card className="h-100 shadow-sm rounded-5 mb-3">
        <Card.Body>
          
       <div className="d-flex align-items-center mb-3">
                          <img
                            src={foundedPost.author.avatar}
                            alt={`avatar`}
                            className="rounded-circle me-2 "
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <Card.Title className="mb-1 text-orange fw-bold">
                              {foundedPost.author.dogName}
                            </Card.Title>
                            <Card.Subtitle className="text-muted">
                              @{foundedPost.author.username}
                            </Card.Subtitle>
                          </div>
                        </div>
          <Card.Text className="d-flex align-items-center dott mt-2 pt-2">
            <GeoAltFill size={20} className="text-green me-1" />
            {foundedPost.street}, {foundedPost.district.denominazioneIta}, {foundedPost.district.provincia.siglaProvincia}
          </Card.Text>
         
          <Card.Text className=" pt-2">
            <strong className="text-green">Data e ora:</strong>{" "}
            {dataFormatter(foundedPost.date)}
          </Card.Text>

          {foundedPost.allowedSize && (
            <Card.Text>
              <strong className="text-green">Taglia ammessa:</strong> {foundedPost.allowedSize.toLowerCase()} 
            </Card.Text>
          )}
          
          {foundedPost.allowedSex && (
            <Card.Text>
              <strong className="text-green">Sesso ammesso:</strong> {foundedPost.allowedSex.toLowerCase()}
            </Card.Text>
          )}
          
          {foundedPost.allowedAge && (
            <Card.Text>
              <strong className="text-green">Età ammessa:</strong> {foundedPost.allowedAge.toLowerCase()}
            </Card.Text>
          )}

          {foundedPost.note && (
            <Card.Text>
              <strong className="text-green">Note:</strong> {foundedPost.note}
            </Card.Text>
          )}
        </Card.Body>
      </Card>

        <Button
          onClick={subDeletePost}
          disabled={isDeletingPost}
          className="green-rounded-btn centered"
        >
          {isDeletingPost ? (
            <>Eliminazione...</>
          ) : (
            <>
              <Trash className="me-2" />
              Elimina
            </>
          )}
        </Button>
  </>    
  )}

           
          </Form>
        </Col>

          <Col xs={12} lg={4}>
          <h3 className="text-green fw-bold mb-4">Segnalazioni ricevute</h3>
          {isLoading ? (
            <div className="text-center py-5">
              <PuffLoader color="#eeae36ff" size={60} />
              <p className="mt-3 text-muted">Caricamento segnalazioni...</p>
            </div>
          ) : reports.length === 0 ? (
            <p className="text-center text-muted py-5">
              Nessuna segnalazione presente
            </p>
          ) : (
            <>
              {reports.map((report) => (
                <Card key={report.id} className="mb-3 rounded-5">
                  <Card.Header className="bg-orange text-white">
                    <p className="mb-0">#{report.id}</p>
                    <small className="text-muted">
                      {dataFormatter(report.createdInDate)}
                    </small>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>
                      <p className="p-0 m-0">
                        <strong>Inviata da:</strong> {report.author.dogName} (@
                        {report.author.username})
                      </p>
                    </Card.Text>
                    <Card.Text>
                      <p className="p-0 m-0">
                        <strong>Id post:</strong> {report.post.id}
                      </p>
                    </Card.Text>
                    <Card.Text>
                      <p className="p-0 m-0"><strong>Autore:</strong> {report.post.author.email}</p>
                    </Card.Text>
                    <Card.Text>
                      <p className="p-0 m-0"><strong>Motivazione:</strong> {report.text}</p>
                    </Card.Text>
                  </Card.Body>       
                    <Trash
                      onClick={() => subDeleteReport(report.id)}
                      className="ms-2 trash-icon"
                    />
                </Card>
              ))}
            {totalPages > 1 && (
    <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
      <Button 
        onClick={prevPage}
        disabled={currentPage === 0}
        className="green-rounded-btn"
      >
        Indietro
      </Button>
      
      <span className="mx-3">
        Pagina <strong>{currentPage + 1}</strong> di <strong>{totalPages}</strong>
      </span>
      
      <Button 
        onClick={nextPage}
        disabled={currentPage === totalPages - 1}
        className="green-rounded-btn"
      >
        Avanti
      </Button>
    </div>
  )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Report;
