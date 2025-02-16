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

const optArticleSelector = '.post';

// Function to handle click events on title links
function titleClickHandler(event) {
    event.preventDefault(); // Prevent default anchor click behavior
    
// Remove 'active' class from all articles
    const articles = document.querySelectorAll(optArticleSelector);
    for (const article of articles) {
        article.classList.remove('active');
        console.log(optArticleSelector);
    }
// Add 'active' class to the clicked article
    const targetArticle = document.querySelector(this.getAttribute('href'));
        if (targetArticle) {
            targetArticle.classList.add('active');
    }
}

function generateTitleLinks() {
// Remove contents of titleList
    const titleList = document.querySelector('.list-titles');
    titleList.innerHTML = ''; // Clear the existing content

// Find all the articles and save them to variable: articles
    const articles = document.querySelectorAll('.post');

    let html = ''; // Initialize an empty string to hold the HTML

    for (let article of articles) {
// Get the article id
        const articleId = article.getAttribute('id');

// Find the title element
        const titleElement = article.querySelector('.post-title');

// Get the title from the title element
        const articleTitle = titleElement.innerHTML;

// Create HTML of the link
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

// Insert link into html variable
        html += linkHTML; // Append the link HTML to the html variable
    }

// Insert all links into titleList at once
    titleList.innerHTML = html;

// Add click event listeners to the links
    const links = document.querySelectorAll('.list-titles a'); // Get all the links
    console.log(links); // Check what links contain

    for (const link of links) {
            link.addEventListener('click', titleClickHandler); // Add event listener
        }
    }

// Call the function to generate title links
generateTitleLinks();