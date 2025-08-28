import React, { useState } from "react";
import styles from "./NavBar.module.css";
import Popup from "../Popup/Popup.jsx";
import PortalExample from './PortalExample';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingBasket, faCommentDots } from '@fortawesome/free-solid-svg-icons';

function NavBar() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChatButtonClick = () => {
    setIsChatOpen(true);
  };

  const handleClosePopup = () => {
    setIsChatOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <nav className={styles.navBar}>
      <h3 className={styles.logo}>Root & Revive</h3>
      
   
      <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </form>

      <div className={styles.iconContainer}>
        <div className={styles.icon} title="User Profile">
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div className={styles.icon} title="Shopping Basket">
          <FontAwesomeIcon icon={faShoppingBasket} />
        </div>
        <PortalExample />
      </div>

      {isChatOpen && <Popup onClose={handleClosePopup} />}
    </nav>
  );
}

export default NavBar;