import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";
import pattern from "../assets/img/svg/pattern.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect,  useState } from "react";
import { fetchOtherProfile } from "../redux/actions/profileActions";
import {
  checkFollowing,
  followUser,
  unfollowUser,
  fetchStats,
} from "../redux/actions/friendsActions";
import { PersonAdd, PersonDash } from "react-bootstrap-icons";
import { PuffLoader } from "react-spinners";

const OtherProfile = () => {
  const { otherProfile, followingStatus, stats } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const { username } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (token && username) {
      dispatch(fetchOtherProfile(token, username));
    }
  }, [dispatch, token, username]);

  useEffect(() => {
    if (otherProfile && token) {
      dispatch(checkFollowing(token, otherProfile.id));
      dispatch(fetchStats(token, otherProfile.id));
    }
  }, [otherProfile, dispatch, token]);

   const subFollow = () => {
    setIsLoading(true);
    setError("");
    dispatch(followUser(token, otherProfile.id)).then((result) => {
      setIsLoading(false);
      if (result.success) {
        dispatch(checkFollowing(token, otherProfile.id));
        dispatch(fetchStats(token, otherProfile.id));
      } else {
        setError(result.error || "Errore durante il follow");
      }
    });
  };

  const subUnfollow = () => {
      setIsLoading(true);
      setError("");
      dispatch(unfollowUser(token, otherProfile.id)).then((result) => {
        setIsLoading(false);
        if (result.success) {
          dispatch(checkFollowing(token, otherProfile.id));
          dispatch(fetchStats(token, otherProfile.id));
        } else {
          setError(result.error || "Errore durante l'unfollow");
        }
      });
    
  };


  if (!otherProfile) {
    return (
      <Container className="text-center mt-5">
        <PuffLoader color="#eeae36ff" size={30} />
      </Container>
    );
  }

  const isFollowing = followingStatus[otherProfile.id] || false;
  const userStats = stats[otherProfile.id] || { following: 0, followers: 0 };

  return (
    <>
      <Container
        fluid
        className="p-0 d-flex flex-column align-items-center pb-5 pb-lg-0 bg-orange"
        style={{
          backgroundImage: `url(${pattern})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}>
        <Row className="w-100 d-flex justify-content-center p-0">
          <Col xs={8} lg={2} className="text-center p-5 position-relative">
            <img
              src={otherProfile.avatar}
              alt="photo profile"
              className="photo-main-profile w-100"
            />
          </Col>
        </Row>

        <Row className="d-flex flex-column align-items-center p-0 bg-white rounded-top-5 w-100">
          <Col xs={12} className="pt-3 pb-5 position-relative">
            <Button onClick={() => navigate(-1)} className="logout">
              {"\u21A9"}
            </Button>

             <div className="d-flex justify-content-center gap-4 mt-3 mb-3">
              <div className="text-center">
                <Badge className="fs-6 px-3 py-2 badge">
                  {userStats.following} Seguiti
                </Badge>
              </div>
              <div className="text-center">
                <Badge  className="fs-6 px-3 py-2 badge">
                  {userStats.followers} Follower
                </Badge>
              </div>
            </div>

            {error && (
              <Alert
                variant="danger"
                className="mx-3 mt-3"
                onClose={() => setError("")}
                dismissible>
                {error}
              </Alert>
            )}


            <Row className="d-flex justify-content-around p-0 w-100 g-0">
              <Col xs={11} lg={4} className="pt-3">
                <p className="text-green fs-3 fw-bold">Info personali</p>

                <Form.Group className="mb-3 text-start" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={otherProfile.username}
                    className="input-register"
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3 text-start" controlId="bio">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={otherProfile.bio || "..."}
                    className="input-register"
                    disabled
                  />
                </Form.Group>

                  <div className="mt-4">
                  {isFollowing ? (
                    <Button
                      className="centered d-flex align-items-center justify-content-center gap-2 green-rounded-btn"
                      onClick={subUnfollow}
                      disabled={isLoading}>
                      {isLoading ? (
                        <PuffLoader color="#eeae36ff" size={30} />
                      ) : (
                        <>
                          <PersonDash size={20} />
                          <span>Unfollow</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline-success"
                      className="centered light-rounded-btn d-flex align-items-center justify-content-center gap-2"
                      onClick={subFollow}
                      disabled={isLoading}>
                      {isLoading ? (
                        <PuffLoader color="#eeae36ff" size={30} />
                      ) : (
                        <>
                          <PersonAdd size={20} />
                          <span>Segui</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Col>

              <Col xs={11} lg={4} className="pt-3">
                <p className="text-green fs-3 fw-bold">Info Cane</p>
                <Form.Group className="mb-3 text-start" controlId="dogName">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={otherProfile.dogName}
                    className="input-register"
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3 text-start" controlId="age">
                  <Form.Label>Età</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      otherProfile.age === "JUNIOR"
                        ? "Cucciolo"
                        : otherProfile.age === "ADULT"
                        ? "Adulto"
                        : "Senior"
                    }
                    className="input-register"
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3 text-start" controlId="size">
                  <Form.Label>Taglia</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      otherProfile.size === "SMALL"
                        ? "Piccola"
                        : otherProfile.size === "MEDIUM"
                        ? "Media"
                        : otherProfile.size === "LARGE"
                        ? "Grande"
                        : "Gigante"
                    }
                    className="input-register"
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3 text-start" controlId="sex">
                  <Form.Label>Sesso</Form.Label>
                  <Form.Control
                    type="text"
                    value={otherProfile.sex === "MALE" ? "Maschio" : "Femmina"}
                    className="input-register"
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OtherProfile;