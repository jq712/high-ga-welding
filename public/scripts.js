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
    const response = await fetch('/api/submit-form', {
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
    const response = await fetch('/auth/login', {
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
    window.location.href = '/auth/dashboard';
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
      window.location.href = '/login';
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

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const formObject = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/submit-form', {
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

