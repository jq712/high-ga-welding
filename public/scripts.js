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

// UI components
function showCustomAlert(message) {
  const alertElement = document.createElement('div');
  alertElement.className = 'custom-alert';
  alertElement.textContent = message;
  document.body.appendChild(alertElement);
  setTimeout(() => {
    alertElement.remove();
  }, 3000);
}

// Event handlers
async function handleFormSubmit(event, formId, apiEndpoint) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    form.reset();
    showCustomAlert("Form submitted successfully!");
  } catch (error) {
    showCustomAlert(error.message || "An error occurred. Please try again.");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    window.location.href = '/allowed-emails';
  } catch (error) {
    showCustomAlert(error.message);
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.querySelector('#email').value;
  const password = form.querySelector('#password').value;
  const confirmPassword = form.querySelector('#confirm-password').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === 'success') {
      alert('Registration successful! Please log in.');
      window.location.href = './login.html';
    } else {
      alert(data.message || 'Registration failed. Please try again.');
    }
  } catch (error) {
    alert(`An error occurred during registration: ${error.message}. Please try again.`);
  }
}

function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password");
  const toggleButton = document.querySelector(".login__password-toggle");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  toggleButton.textContent = passwordInput.type === "password" ? "👀" : "🙈";
}

async function handleLogout() {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    window.location.href = "/login.html";
  } catch (error) {
    showCustomAlert("An error occurred during logout. Please try again.");
  }
}

// Dashboard functions
async function loadMessages() {
  try {
    const response = await fetch("/api/dashboard/messages", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.status === "success" && Array.isArray(data.data.messages)) {
      updateMessagesTable(data.data.messages);
    } else {
      updateMessagesTable([]);
    }
  } catch (error) {
    showCustomAlert("Error loading messages");
    updateMessagesTable([]);
  }
}

