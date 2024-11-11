class ImageGallery {
  constructor(container) {
    this.container = container;
    this.currentIndex = 0;

    // create required elements
    this.overlay = document.getElementById('overlay');
    this.currentImage = document.getElementById('current-image');
    this.prevButton = document.getElementById('prev');
    this.nextButton = document.getElementById('next');
    this.filterContainer = document.getElementById('filter-data-btn-container');

    // bind event handlers using event delegation
    this.container.addEventListener('click', (e) => {
      const clickedImage = e.target.closest('.gallery__image');
      if (clickedImage) {
        this.showImage(clickedImage);
      }
    });

    // navigation controls
    this.prevButton.addEventListener('click', () => this.handlePrev());
    this.nextButton.addEventListener('click', () => this.handleNext());
    document.getElementById('close-image').addEventListener('click', () => this.handleClose());

    // filter controls
    if (this.filterContainer) {
      this.filterContainer.addEventListener('click', (e) => this.handleFilter(e));
    }
  }

  async init() {
    try {
      const response = await fetch('/api/gallery/images');
      const result = await response.json();
      
      if (result.status === 'success') {
        const images = Array.isArray(result.data) ? result.data : [];
        this.renderImages(images);
      } else {
        console.error('Invalid response format:', result);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error loading images:', error);
      // Optionally show an error message to the user
      this.container.innerHTML = `
        <div class="gallery__error">
          <p>Failed to load gallery images. Please try again later.</p>
        </div>
      `;
    }
  }

  renderImages(images) {
    const container = document.getElementById('gallery-container');
    container.innerHTML = images.map(image => `
      <div class="gallery__item" data-category="${image.category}">
        <img 
          class="gallery__image" 
          src="${image.path}"
          alt="${image.description}"
          data-index="${images.indexOf(image)}"
          loading="lazy"
        />
        <div class="gallery__caption">${image.description}</div>
      </div>
    `).join('');
    
    this.images = images;
  }

  showImage(clickedImage) {
    const index = parseInt(clickedImage.dataset.index);
    this.currentIndex = index;
    
    const image = this.images[this.currentIndex];
    this.currentImage.src = image.path;
    this.currentImage.alt = image.description;
    
    this.overlay.classList.add('active');
  }

  handlePrev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    const image = this.images[this.currentIndex];
    this.currentImage.src = image.path;
    this.currentImage.alt = image.description;
  }

  handleNext() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    const image = this.images[this.currentIndex];
    this.currentImage.src = image.path;
    this.currentImage.alt = image.description;
  }

  handleClose() {
    this.overlay.classList.remove('active');
  }

  handleFilter(e) {
    const filterButton = e.target.closest('.filter-button');
    if (!filterButton) return;

    // Update active state of filter buttons
    this.filterContainer.querySelectorAll('.filter-button').forEach(btn => {
      btn.classList.remove('active');
    });
    filterButton.classList.add('active');

    const category = filterButton.dataset.filter;
    const items = this.container.querySelectorAll('.gallery__item');

    items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gallery-container');
  if (container) {
    const gallery = new ImageGallery(container);
    gallery.init();
  }
});
