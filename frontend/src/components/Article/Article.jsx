import React from 'react';
import styles from "./Article.module.css";



function Article({ description, bgClass }) { 
    return (
        <div className={styles.ArticleContainer}>
            <article className={`${styles.Article} ${bgClass}`}></article>
            <p>{description}</p>
        </div>
    );
}

export default Article;