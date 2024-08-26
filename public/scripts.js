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

// API helper
const apiCall = async (url, method = 'GET', data = null) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  };
  if (data) options.body = JSON.stringify(data);
  const response = await fetch(url, options);
  if (!response.ok) {
    console.error(`API call failed: ${method} ${url}`, response);
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// UI components
function showCustomAlert(message, onConfirm) {
  console.log('Showing custom alert:', message);
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    background-color: black;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  `;

  const text = document.createElement('p');
  text.textContent = message;

  const button = document.createElement('button');
  button.textContent = onConfirm ? 'Continue to Login' : 'OK';
  button.style.cssText = `
    margin-top: 10px;
    padding: 5px 10px;
    cursor: pointer;
  `;
  button.onclick = () => {
    document.body.removeChild(modal);
    if (onConfirm) onConfirm();
  };

  content.appendChild(text);
  content.appendChild(button);
  modal.appendChild(content);
  document.body.appendChild(modal);
  console.log('Custom alert created and appended to body');
}

// Event handlers
async function handleFormSubmit(event, formId, apiEndpoint) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const result = await apiCall(apiEndpoint, 'POST', data);
    console.log("Success:", result);
    form.reset();
    showCustomAlert("Form submitted successfully!");
  } catch (error) {
    console.error("Error:", error);
    showCustomAlert(error.message || "An error occurred. Please try again.");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  try {
    const data = await apiCall('/api/auth/login', 'POST', { email, password });
    console.log('Login successful');
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Login failed:', error.message);
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
    const data = await apiCall('/api/auth/register', 'POST', { email, password });
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
    await apiCall("/api/auth/logout", "POST");
    window.location.href = "/login.html";
  } catch (error) {
    console.error("Logout error:", error);
    showCustomAlert("An error occurred during logout. Please try again.");
  }
}

// Dashboard functions
async function loadMessages() {
  try {
    const response = await apiCall("/api/dashboard/messages");
    if (response.status === "success" && response.data && response.data.messages) {
      updateMessagesTable(response.data.messages);
    } else {
      console.error("Unexpected response format:", response);
      showCustomAlert("Failed to load messages. Unexpected response format.");
    }
  } catch (error) {
    console.error("Error loading messages:", error);
    showCustomAlert("Failed to load messages. Please try again.");
  }
}

async function loadAllowedEmails() {
  const data = await apiCall('/api/dashboard/allowed-emails');
  updateAllowedEmailsTable(data.data.allowedEmails);
}

async function deleteMessage(messageId) {
  await apiCall(`/api/dashboard/messages/${messageId}`, "DELETE");
}

async function deleteAllMessages() {
  await apiCall("/api/dashboard/messages", "DELETE");
}

async function deleteAllowedEmail(emailId) {
  try {
    const response = await apiCall(`/api/dashboard/allowed-emails/${emailId}`, "DELETE");
    if (!response) {
      throw new Error('Empty response received');
    }
    return response;
  } catch (error) {
    console.error('Error in deleteAllowedEmail:', error);
    throw error;
  }
}

async function addAllowedEmail(email, role) {
  await apiCall("/api/dashboard/allowed-emails", "POST", { email, role });
}

// Update messages table in dashboard
function updateMessagesTable(messages) {
  const tableBody = document.querySelector("#messagesTable tbody");
  if (!tableBody) {
    console.error("Messages table body not found");
    return;
  }

  tableBody.innerHTML = "";
  messages.forEach((message) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${message.name || ""}</td>
      <td>${message.email || ""}</td>
      <td>${message.phone || ""}</td>
      <td>${message.message || ""}</td>
      <td>${message.submittedAt ? new Date(message.submittedAt).toLocaleString() : ""}</td>
      <td>
        <button class="dashboard__button dashboard__button--delete delete-message" data-id="${message._id || ""}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
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
      <td>${email.email || ""}</td>
      <td>${email.role || "N/A"}</td>
      <td>${email.addedAt ? new Date(email.addedAt).toLocaleString() : ""}</td>
      <td>
        <button class="dashboard__button dashboard__button--delete delete-email" data-id="${email._id || ""}">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => handleFormSubmit(event, "contactForm", "/api/forms/"));
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
                showCustomAlert(`Failed to delete email: ${error.message}`);
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
        try {
          await addAllowedEmail(email, role);
          await loadAllowedEmails();
          document.getElementById('newEmail').value = '';
          document.getElementById('newRole').value = 'user';
        } catch (error) {
          console.error('Error adding allowed email:', error);
          alert('An error occurred while adding the email.');
        }
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
  }
});