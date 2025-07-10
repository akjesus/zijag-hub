const token = localStorage.getItem("token");
const API_URL = "http://127.0.0.1:5000/api/";

if (!token) {
  window.location.href = "admin-login.html"; // Redirect to login if not authenticated
}

document.getElementById("logout-btn").addEventListener("click", function () {
  logoutAdmin();
});

function logoutAdmin() {
  localStorage.removeItem("token"); // Remove stored token
  window.location.href = "/admin-login.html"; // Redirect to login
  console.log(process.env);
}

document.addEventListener("DOMContentLoaded", function () {
  fetchAdminDashboard();
});

function fetchAdminDashboard() {
  if (!token) {
    window.location.href = "/admin-login.html"; // Redirect to login if not authenticated
    return;
  }
  fetch(API_URL + "admin/dashboard", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("income-total").innerHTML =  data.income ? `N${data.income}` + " Received" : "No Income Yet";
      document.getElementById("expense-total").innerHTML = data.expense
        ? `N${data.expense}` + " Paid"
        : "No Expenses Yet";
      document.getElementById("costPrice").innerHTML = data.costPriceTotal 
      ? `N${data.costPriceTotal}` + " Cost Price Total" : "No Cost Price Data";
      document.getElementById("sellingPrice").innerText = data.sellingPriceTotal
        ? `N${data.sellingPriceTotal}` + " Selling Price Total"
        : "No Selling Price Data";
      document.getElementById("business_name").innerHTML= data.business_name;
    })
    .catch((error) => console.error("Error loading dashboard:", error));
}

$(document).ready(function () {
  // Load Dashboard by default
  loadPage("dashboard");

  // Handle Sidebar Clicks for Page Navigation
  $(".load-page").click(function (e) {
    e.preventDefault();
    const page = $(this).data("page");
    loadPage(page);
  });
});

// Function to Load Pages with AJAX
function loadPage(page) {
  $("#main-content").html("<p class='text-center'>Loading...</p>"); // Show loading text
  $.ajax({
    url: `/pages/${page}.html`,
    method: "GET",
    success: function (data) {
      $("#main-content").html(data);
    },
    error: function () {
      $("#main-content").html(
        "<p class='text-danger'>Failed to load page.</p>"
      );
    },
  });
}

// Open Modals for Create/Edit
$(document).on("click", ".open-modal", function () {
  const modalTitle = $(this).data("title");
  const modalUrl = $(this).data("url");

  $("#modalLabel").text(modalTitle); // Set modal title
  $("#modal-body").html("<p class='text-center'>Loading...</p>"); // Show loading text
  $("#adminModal").modal("show"); // Open modal

  $.ajax({
    url: modalUrl,
    method: "GET",
    success: function (data) {
      $("#modal-body").html(data);
    },
    error: function () {
      $("#modal-body").html(
        "<p class='text-danger'>Failed to load content.</p>"
      );
    },
  });
});
