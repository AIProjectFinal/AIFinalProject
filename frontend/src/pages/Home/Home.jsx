import React from 'react';

//Styles
import styles from "./Home.module.css";

//Components
import Article from "../../components/Article/Article.jsx";
import Layout from "../../components/Layout/Layout.jsx"; 
//import MemphisMap from "../../components/Map/Map.jsx"; 

//Images
import ratishImage from '../../assets/ratish.png';
import One from '../../assets/1.png';
import Two from '../../assets/2.png';
import Three from '../../assets/3.png';

const Home =() => {
return(
<Layout>

<main >

   


  <div className={styles.hero}>
     <h1>Rooted in <span className={styles.underlineText}>  Community, </span>  Revived by Food </h1>
    <p className={styles.heroText}> Connecting you to the freshest
    local produce, crafted into vibrant meals. </p>
  </div>


<section className={styles.section}>
  <h1>
    “ We're rooted in finding you the best <span className={styles.greenText}>
      vegan, gluten-free, and dairy-free </span> options to revive your well-being.” </h1>
</section>

<div className={styles.reccomendations}>
  <Article description={"Article 1 description"}/>
  <Article description={"Article 2 description"}/>
  <Article description={"Article 3 description"}/>
</div>

<section className={styles.section}></section>


<section className={styles.sectionGrid}>
  <img src={One} alt="" />
  <img src={Two} alt="" />
  <img src={Three} alt="" />
</section>

</main>
</Layout>
);
}

export default Home; 