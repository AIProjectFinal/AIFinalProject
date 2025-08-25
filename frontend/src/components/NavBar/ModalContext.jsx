import styles from "./Chatbot.module.css";
import React, { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ModalContent({ onClose }) {
  const [query, setQuery] = useState("");
  const [address, setAddress] = useState("");
  const [long, setLong] = useState("");
  const [lat, setLat] = useState("");
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Function to handle sending a message
  async function askAssistant() {
    const body = { message: query };
    if (address.length > 0 && lat && long) {
      body.lat = lat;
      body.long = long;
    }

    const client = "http://localhost:5678/ask";

    try {
      const response = await fetch(client, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const conversation = await response.json();

      const parentNode = document.getElementById("chatBody");
      // Clear previous messages
      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
      }
      // Render new conversation
      let i = 0;
      conversation.forEach((message) => {
        const messageDiv = document.createElement('div');
        messageDiv.className =
          message.role === "assistant" || message.role === "system"
            ? styles.botMessage
            : styles.userMessage;
        messageDiv.id = `${i}`;

        const messageText = document.createElement('p');
        messageText.className = styles.messageText;

        if (message.role === "system") {
          messageText.innerHTML =
            "Hey there! 👋 I'm here to help you find tasty spots in Memphis that should line up with your dietary needs — whether that's vegan, gluten-free, dairy-free, or all of the above. I'll do my best to point you toward the right places.";
        } else {
          messageText.innerHTML = `${message.content}`;
        }

        messageDiv.appendChild(messageText);
        parentNode.appendChild(messageDiv);
        i++;
      });

      // Scroll to last message
      const targetIndex = conversation.length - 1;
      const lastChatMessage = document.getElementById(`${targetIndex}`);
      if (lastChatMessage) {
        lastChatMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      console.error("Error asking assistant:", error);
    }
  }

  function handleSend(event) {
    event.preventDefault();
    if (query.trim() === "") return;
    askAssistant();
    setQuery("");
  }

  // Function to handle address submission and geocode
  async function submitAddress(event) {
    event.preventDefault();
    if (!address.trim()) return;

    setLoadingAddress(true);
    setAddressError("");
    try {
      //I'm trying to make a mapbox account to replace the placeholders 
      const response = await fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(
          address
        )}&access_token=YOUR_MAPBOX_ACCESS_TOKEN`
      );
      const json = await response.json();

      if (json.features && json.features.length > 0) {
        const features = json.features[0];
        const coor = features.geometry.coordinates;
        setLong(`${coor[0]}`);
        setLat(`${coor[1]}`);
      } else {
        setAddressError("Address not found. Please try again.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setAddressError("Error fetching geocode. Please try again.");
    } finally {
      setLoadingAddress(false);
    }
  }

  return (
    <div className={styles.container}>
      {/* Main Chatbot Popup */}
      <div className={styles.chatbotPopup}>
        {/* Chatbot Header */}
        <div className={styles.chatHeader}>
          <div className={styles.headerInfo}>
            <h2 className={styles.logoText}>Herb</h2>
          </div>
          <button className={styles.iconButton} onClick={onClose}>
            <KeyboardArrowDownIcon className={styles.keyboardDown} />
          </button>
        </div>

        {/* Chat Body */}
        <div className={styles.chatBody} id="chatBody">
          {/* Address Search */}
          <form className={styles.address} onSubmit={submitAddress}>
            <input
              type="text"
              placeholder="Add Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button type="submit" disabled={loadingAddress}>
              {loadingAddress ? "Searching..." : "Search"}
            </button>
            {addressError && (
              <p className={styles.errorText}>{addressError}</p>
            )}
          </form>

          {/* Initial Bot Message */}
          <div className={styles.botMessage}>
            <p className={styles.messageText}>
              Hey there! 👋 I'm here to help you find tasty spots in Memphis that should line up with your dietary needs — whether that's vegan, gluten-free, dairy-free, or all of the above. I'll do my best to point you toward the right places.
            </p>
          </div>
        </div>

        {/* Chat Footer */}
        <div className={styles.chatFooter}>
          <form className={styles.chatForm} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Message..."
              className={styles.messageInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
            <button className={styles.sendButton} type="submit">
              <KeyboardArrowDownIcon className={styles.keyboardDown} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}