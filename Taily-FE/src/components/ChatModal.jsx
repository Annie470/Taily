import { useState,  useRef, useEffect } from 'react';
import { Modal, Form, Button, ListGroup } from 'react-bootstrap';
import { useChat } from '../hooks/useChat';
import { ArrowRight } from 'react-bootstrap-icons';
import { useSelector} from "react-redux";

const ChatModal = ({ show, onHide, postId, token }) => {
  const [input, setInput] = useState('');
  const { messages, sendMessage, connected } = useChat(postId, token);
   const { data: profile } = useSelector((state) => state.profile);
   const lastMessRef = useRef(null);

    const goBottom = () => {
    lastMessRef.current?.scrollIntoView({ behavior: 'smooth' }); //behavior con smooth rende scroll fluido
  };

  useEffect(() => {
    if (show) goBottom();
  }, [show, messages]);

  const subSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chat Evento</Modal.Title>
       {connected ? (
  <span className="text-orange ms-4">● Online</span>
) : (
  <span className="text-green ms-4">● Offline</span>
)}
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }} className='dott'>
        <ListGroup>
  {messages.map(msg => {
    const isCurrProfile = msg.senderUsername === profile?.username;
    
    return (
      <ListGroup.Item 
        key={msg.id} 
        className={`rounded-5 my-1 ${isCurrProfile ? 'ms-auto' : ''}`}
        style={{ 
          width: 'fit-content',
          maxWidth: '80%',
          display: 'block'
        }}
      >
        {!isCurrProfile && (
          <strong className='text-green'>{msg.senderUsername}</strong>
        )}
       
        {isCurrProfile && (
          <strong className='text-orange ms-2'>{msg.senderUsername}</strong>
        )}

         <small className={`text-muted ms-2`}>
          {new Date(msg.timestamp).toLocaleTimeString()}
        </small>
        <div style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {msg.text}
        </div>
      </ListGroup.Item>
    );
  })}

    <div ref={lastMessRef} />   {/* ref per ultimo mess */}
  
</ListGroup>
      </Modal.Body>
      <Modal.Footer className='dott d-flex align-items-center'>
        <Form onSubmit={subSend} className="w-100 d-flex m-o">
          <Form.Control
            type="text"
            placeholder="Scrivi un messaggio..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!connected}
            className='input-register'
          />
          <Button type="submit" disabled={!connected} className="ms-2 bg-orange-btn rounded-5 px-4 mb-1">
           <ArrowRight size={16} className="text-white" />
          </Button>
        </Form>
      </Modal.Footer>
    </Modal>
  );
};

export default ChatModal;
