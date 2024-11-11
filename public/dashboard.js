document.addEventListener('DOMContentLoaded', () => {
  displayUserRole();
  loadMessages();
  loadGalleryImages();

  const deleteAllMessagesButton = document.getElementById('deleteAllMessages');
  if (deleteAllMessagesButton) {
    deleteAllMessagesButton.addEventListener('click', deleteAllMessages);
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
      <td data-label="Actions">
        <button 
          onclick="deleteImage('${image._id}')" 
          class="dashboard__button dashboard__button--delete"
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