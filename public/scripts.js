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

// Generic form submission handler
async function handleFormSubmit(event, formId, apiEndpoint) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
      form.reset();
      alert("Form submitted successfully!");
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
      alert("An error occurred. Please try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
}

// In your client-side JavaScript file
async function handleLogin(event) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value;

  try {
    console.log("Attempting login for:", email);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    console.log("Login response status:", response.status);
    if (response.ok) {
      const data = await response.json();
      console.log("Login successful:", data);
      window.location.href = "/dashboard";
    } else if (response.status === 401) {
      console.log("Authentication failed, redirecting to login");
      window.location.href = "/login";
    } else {
      const errorData = await response.json();
      console.error("Login failed:", errorData);
      alert(errorData.message || "Login failed. Please try again.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An unexpected error occurred. Please try again.");
  }
}

// Handle logout
function handleLogout() {
  fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        window.location.href = "/login.html";
      } else {
        throw new Error("Logout failed");
      }
    })
    .catch((error) => {
      console.error("Logout error:", error);
      alert("An error occurred during logout. Please try again.");
    });
}

// Fetch messages for dashboard
async function fetchMessages() {
  try {
    const response = await fetch("/api/dashboard/messages");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched messages data:", data);
    if (Array.isArray(data.data.messages)) {
      return data.data.messages;
    }
    return [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

// Update messages table in dashboard
function updateMessagesTable(messages) {
  const tableBody = document.querySelector("#messagesTable tbody");
  if (!tableBody) {
    console.error("Messages table body not found");
    return;
  }

  console.log("Updating messages table with:", messages);

  if (!Array.isArray(messages)) {
    console.error("Messages is not an array:", messages);
    return;
  }

  tableBody.innerHTML = "";
  messages.forEach((message) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${message.name || ""}</td>
      <td>${message.email || ""}</td>
      <td>${message.message || ""}</td>
      <td>${
        message.createdAt ? new Date(message.createdAt).toLocaleString() : ""
      }</td>
      <td>
      <button class="dashboard__button dashboard__button--delete delete-message" data-id="${
        message._id || ""
      }">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Fetch allowed emails for dashboard
async function fetchAllowedEmails() {
  try {
    const response = await fetch("/api/dashboard/allowed-emails");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Fetched allowed emails data:", data);
    return Array.isArray(data.data.allowedEmails)
      ? data.data.allowedEmails
      : [];
  } catch (error) {
    console.error("Error fetching allowed emails:", error);
    return [];
  }
}

// Update allowed emails table in dashboard
function updateAllowedEmailsTable(emails) {
  const tableBody = document.querySelector("#allowedEmailsTable tbody");
  if (!tableBody) {
    console.error("Allowed emails table body not found");
    return;
  }

  console.log("Updating allowed emails table with:", emails);

  if (!Array.isArray(emails)) {
    console.error("Emails is not an array:", emails);
    return;
  }

  tableBody.innerHTML = "";
  emails.forEach((email) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${email.email || ""}</td>
      <td>${email.addedAt ? new Date(email.addedAt).toLocaleString() : ""}</td>
      <td>
 <button class="dashboard__button dashboard__button--delete delete-email" data-id="${
   email._id || ""
 }">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Load messages for dashboard
async function loadMessages() {
  const messages = await fetchMessages();
  updateMessagesTable(messages);
}

// Load allowed emails for dashboard
async function loadAllowedEmails() {
  const emails = await fetchAllowedEmails();
  updateAllowedEmailsTable(emails);
}

// Delete a single message
async function deleteMessage(messageId) {
  try {
    const response = await fetch(`/api/dashboard/messages/${messageId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

// Delete all messages
async function deleteAllMessages() {
  try {
    const response = await fetch("/api/dashboard/messages", {
      method: "DELETE",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting all messages:", error);
    throw error;
  }
}

// Delete an allowed email
async function deleteAllowedEmail(emailId) {
  try {
    const response = await fetch(`/api/dashboard/allowed-emails/${emailId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error deleting allowed email:", error);
    throw error;
  }
}

// Add a new allowed email
async function addAllowedEmail(email) {
  try {
    const response = await fetch("/api/dashboard/allowed-emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding allowed email:", error);
    throw error;
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // Contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleFormSubmit(event, "contactForm", "/api/forms/");
    });
  }

  // Login form submission
  const loginForm = document.querySelector(".login__form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // Dashboard functionality
  if (window.location.pathname === "/dashboard") {
    if (document.getElementById("messagesTable")) {
      console.log("Messages table found, loading messages");
      loadMessages();

      // Use event delegation for delete message buttons
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
    } else {
      console.log("Messages table not found on this page");
    }

    if (document.getElementById("allowedEmailsTable")) {
      console.log("Allowed emails table found, loading emails");
      loadAllowedEmails();

      // Use event delegation for delete email buttons
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
    } else {
      console.log("Allowed emails table not found on this page");
    }

    // Add email form submission
    const addEmailForm = document.querySelector("#addEmailForm");
    if (addEmailForm) {
      addEmailForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const emailInput = document.querySelector("#newEmail");
        const email = emailInput.value.trim();
        if (email) {
          try {
            await addAllowedEmail(email);
            emailInput.value = "";
            await loadAllowedEmails();
          } catch (error) {
            console.error("Failed to add email:", error);
          }
        }
      });
    }

    // Delete all messages button
    const deleteAllMessagesButton =
      document.getElementById("deleteAllMessages");
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
  }

  // Logout button
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
});