async function loadAllowedEmails() {
  console.log("Loading allowed emails...");
  try {
    const response = await fetch('/api/dashboard/allowed-emails', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Allowed emails data:", data);
    if (data && data.status === "success" && Array.isArray(data.data.allowedEmails)) {
      updateAllowedEmailsTable(data.data.allowedEmails);
    } else {
      updateAllowedEmailsTable([]);
    }
  } catch (error) {
    console.error("Error loading allowed emails:", error);
    showCustomAlert("Error loading allowed emails");
    updateAllowedEmailsTable([]);
  }
}

async function deleteMessage(messageId) {
  try {
    const response = await fetch(`/api/dashboard/messages/${messageId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await loadMessages();
    showCustomAlert("Message deleted successfully");
  } catch (error) {
    showCustomAlert(`Failed to delete message: ${error.message}`);
  }
}

async function deleteAllMessages() {
  try {
    const response = await fetch('/api/dashboard/messages', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete messages');
    }

    const result = await response.json();
    console.log(result.message);
    loadMessages(); // Refresh the messages list
  } catch (error) {
    console.error('Error deleting messages:', error);
    showCustomAlert('Failed to delete messages. Please try again.');
  }
}
async function deleteAllowedEmail(emailId) {
  try {
    const response = await fetch(`/api/dashboard/allowed-emails/${emailId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await loadAllowedEmails();
    showCustomAlert("Email deleted successfully");
  } catch (error) {
    showCustomAlert(`Failed to delete email: ${error.message}`);
  }
}

async function addAllowedEmail(email, role) {
  console.log("Adding allowed email:", email, role);
  try {
    const response = await fetch("/api/dashboard/allowed-emails", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, role }),
      credentials: 'include'
    });

    const responseData = await response.json();
    console.log("Server response:", responseData);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${responseData.message || 'Unknown error'}`);
    }

    await loadAllowedEmails();
    showCustomAlert("Email added successfully");
    document.getElementById('newEmail').value = '';
    document.getElementById('newRole').value = 'user';
  } catch (error) {
    console.error("Error adding email:", error);
    showCustomAlert(`Failed to add email: ${error.message}`);
  }
}

// Update messages table in dashboard
function updateMessagesTable(messages) {
  const tableBody = document.querySelector("#messagesTable tbody");
  if (!tableBody) return;

  tableBody.innerHTML = "";
  messages.forEach((message) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Name">${escapeHtml(message.name)}</td>
      <td data-label="Email">${escapeHtml(message.email)}</td>
      <td data-label="Phone">${escapeHtml(message.phone)}</td>
      <td data-label="Message">${escapeHtml(message.message)}</td>
      <td data-label="Date">${formatDate(message.created_at)}</td>
      <td data-label="Actions">
        <button class="dashboard__button dashboard__button--delete" data-message-id="${message._id}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Add event listener for delete buttons
  tableBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('dashboard__button--delete')) {
      const messageId = event.target.getAttribute('data-message-id');
      if (messageId) {
        confirmAndDeleteMessage(messageId);
      }
    }
  });
}

async function confirmAndDeleteMessage(messageId) {
  const confirmed = confirm("Are you sure you want to delete this message?");
  if (confirmed) {
    await deleteMessage(messageId);
  }
}

// Update allowed emails table in dashboard
function updateAllowedEmailsTable(emails) {
  const tableBody = document.querySelector("#allowedEmailsTable tbody");
  if (!tableBody) {
    console.error("Allowed emails table body not found");
    return;
  }

  tableBody.innerHTML = "";
  emails.forEach((email) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Email">${escapeHtml(email.email)}</td>
      <td data-label="Role">${escapeHtml(email.role)}</td>
      <td data-label="Added At">${formatDate(email.addedAt)}</td>
      <td data-label="Actions">
        <button class="dashboard__button dashboard__button--delete" onclick="deleteAllowedEmail('${email._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const formObject = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/forms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formObject),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          showCustomAlert('Message sent successfully!');
          contactForm.reset();
        } else {
          throw new Error(result.message || 'An error occurred');
        }
      } catch (error) {
        console.error('Error:', error);
        showCustomAlert(`Failed to send message: ${error.message}`);
      }
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
    const toggleButton = document.querySelector(".login__password-toggle");
    if (toggleButton) {
      toggleButton.addEventListener("click", togglePasswordVisibility);
    }
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  if (window.location.pathname === "/dashboard") {
    if (document.getElementById("messagesTable")) {
      loadMessages();
      const messagesTable = document.getElementById("messagesTable");
      if (messagesTable) {
        messagesTable.addEventListener("click", async (event) => {
          if (event.target.classList.contains("delete-message")) {
            const messageId = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this message?")) {
              try {
                await deleteMessage(messageId);
                await loadMessages();
              } catch (error) {
                console.error("Failed to delete message:", error);
              }
            }
          }
        });
      }
    }

    if (document.getElementById("allowedEmailsTable")) {
      loadAllowedEmails();
      const allowedEmailsTable = document.getElementById("allowedEmailsTable");
      if (allowedEmailsTable) {
        allowedEmailsTable.addEventListener("click", async (event) => {
          if (event.target.classList.contains("delete-email")) {
            const emailId = event.target.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this email?")) {
              try {
                await deleteAllowedEmail(emailId);
                await loadAllowedEmails();
              } catch (error) {
                console.error("Failed to delete email:", error);
              }
            }
          }
        });
      }
    }

    const addEmailForm = document.getElementById('addEmailForm');
    if (addEmailForm) {
      addEmailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('newEmail').value;
        const role = document.getElementById('newRole').value;
        await addAllowedEmail(email, role);
      });
    }

    const deleteAllMessagesButton = document.getElementById("deleteAllMessages");
    if (deleteAllMessagesButton) {
      deleteAllMessagesButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete all messages?")) {
          try {
            await deleteAllMessages();
            await loadMessages();
          } catch (error) {
            console.error("Failed to delete all messages:", error);
          }
        }
      });
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", handleLogout);
    }
  } else if (window.location.pathname === "/allowed-emails.html" || window.location.pathname === "/allowed-emails") {
    initAllowedEmailsPage();
  }
});

// Add this function at the beginning of your file or before it's used
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Add this function to handle loading of the allowed emails page
function initAllowedEmailsPage() {
  loadAllowedEmails();
  
  const addEmailForm = document.getElementById('addEmailForm');
  if (addEmailForm) {
    addEmailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('newEmail').value;
      const role = document.getElementById('newRole').value;
      await addAllowedEmail(email, role);
    });
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
}