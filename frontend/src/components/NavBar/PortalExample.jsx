import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContext';
import Button from "../Button/Button.jsx";

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);

  const styles = {
    backgroundColor: '#ff7194',
    color: 'white',
    padding: '18px 25px',
    borderRadius: '0px',
    cursor: 'pointer',
    border: 'none',
    textTransform: 'uppercase',
    fontSize: '15px',
    fontWeight: 500,
    marginTop: '10px',
    letterSpacing: '1px',
    fontFamily: "Alexandria, sans-serif",
  };

  return (
    <>
      <button style={styles} onClick={() => setShowModal(true)}>
        Ask Herb
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}