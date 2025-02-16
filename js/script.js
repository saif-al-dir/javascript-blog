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
    const articles = document.querySelectorAll(optArticleSelector);
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

const optArticleTagsSelector = '.post-tags .list';

function generateTags() {
  const articles = document.querySelectorAll(optArticleSelector);

  for (const article of articles) {
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    let html = '';

    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');

    for (let tag of articleTagsArray) {
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      html += linkHTML;
    }

    tagsWrapper.innerHTML = html;
  }
}

generateTags();

// Function to handle tag clicks
function tagClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');

// Remove 'active' class from all tag links
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  for (const activeLink of activeTagLinks) {
    activeLink.classList.remove('active');
  }

// Add 'active' class to the clicked tag link
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (const tagLink of tagLinks) {
    tagLink.classList.add('active');
  }

// Call generateTitleLinks with the selected tag
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

// Function to add click listeners to tag links
function addClickListenersToTags() {
  const tagLinks = document.querySelectorAll('.post-tags a');
  for (const link of tagLinks) {
    link.addEventListener('click', tagClickHandler);
  }
}

addClickListenersToTags();

const optArticleAuthorSelector = '.post-author a';

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);

  for (const article of articles) {
    const authorWrapper = article.querySelector('.post-author');
    const authorName = article.getAttribute('data-author');
// Create the HTML for the author link
    const authorLinkHTML = '<a href="#author-' + authorName.replace(' ', '-') + '">' + authorName + '</a>';

    // Insert the author link into the author wrapper
    authorWrapper.innerHTML = authorLinkHTML;
  }
}

generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#author-', '').replace('-', ' '); // Convert back to original name

  // Call generateTitleLinks with the author selector
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToAuthors() {
  const authorLinks = document.querySelectorAll(optArticleAuthorSelector);
  for (const link of authorLinks) {
      link.addEventListener('click', authorClickHandler); // Add event listener for each author link
  }
}

addClickListenersToAuthors();
