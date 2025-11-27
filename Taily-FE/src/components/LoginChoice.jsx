import {Container, Row, Col, Button} from 'react-bootstrap'
import loginDog from '../assets/img/login-dog.png'
import logo from '../assets/img/GreenLogo.svg'
import { useNavigate } from 'react-router-dom';

const LoginChoice=()=> {
    const navigate = useNavigate();
    return(
        <>
        <Container fluid className='bg-orange vh-100'>
            <Row className='d-flex vh-100 justify-content-center align-items-lg-center'>
                <Col xs={9} md={6} lg={4} className='p-0 text-center d-flex flex-column'>   
                <img src={logo} alt="Logo" className='w-100 mb-4 mt-5'/>      
                <Button className="light-rounded-btn mb-3" onClick={() => navigate('/register')}>Iscriviti</Button>
                <Button className="green-rounded-btn"  onClick={() => navigate('/login')}>Accedi</Button>
                </Col>

                <Col xs={10} md={7} lg={6} className='p-0'>
                <img src={loginDog} alt="dog" className='login-dog' />
                </Col>
            </Row>
        </Container>
        </>
    )
}
export default LoginChoice