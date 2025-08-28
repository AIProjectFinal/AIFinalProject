import react from 'react';
import NavBar from "../NavBar/NavBar.jsx";
import styles from "./Layout.module.css";
import Footer from '../Footer/Footer'; 
import Button from "../Button/Button.jsx";
// import Chatbot from "../../components/Chatbot/Chatbot.jsx"; 

const Layout = ({children}) => {

    return (
    <div className = "app-shell">
     <NavBar />
    <main className ="pageContent">
    <Button name="Donate" color="#A6CA6D" className={styles.donateButton}/>
        {children}
    </main>
   <Footer />
    </div>
    )};

export default Layout;