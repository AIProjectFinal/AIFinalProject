import React from 'react';

//Styles
import styles from "./Home.module.css";

//Components
import Article from "../../components/Article/Article.jsx";
import Layout from "../../components/Layout/Layout.jsx"; 

//Images

import citysilo from '../../assets/citysilo.jpg';
import veganDish from '../../assets/veganDish.webp';
import frostbakery from '../../assets/frostbakery.jpg';
import pinkbakery from '../../assets/pinkbakery.jpg';
import muddybakery from '../../assets/muddybakery.jpg';

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
  <h3>Vegan Bakery's in Memphis:</h3>
<div className={styles.reccomendationsRestaurant}>

<Article id="pink-bakery" description={"The Pink Bakery"} bgClass={styles.PinkBakery} />
<Article id="muddy-bakeshop" description={"Muddy's Bake Shop"} bgClass={styles.MuddysBakeShop} />
<Article id="frost-bakeshop" description={"Frost Bake Shop"} bgClass={styles.FrostBakeShop} />

  </div>
</div>

<div className={styles.newsletter}>
  <div className={styles.newsletterLeft}>
   
  </div>
  <div className={styles.newsletterRight}>
    <h2 className={styles.newsletterTitle}>Embrace a Vegan Lifestyle!</h2>
    <p className={styles.promoText}>
      Discover delicious plant-based recipes, health tips, and eco-friendly choices.
      Join us in making a positive impact on your health and the planet.
    </p>
   
  </div>
</div>

</main>
</Layout>
);
}

export default Home; 