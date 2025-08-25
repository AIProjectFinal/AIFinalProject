import styles from "./Chatbot.module.css";
import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ModalContent({ onClose }) {

      const [query, setQuery] = useState("");
      const [address, setAddress] = useState("")
      const [long, setLong] = useState("")
      const [lat, setLat] = useState("")
    
      async function askAssistant(){
      const body = {"message": query}
      if (address.length > 0){
        body.lat = lat
        body.long = long
      }
  
      const client = "http://localhost:5678/ask"
    
      const response = await fetch( client, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)})
      const conversation =  await response.json()

      const parentNode = document.getElementById("chatBody")

      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
        }
        let i = 0
        conversation.forEach(message => {
            let x = document.createElement('div');
            if (message.role === "assistant"){
                x.className = styles.botMessage;}
            else if (message.role === "user"){
                x.className = styles.userMessage;}
            else if (message.role === "system"){
                x.className = styles.botMessage;}
            x.id = `${i}`
            let y = document.createElement('p');
            y.className = styles.messageText;
            if (message.role === "user");
              y.innerText = `${message.content}`;
            if (message.role === "assistant");
              y.innerHTML = `${message.content}`;
            if (message.role === "system"){
                y.innerHTML = "Hey there! 👋 I'm here to help you find tasty spots in Memphis that should line up with your dietary needs — whether that's vegan, gluten-free, dairy-free,or all of the above. I'll do my best to point you toward the right places."};
            x.appendChild(y);
            parentNode.appendChild(x);
            i++
    })
        let target = conversation.length - 2
        target = `${target}`
        console.log(target)
        let lastChatMessage = document.getElementById(target)
        lastChatMessage.scrollIntoView({behavior:'smooth', block:'start'})

      }

      async function loadChat(){    
      const response = await fetch("http://localhost:5678/")
      const conversation =  await response.json()

      const parentNode = document.getElementById("chatBody")

      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild);
        }
        let i = 0
        conversation.forEach(message => {
            let x = document.createElement('div');
            if (message.role === "assistant"){
                x.className = styles.botMessage;}
            else if (message.role === "user"){
                x.className = styles.userMessage;}
            else if (message.role === "system"){
                x.className = styles.botMessage;}
            x.id = `${i}`
            let y = document.createElement('p');
            y.className = styles.messageText;
            if (message.role === "user");
              y.innerText = `${message.content}`;
            if (message.role === "assistant");
              y.innerHTML = `${message.content}`;
            if (message.role === "system"){
                y.innerHTML = "Hey there! 👋 I'm here to help you find tasty spots in Memphis that should line up with your dietary needs — whether that's vegan, gluten-free, dairy-free,or all of the above. I'll do my best to point you toward the right places."};
            x.appendChild(y);
            parentNode.appendChild(x);
            i++
    })
        if (conversation.length > 2) {
          let target = conversation.length - 2
          target = `${target}`
          console.log(target)
          let lastChatMessage = document.getElementById(target)
          lastChatMessage.scrollIntoView({behavior:'smooth', block:'start'})}

      }
    
      function handleSubmit(event){
          event.preventDefault();
          askAssistant();
          setQuery("")
      }

      useEffect(()=> {
        loadChat()
      }, []);
    
      function submitAddress(event){
        event.preventDefault()
        console.log(address)
        const apiKey = import.meta.env.VITE_API_KEY
        fetch(`https://api.mapbox.com/search/geocode/v6/forward?q=${address}&access_token=${apiKey}`)
        .then((response) => response.json())
        .then((json) => {
          let features = json.features[0]
          let coor = features.geometry.coordinates
          setLong(`${coor[0]}`)
          setLat(`${coor[1]}`)
        });
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



          <button className={styles.iconButton}>
            <KeyboardArrowDownIcon className={styles.keyboardDown} onClick={onClose}/>
          </button>


        </div>
          <div>
          </div>

        {/* Chat Body */}
        <div className={styles.chatBody} id="chatBody">
          {/* Bot Message */}

               <form className={styles.address}>
                <input 
                  type="text"
                  placeholder="Add Address" 
                  value={address}
                  name="name" 
                  onChange={(event) => setAddress(event.target.value)}
                />
                <button onClick={submitAddress}>
                  Button
                </button>
            </form>
          <div className={styles.botMessage}>
            <p className={styles.messageText}>
              Hey there! 👋 I'm here to help you find tasty spots in Memphis that should line up with your dietary needs — whether that's vegan, gluten-free, dairy-free,or all of the above. I'll do my best to point you toward the right places.
            </p>
          </div>

          {/* User Message */}
          {/* <div className={styles.userMessage}>
            <p className={styles.messageText}>Where can I get a vegan burger?</p>
          </div> */}

          </div>

        {/* Chat Footer */}
        <div className={styles.chatFooter}>
          <form className={styles.chatForm}>
            <input 
                type="text" 
                placeholder="Message..." 
                className={styles.messageInput} 
                name="query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                required 
            />
            <button className={styles.sendButton} onClick={handleSubmit}>
              <KeyboardArrowDownIcon className={styles.keyboardDown} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}