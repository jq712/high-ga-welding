document.addEventListener("DOMContentLoaded", function() {
  // Array of gallery items
  const galleryItems = [
      { href: "./images/2.jpg", title: "Precision Stainless Steel Pipefitting", description: "High-quality stainless steel pipefitting showcasing our expertise in precision manufacturing for industrial applications.", category: "pipes" },
      { href: "./images/3.jpg", title: "Certified Welder on Industrial Gas Line", description: "A skilled certified welder meticulously working on an industrial gas line, demonstrating our commitment to quality and safety. This welding project passed all rigorous quality tests, ensuring the highest standards of reliability for critical infrastructure.", category: "pipes" },
      { href: "./images/4.jpg", title: "Pipe Cutting for Tie-In", description: "Carefully cutting into an existing water-filled pipeline to prepare for a tie-in, showcasing our expertise in handling complex plumbing modifications while maintaining system integrity.", category: "pipes" },
      { href: "./images/5.jpg", title: "Reducing Flanges on Stainless Steel Pipe", description: "Reducing flanges installed on a stainless steel pipe, showcasing our expertise in custom pipefitting solutions for industrial applications.", category: "pipes" },
      { href: "./images/6.jpg", title: "Stainless Steel Pipe Weld", description: "A close-up view of a high-quality stainless steel weld on a pipe, showcasing our precision welding techniques and attention to detail in industrial pipework.", category: "pipes" },
      { href: "./images/7.jpg", title: "Stainless Steel Pipe Weld", description: "A close-up view of a high-quality stainless steel weld on a pipe, showcasing our precision welding techniques and attention to detail in industrial pipework.", category: "pipes" },
      { href: "./images/8.jpg", title: "Stainless Steel Pipe Weld", description: "A close-up view of a high-quality stainless steel weld on a pipe, showcasing our precision welding techniques and attention to detail in industrial pipework.", category: "pipes" },
      { href: "./images/9.jpg", title: "Stainless Steel pipe Assembly", description: "A complex stainless steel assembly featuring a flange welded to two reducers and a 90-degree elbow, showcasing our precision welding and pipefitting expertise in creating custom industrial components.", category: "pipes" },
      { href: "./images/10.jpg", title: "Stainless Steel pipe Assembly", description: "A complex stainless steel assembly featuring a flange welded to two reducers and a 90-degree elbow, showcasing our precision welding and pipefitting expertise in creating custom industrial components.", category: "pipes" },
      { href: "./images/11.jpg", title: "Stainless Steel pipe Assembly", description: "A complex stainless steel assembly featuring a flange welded to two reducers and a 90-degree elbow, showcasing our precision welding and pipefitting expertise in creating custom industrial components.", category: "pipes" },
      { href: "./images/12.jpg", title: "Certified Welder Performing Position Weld", description: "A skilled certified welder executing a precise position weld on stainless steel pipe, demonstrating our expertise in specialized welding techniques for critical industrial applications.", category: "pipes" },
      { href: "./images/13.jpg", title: "Certified Welder Performing Position Weld on Gas Line", description: "A skilled certified welder executing a precise position weld on a gas line, demonstrating our expertise in specialized welding techniques for critical industrial applications.", category: "pipes" },
      { href: "./images/14.jpg", title: "Certified Welder Performing Position Weld", description: "A skilled certified welder executing a precise position weld on stainless steel pipe, demonstrating our expertise in specialized welding techniques for critical industrial applications.", category: "pipes" },
      { href: "./images/15.jpg", title: "Certified Welder Performing Position Weld", description: "A skilled certified welder executing a precise position weld on stainless steel pipe, demonstrating our expertise in specialized welding techniques for critical industrial applications.", category: "pipes" },
      { href: "./images/17.jpg", title: "Worker Installing Vertical Run of Pipe", description: "A skilled worker carefully installing a vertical run of pipe, demonstrating our proficiency in complex pipefitting and installation for industrial projects.", category: "pipes" },
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