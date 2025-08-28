import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

export default function ChatIcon() {
  const [showModal, setShowModal] = useState(false);

  const iconStyle = {
    color: '#ff7194',
    fontSize: '1.4rem',
    cursor: 'pointer',
  };

  return (
    <>
      <FontAwesomeIcon
        icon={faCommentDots}
        style={iconStyle}
        onClick={() => setShowModal(true)}
        aria-label="Chat"
      />
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}