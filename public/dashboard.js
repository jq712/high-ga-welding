// Hamburger menu functionality
const hamburgerMenu = document.querySelector(".nav__hamburger");
const dropdownMenu = document.querySelector(".nav__dropdown");

if (hamburgerMenu && dropdownMenu) {
  hamburgerMenu.addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("is-active");
    dropdownMenu.classList.toggle("nav__dropdown--visible");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!dropdownMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
      hamburgerMenu.classList.remove("is-active");
      dropdownMenu.classList.remove("nav__dropdown--visible");
    }
  });
}

async function handleLogout() {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
    if (response.ok) {
      window.location.href = '/';
    } else {
      showCustomAlert('Logout failed');
    }
  } catch (error) {
    console.error('Error logging out:', error);
    showCustomAlert('Error logging out');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayUserRole();
  loadMessages();
  loadGalleryImages();

  const deleteAllMessagesButton = document.getElementById('deleteAllMessages');
  if (deleteAllMessagesButton) {
    deleteAllMessagesButton.addEventListener('click', deleteAllMessages);
  }

  if (document.getElementById('allowed-emails')) {
    loadAllowedEmails();
  }
});

async function loadMessages() {
  try {
    const response = await fetch('/api/dashboard/forms', {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to fetch messages');

    const result = await response.json();
    updateMessagesTable(result.data.forms);
  } catch (error) {
    console.error('Error loading messages:', error);
    showCustomAlert('Error loading messages');
  }
}

async function deleteMessage(id) {
  try {
    const response = await fetch(`/api/dashboard/forms/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to delete message');

    showCustomAlert('Message deleted successfully');
    loadMessages();
  } catch (error) {
    console.error('Error deleting message:', error);
    showCustomAlert('Error deleting message');
  }
}

async function deleteAllMessages() {
  if (confirm('Are you sure you want to delete all messages?')) {
    try {
      const response = await fetch('/api/dashboard/forms', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete all messages');

      showCustomAlert('All messages deleted successfully');
      loadMessages();
    } catch (error) {
      console.error('Error deleting all messages:', error);
      showCustomAlert('Error deleting all messages');
    }
  }
}

function updateMessagesTable(messages) {
  const tableBody = document.querySelector("#messagesTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = messages.map(message => `
    <tr>
      <td data-label="Name">${escapeHtml(message.name)}</td>
      <td data-label="Email">${escapeHtml(message.email)}</td>
      <td data-label="Phone">${escapeHtml(message.phone)}</td>
      <td data-label="Message">${escapeHtml(message.message)}</td>
      <td data-label="Date">${formatDate(message.submittedAt)}</td>
      <td data-label="Actions">
        <button 
          onclick="deleteMessage('${message._id}')" 
          class="dashboard__button dashboard__button--delete"
        >
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}

async function displayUserRole() {
  try {
    const userRole = document.getElementById('userRole');
    if (!userRole) return;

    const response = await fetch('/api/current-user', {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to fetch user role');

    const data = await response.json();
    if (data.data && data.data.user) {
      userRole.textContent = `Role: ${data.data.user.role}`;
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
  }
}

async function loadGalleryImages() {
  try {
    const response = await fetch('/api/gallery/images', {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to fetch gallery images');

    const { data: images } = await response.json();
    updateGalleryTable(images);
  } catch (error) {
    console.error('Error loading gallery images:', error);
    showCustomAlert('Error loading gallery images');
  }
}

function updateGalleryTable(images) {
  const galleryContainer = document.querySelector('.dashboard__gallery-container');
  if (!galleryContainer) return;

  galleryContainer.innerHTML = images.map(image => `
    <tr>
      <td data-label="Image">
        <img 
          src="${image.path}" 
          alt="${escapeHtml(image.description)}"
          class="dashboard__thumbnail"
          loading="lazy"
        />
      </td>
      <td data-label="Category" class="dashboard__table-cell">
        ${escapeHtml(image.category)}
      </td>
      <td data-label="Description" class="dashboard__table-cell">
        ${escapeHtml(image.description)}
      </td>
      <td data-label="Actions">
        <button 
          onclick="editImageDescription('${image._id}', '${escapeHtml(image.description)}')" 
          class="btn btn--edit"
        >
          Edit
        </button>
        <button 
          onclick="deleteImage('${image._id}')" 
          class="btn btn--danger"
        >
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}

async function deleteImage(id) {
  if (confirm('Are you sure you want to delete this image?')) {
    try {
      const response = await fetch(`/api/gallery/images/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete image');

      showCustomAlert('Image deleted successfully');
      loadGalleryImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      showCustomAlert('Error deleting image');
    }
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showCustomAlert(message) {
  // Implement your custom alert function here
  alert(message);
}

async function loadAllowedEmails() {
  try {
    const response = await fetch('/api/allowed-emails', {
      credentials: 'include'
    });

    if (!response.ok) throw new Error('Failed to fetch allowed emails');

    const result = await response.json();
    updateAllowedEmailsTable(result.data.allowedEmails);
  } catch (error) {
    console.error('Error loading allowed emails:', error);
    showCustomAlert('Error loading allowed emails');
  }
}

function updateAllowedEmailsTable(emails) {
  const tableBody = document.querySelector("#allowedEmailsTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = emails.map(email => `
    <tr>
      <td data-label="Email">${escapeHtml(email.email)}</td>
      <td data-label="Role">${escapeHtml(email.role)}</td>
      <td data-label="Added At">${formatDate(email.addedAt)}</td>
      <td data-label="Actions">
        <button 
          onclick="editAllowedEmail('${email._id}')" 
          class="btn btn--edit"
        >
          Edit
        </button>
        <button 
          onclick="deleteAllowedEmail('${email._id}')" 
          class="btn btn--danger"
        >
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}

async function deleteAllowedEmail(emailId) {
  if (confirm('Are you sure you want to delete this email?')) {
    try {
      const response = await fetch(`/api/allowed-emails/${emailId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete email');

      showCustomAlert('Email deleted successfully');
      loadAllowedEmails();
    } catch (error) {
      console.error('Error deleting email:', error);
      showCustomAlert('Error deleting email');
    }
  }
}

async function editAllowedEmail(emailId) {
  // Create modal dialog
  const dialog = document.createElement('div');
  dialog.className = 'modal';
  dialog.innerHTML = `
    <div class="modal__content">
      <h3>Edit Allowed Email</h3>
      <div class="modal__form">
        <div class="modal__field">
          <label for="role">Role:</label>
          <select id="role" class="modal__input">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="modal__actions">
          <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
          <button class="btn btn--primary" onclick="saveEmailChanges('${emailId}')">Save</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
}

async function saveEmailChanges(emailId) {
  const role = document.getElementById('role').value;

  try {
    const response = await fetch(`/api/allowed-emails/${emailId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ role })
    });

    if (!response.ok) throw new Error('Failed to update email');

    showCustomAlert('Email updated successfully');
    closeModal();
    loadAllowedEmails();
  } catch (error) {
    console.error('Error updating email:', error);
    showCustomAlert('Error updating email');
  }
}

async function handleEditImage(imageId, currentDescription) {
  // Create a modal dialog instead of using prompt
  const dialog = document.createElement('div');
  dialog.className = 'modal';
  dialog.innerHTML = `
    <div class="modal__content">
      <h3>Edit Image Details</h3>
      <div class="modal__form">
        <div class="modal__field">
          <label for="category">Category:</label>
          <select id="category" class="modal__input">
            <option value="pipes">Pipes</option>
            <option value="structural">Structural</option>
          </select>
        </div>
        <div class="modal__field">
          <label for="description">Description:</label>
          <textarea 
            id="description" 
            class="modal__input"
            rows="3"
          >${currentDescription}</textarea>
        </div>
        <div class="modal__actions">
          <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
          <button class="btn btn--primary" onclick="saveImageChanges('${imageId}')">Save</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
}

function closeModal() {
  const modal = document.querySelector('.modal');
  if (modal) {
    modal.remove();
  }
}

async function saveImageChanges(imageId) {
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value;

  if (!description) {
    showCustomAlert('Description cannot be empty');
    return;
  }

  try {
    const response = await fetch(`/api/gallery/images/${imageId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ 
        description,
        category 
      })
    });

    if (!response.ok) throw new Error('Failed to update image');

    showCustomAlert('Image updated successfully');
    closeModal();
    loadGalleryImages();
  } catch (error) {
    console.error('Error updating image:', error);
    showCustomAlert('Error updating image');
  }
}

document.getElementById('addImageButton')?.addEventListener('click', () => {
    const dialog = document.createElement('div');
    dialog.className = 'modal';
    dialog.innerHTML = `
        <div class="modal__content">
            <h3>Add New Image</h3>
            <div class="modal__form">
                <div class="modal__field">
                    <label for="imageFile">Image File:</label>
                    <input type="file" 
                        id="imageFile" 
                        accept="image/*" 
                        class="modal__input"
                        required
                    />
                </div>
                <div class="modal__field">
                    <label for="category">Category:</label>
                    <select id="category" class="modal__input" required>
                        <option value="pipes">Pipes</option>
                        <option value="structural">Structural</option>
                    </select>
                </div>
                <div class="modal__field">
                    <label for="description">Description:</label>
                    <textarea 
                        id="description" 
                        class="modal__input"
                        rows="3"
                        required
                    ></textarea>
                </div>
                <div class="modal__actions">
                    <button class="btn btn--secondary" onclick="closeModal()">Cancel</button>
                    <button class="btn btn--primary" onclick="uploadImage()">Upload</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
});

async function uploadImage() {
  const fileInput = document.getElementById('imageFile');
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value;
  
  if (!fileInput.files[0] || !description) {
      showCustomAlert('Please fill in all fields');
      return;
  }

  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  formData.append('description', description);
  formData.append('category', category);

  try {
      const response = await fetch('/api/gallery/images', {
          method: 'POST',
          credentials: 'include',
          body: formData // Don't set Content-Type header with FormData
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload image');
      }

      showCustomAlert('Image uploaded successfully');
      closeModal();
      loadGalleryImages();
  } catch (error) {
      console.error('Error uploading image:', error);
      showCustomAlert(error.message);
  }
}