import React from 'react';

//Styles
import styles from "./Home.module.css";

//Components
import Article from "../../components/Article/Article.jsx";
import Layout from "../../components/Layout/Layout.jsx"; 

//Images

import citysilo from '../../assets/citysilo.jpg';

const Home =() => {
return(
<Layout>

<main >

   


  <div className={styles.hero}>
  <div className={styles.heroImage}> </div>
  </div>


<section className={styles.section}>
  <h1>
    “ We're rooted in finding you the best <span className={styles.greenText}>
      vegan, gluten-free, and dairy-free </span> options to revive your well-being.” </h1>
</section>

<div className={styles.reccomendations}>
  <h4>Best Vegan Bakery's in Memphis:</h4>
<div className={styles.reccomendationsRestaurant}>
  <Article description={"The Pink Bakery"}/>
  <Article description={"Muddy's Bake Shop"}/>
  <Article description={"Frost Bake Shop"}/>
  </div>
</div>

</main>
</Layout>
);
}

export default Home; 