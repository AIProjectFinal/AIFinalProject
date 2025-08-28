import React from 'react';

//Styles
import styles from "./Home.module.css";

//Components
import Article from "../../components/Article/Article.jsx";
import Layout from "../../components/Layout/Layout.jsx"; 

//Images

import citysilo from '../../assets/citysilo.jpg';
import veganDish from '../../assets/veganDish.webp';

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
  <h4>Vegan Bakery's in Memphis:</h4>
<div className={styles.reccomendationsRestaurant}>
  <Article description={"The Pink Bakery"}/>
  <Article description={"Muddy's Bake Shop"}/>
  <Article description={"Frost Bake Shop"}/>
  </div>
</div>

<div className={styles.newsletter}>
  <div className={styles.newsletterLeft}>
    
  </div>
  <div className={styles.newsletterRight}>
    <form className={styles.newsletterForm}>
      <h2 className={styles.newsletterTitle}>Subscribe to our Newsletter</h2>
      <input
        type="email"
        placeholder="Enter your email"
        required
        className={styles.emailInput}
      />
      <button type="submit" className={styles.subscribeButton}>
        Subscribe
      </button>
    </form>
  </div>
</div>

</main>
</Layout>
);
}

export default Home; 