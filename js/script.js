'use strict';

// Get all article links
const articleLinks = document.querySelectorAll('.list-titles a');

// Add click event listener to each link
for (const link of articleLinks) {
    link.addEventListener('click', function() {
        // Remove 'active' class from all articles
        const articles = document.querySelectorAll('.post');
        for (const article of articles) {
            article.classList.remove('active');
        }

        // Add 'active' class to the clicked article
        const targetArticle = document.querySelector(this.getAttribute('href'));
        if (targetArticle) {
            targetArticle.classList.add('active');
        }
    });
}
