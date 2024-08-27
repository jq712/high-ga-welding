document.addEventListener("DOMContentLoaded", function() {
  // Array of gallery items
  const galleryItems = [
      { href: "./images/2.jpg", title: "Image 1", description: "Description 1", category: "pipes" },
      { href: "./images/3.jpg", title: "Image 2", description: "Description 2", category: "structural" },
      { href: "./images/4.jpg", title: "Image 3", description: "Description 3", category: "pipes" },
      { href: "./images/5.jpg", title: "Image 4", description: "Description 4", category: "structural" },
      { href: "./images/6.jpg", title: "Image 5", description: "Description 5", category: "pipes" },
      { href: "./images/7.jpg", title: "Image 6", description: "Description 6", category: "structural" },
      { href: "./images/8.jpg", title: "Image 7", description: "Description 7", category: "pipes" },
      { href: "./images/9.jpg", title: "Image 8", description: "Description 8", category: "structural" },
      { href: "./images/10.jpg", title: "Image 9", description: "Description 9", category: "pipes" },
      { href: "./images/11.jpg", title: "Image 10", description: "Description 10", category: "structural" },
      { href: "./images/12.jpg", title: "Image 11", description: "Description 11", category: "pipes" },
      { href: "./images/13.jpg", title: "Image 12", description: "Description 12", category: "structural" },
      { href: "./images/14.jpg", title: "Image 13", description: "Description 13", category: "pipes" },
      { href: "./images/15.jpg", title: "Image 14", description: "Description 14", category: "structural" },
      { href: "./images/16.jpg", title: "Image 15", description: "Description 15", category: "pipes" },
  ];

  // Function to generate HTML for gallery items
  function generateGalleryHTML(items) {
      return items.map(item => `
          <a href="${item.href}" class="glightbox" data-gallery="gallery1" data-glightbox="title: ${item.title}; description: ${item.description}" data-category="${item.category}">
              <img src="${item.href}" alt="${item.title}" class="gallery__image" loading="lazy" />
          </a>
      `).join('');
  }

  // Insert gallery items into the container
  const galleryContainer = document.getElementById('gallery-container');
  if (galleryContainer) {
      galleryContainer.innerHTML = generateGalleryHTML(galleryItems);
  }

  // Initialize GLightbox
  const lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
  });

  console.log("GLightbox initialized");

  // Filter functionality
  const filterButtonContainer = document.getElementById("filter-data-btn-container");
  if (filterButtonContainer) {
      const filterButtons = filterButtonContainer.querySelectorAll(".filter-button");
      const galleryElements = document.querySelectorAll(".glightbox");

      filterButtons.forEach((button) => {
          button.addEventListener("click", () => {
              const filter = button.getAttribute("data-filter");

              filterButtons.forEach((btn) => btn.classList.remove("active"));
              button.classList.add("active");

              galleryElements.forEach((item) => {
                  if (filter === "all" || item.dataset.category === filter) {
                      item.style.display = "block";
                  } else {
                      item.style.display = "none";
                  }
              });

              // Refresh GLightbox after filtering
              lightbox.reload();
          });
      });
  }
});