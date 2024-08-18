// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", (event) => {
  // Define your gallery items
  const galleryItems = [
    {
      href: "./images/2.jpg",
      type: "image",
      title: "Image 1",
      description: "Description 1",
      category: "pipes",
    },
    {
      href: "./images/3.jpg",
      type: "image",
      title: "Image 2",
      description: "Description 2",
      category: "structural",
    },
    {
      href: "./images/4.jpg",
      type: "image",
      title: "Image 3",
      description: "Description 3",
      category: "custom",
    },
    {
      href: "./images/5.jpg",
      type: "image",
      title: "Image 4",
      description: "Description 4",
      category: "pipes",
    },
    {
      href: "./images/6.jpg",
      type: "image",
      title: "Image 5",
      description: "Description 5",
      category: "structural",
    },
    {
      href: "./images/7.jpg",
      type: "image",
      title: "Image 6",
      description: "Description 6",
      category: "custom",
    },
    {
      href: "./images/8.jpg",
      type: "image",
      title: "Image 7",
      description: "Description 7",
      category: "pipes",
    },
    {
      href: "./images/9.jpg",
      type: "image",
      title: "Image 8",
      description: "Description 8",
      category: "structural",
    },
    {
      href: "./images/10.jpg",
      type: "image",
      title: "Image 9",
      description: "Description 9",
      category: "custom",
    },
    {
      href: "./images/11.jpg",
      type: "image",
      title: "Image 10",
      description: "Description 10",
      category: "pipes",
    },
    {
      href: "./images/12.jpg",
      type: "image",
      title: "Image 11",
      description: "Description 11",
      category: "structural",
    },
    {
      href: "./images/13.jpg",
      type: "image",
      title: "Image 12",
      description: "Description 12",
      category: "custom",
    },
    {
      href: "./images/14.jpg",
      type: "image",
      title: "Image 13",
      description: "Description 13",
      category: "pipes",
    },
    {
      href: "./images/15.jpg",
      type: "image",
      title: "Image 14",
      description: "Description 14",
      category: "structural",
    },
    {
      href: "./images/16.jpg",
      type: "image",
      title: "Image 15",
      description: "Description 15",
      category: "custom",
    },
  ];

  // Function to generate gallery HTML
  function generateGalleryHTML(items) {
    return items
      .map(
        (item) => `
            <a href="${item.href}" class="glightbox" data-gallery="gallery1" data-category="${item.category}">
                <img src="${item.href}" alt="${item.title}" class="gallery__image" loading="lazy" />
            </a>
        `
      )
      .join("");
  }

  // Generate and insert gallery HTML
  const galleryContainer = document.getElementById("gallery-container");
  if (galleryContainer) {
    galleryContainer.innerHTML = generateGalleryHTML(galleryItems);
  }

  // Initialize GLightbox
  const lightbox = GLightbox({
    selector: ".glightbox",
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
    moreLength: 0,
    slideEffect: "slide",
    prevHtml:
      '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>',
    nextHtml:
      '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M10.59 6L12 7.41 7.83 12 12 16.59 10.59 18l-6-6z"/></svg>',
    touchFollowAxis: true,
    mobileSettings: {
      showCloseButton: true,
      showBars: true,
    },
  });

  // Filter functionality
  const filterButtonContainer = document.getElementById(
    "filter-data-btn-container"
  );
  const filterButtons = filterButtonContainer.querySelectorAll("button");
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

  // Add touch swipe functionality
  let touchstartX = 0;
  let touchendX = 0;

  document.addEventListener("touchstart", (e) => {
    touchstartX = e.changedTouches[0].screenX;
  });

  document.addEventListener("touchend", (e) => {
    touchendX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchendX < touchstartX) lightbox.nextSlide();
    if (touchendX > touchstartX) lightbox.prevSlide();
  }

  // Ensure arrow clicks work on mobile
  document.addEventListener(
    "click",
    (e) => {
      if (e.target.closest(".gnext")) {
        e.preventDefault();
        lightbox.nextSlide();
      }
      if (e.target.closest(".gprev")) {
        e.preventDefault();
        lightbox.prevSlide();
      }
    },
    { passive: false }
  );
});
