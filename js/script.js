/* global Handlebars */

'use strict';

// ============================================================================
// CONFIGURATION
//============================================================================
const CONFIG = {
  selectors: {
    articles: '.post',
    articleLinks: '.titles a',
    articleTitle: '.post-title',
    tagsWrapper: '.post-tags .list',
    tagLinks: '.post-tags a, .tags a',
    authorLinks: '.post-author a, .authors a',
    titleList: '.titles',
    tagList: '.tags.list',
    authorList: '.list.authors',
    themeToggle: '#theme-toggle',
    themeIcon: '.theme-toggle-icon'
  },
  classes: {
    active: 'active',
    loading: 'loading'
  },
  storageKeys: {
    theme: 'blog_theme'
  }
};

// ============================================================================
// TEMPLATES
// ============================================================================
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML)
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const utils = {
  /**
   * Show loading state
   * @param {HTMLElement} element - Element to show loading state on
   */
  showLoading(element) {
    element.classList.add(CONFIG.classes.loading);
  },

  /**
   * Hide loading state
   * @param {HTMLElement} element - Element to hide loading state from
   */
  hideLoading(element) {
    element.classList.remove(CONFIG.classes.loading);
  },

  /**
   * Escape HTML to prevent XSS
   * @param {string} unsafe - Unsafe string
   * @returns {string} Escaped string
   */
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
};

// ============================================================================
// THEME MANAGEMENT - Simple & Elegant
// ============================================================================
const themeManager = {
  /**
   * Initialize theme
   */
  init() {
    this.themeToggle = document.querySelector(CONFIG.selectors.themeToggle);

    if (!this.themeToggle) return;

    this.loadTheme();
    this.addEventListeners();
  },

  /**
   * Load saved theme from localStorage
   */
  loadTheme() {
    const savedTheme = localStorage.getItem(CONFIG.storageKeys.theme);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  },

  /**
   * Toggle theme with smooth transition
   */
  toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Add transition class for smooth animation
    document.body.classList.add('theme-transition');

    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(CONFIG.storageKeys.theme, 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(CONFIG.storageKeys.theme, 'dark');
    }

    // Remove transition class after animation completes
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  },

  /**
   * Add event listeners
   */
  addEventListeners() {
    this.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(CONFIG.storageKeys.theme)) {
        document.body.classList.add('theme-transition');

        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }

        setTimeout(() => {
          document.body.classList.remove('theme-transition');
        }, 300);
      }
    });
  }
};

// ============================================================================
// ARTICLE MANAGEMENT
// ============================================================================
const articleManager = {
  /**
   * Handle article link click
   * @param {Event} event - Click event
   */
  titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;

    // Remove active class from all article links
    document.querySelectorAll(`${CONFIG.selectors.articleLinks}.${CONFIG.classes.active}`)
      .forEach(link => link.classList.remove(CONFIG.classes.active));

    // Add active class to clicked link
    clickedElement.classList.add(CONFIG.classes.active);

    // Remove active class from all articles
    document.querySelectorAll(`${CONFIG.selectors.articles}.${CONFIG.classes.active}`)
      .forEach(article => article.classList.remove(CONFIG.classes.active));

    // Show the selected article
    const articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);
    targetArticle.classList.add(CONFIG.classes.active);
  },

  /**
   * Generate title links
   * @param {string} customSelector - Optional selector to filter articles
   */
  generateTitleLinks(customSelector = '') {
    const titleList = document.querySelector(CONFIG.selectors.titleList);
    if (!titleList) return;

    titleList.innerHTML = '';
    const articles = document.querySelectorAll(`${CONFIG.selectors.articles}${customSelector}`);

    let html = '';
    articles.forEach(article => {
      const articleId = article.getAttribute('id');
      const articleTitle = article.querySelector(CONFIG.selectors.articleTitle).innerHTML;

      const linkHTMLData = { id: articleId, title: articleTitle };
      html += templates.articleLink(linkHTMLData);
    });

    titleList.innerHTML = html;

    // Add click handlers to new links
    document.querySelectorAll(CONFIG.selectors.articleLinks)
      .forEach(link => link.addEventListener('click', this.titleClickHandler));
  }
};

// ============================================================================
// TAG MANAGEMENT
// ============================================================================
const tagManager = {
  /**
   * Calculate tag statistics
   * @param {Object} tags - Tag count object
   * @returns {Object} Min and max values
   */
  calculateTagsParams(tags) {
    const params = {
      max: 0,
      min: Infinity
    };

    Object.values(tags).forEach(count => {
      params.max = Math.max(params.max, count);
      params.min = Math.min(params.min, count);
    });

    return params;
  },

  /**
   * Calculate tag class based on frequency
   * @param {number} count - Tag count
   * @param {Object} params - Min and max values
   * @returns {string} CSS class name
   */
  calculateTagClass(count, params) {
    if (params.max === params.min) return 'tag-size-3';

    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;

    // Map to 1-5 range (5 classes)
    const classNumber = Math.floor(percentage * 4) + 1;
    return `tag-size-${classNumber}`;
  },

  /**
   * Generate tags for all articles
   */
  generateTags() {
    const articles = document.querySelectorAll(CONFIG.selectors.articles);
    const allTags = {};

    articles.forEach(article => {
      const tagsWrapper = article.querySelector(CONFIG.selectors.tagsWrapper);
      if (!tagsWrapper) return;

      let html = '';
      const articleTags = article.getAttribute('data-tags');

      if (!articleTags) return;

      articleTags.split(', ').forEach(tag => {
        const escapedTag = utils.escapeHtml(tag);
        html += `<li><a href="#tag-${escapedTag}">${escapedTag}</a></li>`;

        allTags[tag] = (allTags[tag] || 0) + 1;
      });

      tagsWrapper.innerHTML = html;
    });

    this.renderTagCloud(allTags);
    this.addClickListeners(); // Re-add listeners after generating tags
  },

  /**
   * Render tag cloud with color classes
   * @param {Object} allTags - All tags with counts
   */
  renderTagCloud(allTags) {
    const tagList = document.querySelector(CONFIG.selectors.tagList);
    if (!tagList) return;

    const tagsParams = this.calculateTagsParams(allTags);
    const allTagsData = { tags: [] };

    // Create array of tags with their counts and classes
    Object.entries(allTags).forEach(([tag, count]) => {
      allTagsData.tags.push({
        tag: tag,
        count: count,
        className: this.calculateTagClass(count, tagsParams)
      });
    });

    // Sort tags alphabetically
    allTagsData.tags.sort((a, b) => a.tag.localeCompare(b.tag));

    // Generate HTML using template
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

    // Log to verify classes are applied
    console.log('Tag classes:', allTagsData.tags);
  },

  /**
   * Handle tag click
   * @param {Event} event - Click event
   */
  tagClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');

    // Update active states for all tag links (both in post tags and tag cloud)
    document.querySelectorAll('a.active[href^="#tag"]')
      .forEach(tagLink => tagLink.classList.remove(CONFIG.classes.active));

    document.querySelectorAll(`a[href="${href}"]`)
      .forEach(tagLink => tagLink.classList.add(CONFIG.classes.active));

    // Filter articles by tag
    articleManager.generateTitleLinks(`[data-tags~=${tag}]`);
  },

  /**
   * Add click listeners to tags
   */
  addClickListeners() {
    document.querySelectorAll(CONFIG.selectors.tagLinks)
      .forEach(tagLink => tagLink.addEventListener('click', this.tagClickHandler.bind(tagLink)));
  }
};

// ============================================================================
// AUTHOR MANAGEMENT
// ============================================================================
const authorManager = {
  /**
   * Generate authors list
   */
  generateAuthors() {
    const articles = document.querySelectorAll(CONFIG.selectors.articles);
    const allAuthors = new Set();
    const authorListWrapper = document.querySelector(CONFIG.selectors.authorList);

    if (!authorListWrapper) return;
    authorListWrapper.innerHTML = '';

    // Collect unique authors and update article author links
    articles.forEach(article => {
      const authorWrapper = article.querySelector('.post-author');
      const author = article.getAttribute('data-author');

      if (author) {
        allAuthors.add(author);
        const escapedAuthor = utils.escapeHtml(author);
        authorWrapper.innerHTML = `<a href="#author-${escapedAuthor}">${author}</a>`;
      }
    });

    // Render author list
    const sortedAuthors = Array.from(allAuthors).sort();
    sortedAuthors.forEach(author => {
      const escapedAuthor = utils.escapeHtml(author);
      authorListWrapper.innerHTML += `<li><a href="#author-${escapedAuthor}">${author}</a></li>`;
    });
  },

  /**
   * Handle author click
   * @param {Event} event - Click event
   */
  authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');

    // Update active states
    document.querySelectorAll('a.active[href^="#author"]')
      .forEach(authorLink => authorLink.classList.remove(CONFIG.classes.active));

    document.querySelectorAll(`a[href="${href}"]`)
      .forEach(authorLink => authorLink.classList.add(CONFIG.classes.active));

    // Filter articles by author
    articleManager.generateTitleLinks(`[data-author="${author}"]`);
  },

  /**
   * Add click listeners to authors
   */
  addClickListeners() {
    document.querySelectorAll(CONFIG.selectors.authorLinks)
      .forEach(authorLink => authorLink.addEventListener('click', this.authorClickHandler.bind(authorLink)));
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  articleManager.generateTitleLinks();
  tagManager.generateTags();
  authorManager.generateAuthors();
  authorManager.addClickListeners();
  themeManager.init();

  console.log('Blog initialized successfully!');
});
