var dataTable;
var globalData;
function startLoading() {
  $("#loaderOverlay").fadeIn();
}
// Hide the loader with fadeOut effect
function stopLoading() {
  $("#loaderOverlay").fadeOut();
}
var $publisherDropdown = $("#publisherName");
allusers.forEach((user) => {
  const option = $("<option></option>") // Create a new option
    .attr("value", user.name) // Set the value as user ID
    .text(user.name); // Set the text as user name
  $publisherDropdown.append(option); // Append the option to the dropdown
});
$("#publisherName").chosen();
// $("#quater").chosen()
// $(".chosen-select").chosen({
//   width: "200px", // Set dropdown width
//   max_selected_options: 1 // Allow only one selection
// });

// // Refresh Chosen dropdown in case of dynamic changes
// $(".chosen-select").trigger("chosen:updated");
const user = JSON.parse(localStorage.getItem("loggedInUser"));
console.log("user>", user);
if (!user) {
  $.notify("Cannot find user detail Please log in again", "error");
  setTimeout(() => {
    window.location.href = "http://localhost:5000/index.html";
  }, 2000);
}

function getallarticle() {
  startLoading();
  $.ajax({
    url: "/api/articles",
    method: "GET",
    success: function (allData) {
      stopLoading();
      $("#tags").chosen();
      globalData = allData.articles;
      drawtable(allData.articles);
      // You can also render the articles in your datatable here
      const tagSet = allData.uniqueTags;
      $("#tags").empty();
      $("#tags").trigger("chosen:updated");
      var option = "";
      tagSet.forEach((tag) => {
        option += `<option value=${tag}>${tag}</option>`;
      });
      $("#tags").append(option); // Add the new option to the select
      $("#tags").trigger("chosen:updated"); // Update Chosen to reflect changes

      // $("#tags .chosen-select").chosen({ width: "200px" });
      $(".chosen-select").chosen({
        width: "200px", // Set dropdown width
        max_selected_options: 1, // Allow only one selection
      });
      $(".chosen-select").trigger("chosen:updated");
    },
    error: function (error) {
      console.log("Error fetching articles", error);
      $.notify("Error fetching articles please try again", "error");
      stopLoading();
    },
  });
}
function drawtable(tableData) {
  if ($.fn.dataTable.isDataTable("#myTable")) {
    $("#myTable").DataTable().destroy(); // Destroy the existing instance
  }

  dataTable = new DataTable("#myTable", {
    data: tableData,
    width: 100,
    columns: [
      // {
      //   className: "dt-control",
      //   orderable: false,
      //   data: null,
      //   defaultContent: "",
      // },
      { data: "subject", width: "20%" },
      { data: "" },
      { data: "", width: "20%" },
      { data: "createdOn" },
      { data: "publisherName" },
      { data: "isCJA" },
      { data: "articleURL", visible: false },
      { data: "publicationScope" },
      { data: "", className: "status", visible: user[0].role == "Contributor" },
      {
        data: "",
        className: "leadaction",
        visible: user[0].role == "Admin",
        width: "12%",
      },
      { data: "uuid", visible: false },
    ],
    columnDefs: [
      {
        targets: 1,
        render: function (data, type, row, meta) {
          return `<span class='url' style='color:blue;text-decoration:underline;cursor:pointer' data-articleurl=${row.articleURL}>Link</span>`;
        },
      },
      {
        targets: 2,
        render: function (data, type, row, meta) {
          if (row.tag != undefined) {
            //console.log(row,row.tag,row.tag.length)
            if (row.tag.length > 0) {
              let html = "";
              row.tag.forEach((item) => {
                html += `<p class='tags'>${item}</p>`;
              });
              return html;
            } else {
              return `-`;
            }
          }
        },
      },
      {
        targets: 3,
        render: function (data, type, row, meta) {
          function convertISOToMMDDYYYY(isoString) {
            const date = new Date(isoString);

            const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
            const day = String(date.getUTCDate()).padStart(2, "0");
            const year = date.getUTCFullYear();

            return `${month}/${day}/${year}`;
          }

          const formattedDate = convertISOToMMDDYYYY(row.createdOn);
          console.log(formattedDate);

          return `<p>${formattedDate}</p>`;
        },
      },
      {
        targets: 8,
        render: function (data, type, row, meta) {
          console.log(row);
          let html = "";
          if (!row.status || row.status == "NA") {
            html = `
             <span class="action-button"><i class="fa-solid fa-hourglass-start" style='color:black;margin:5px' title='Action will be taken by leads'></i></span>`;
          } else if (row.status == "Approved") {
            html = `<span class='action-button approved' title="Approved by Leads: ${row.statusDescription}"><i class="fa-solid fa-circle-check" style='color:#075fec;margin:5px'></i></span>`;
          } else if (row.status == "Rejected") {
            html = `
             <span class='action-button' title="Rejected by Leads: ${row.statusDescription}"><i class="fa-solid fa-ban" style="color:red; margin:5px"></i>  </span>`;
          } else if (row.status == "SentBack") {
            html = `
               <span class='resubmit' data-uuid=${row.uuid} title="Sent back: ${row.statusDescription}">Resubmit</span>`;
          }
          return html;
        },
      },

      {
        targets: 9,
        render: function (data, type, row, meta) {
          console.log(row);
          let html = "";
          if (!row.status || row.status == "NA") {
            html = `
             <span class="action-button approve" data-uuid=${row.uuid}><i class="fa-solid fa-thumbs-up" ></i></span><span data-uuid=${row.uuid} class='action-button reject'><i class="fa-solid fa-thumbs-down"></i></span> <span class='action-button sentback'  data-uuid=${row.uuid} style="background-color:#3434da"><i class="fa-solid fa-repeat" title="Send back for correction"></i></span>`;
          } else if (row.status == "Approved") {
            html = `<span class='action-button approved' title="Approved by Leads: ${row.statusDescription}"><i class="fa-solid fa-circle-check" style='color:#075fec;margin:5px'></i></span>`;
          } else if (row.status == "Rejected") {
            html = `
             <span class='action-button deleteme delete-article'  data-uuid=${row.uuid}><i class="fa-solid fa-trash-can" style="color:red; margin:5px"  title="Rejected by Leads: ${row.statusDescription}"></i></span>`;
          } else if (row.status == "SentBack") {
            html = `
             <span class='action-button sentback'  data-uuid=${row.uuid}><i class="fa-solid fa-repeat" style="color:; margin:5px"  title="Send back"></i></span>`;
          }

          return html;
        },
      },

      {
        defaultContent: "-",
        targets: "_all",
      },
    ],
  });

  function openModal() {
    document.getElementById("modalOverlay").style.display = "flex";
  }

  // Close the modal
  let delid = "";
  function confirmDelete() {
    document.getElementById("modalOverlay").style.display = "none";
    $.ajax({
      url: `/api/articles/${delid}`,
      type: "DELETE",
      success: function (response) {
        $.notify("Article has deleted sucessfully", "success");
      },
      error: function (xhr, status, error) {
        $.notify(error, "error");
      },
    });
  }
  $(".btn-yes")
    .off()
    .on("click", function () {
      confirmDelete();
    });
  $(".btn-no")
    .off()
    .on("click", function () {
      document.getElementById("modalOverlay").style.display = "none";
    });

  let uuid = "";
  let status = "";

  $("#myTable tbody")
    .off("click", ".approve")
    .on("click", ".approve", function () {
      $(".popupDiv").show();
      status = "Approved";
      $(".publicationScopeDiv").show();
      uuid = $(this).data("uuid");
    });
  $("#myTable tbody")
    .off("click", ".sentback")
    .on("click", ".sentback", function () {
      $(".popupDiv").show();
      status = "SentBack";
      $(".publicationScopeDiv").show();
      uuid = $(this).data("uuid");
    });
  $("#myTable tbody")
    .off("click", ".url")
    .on("click", ".url", function () {
      console.log("test");
      let url = $(this).data("articleurl");
      console.log("url", url);
      window.open(url, "_blank");
    });

  // Reject button click handler
  $("#myTable tbody")
    .off("click", ".reject")
    .on("click", ".reject", function () {
      $(".popupDiv").show();
      status = "Rejected";
      $(".publicationScopeDiv").hide();
      uuid = $(this).data("uuid");
    });

  // Delete button click handler
  $("#myTable tbody")
    .off("click", ".deleteme")
    .on("click", ".deleteme", function () {
      openModal();
      delid = $(this).data("uuid"); // UUID for deletion
    });

  $(".submitComment")
    .off()
    .on("click", function (e) {
      e.preventDefault();
      let comment = $(".comment").val();
      let publicationScope = $(".publicationScope").val();
      updateArticleStatus(uuid, status, comment, publicationScope);
    });

  $(".closeComment").click(function () {
    $(".popupDiv").hide();
    $(".comment").val("");
  });
  dataTable.off("click").on("click", "td.dt-control", function (e) {
    e.stopPropagation();
    let tr = e.target.closest("tr");
    let row = dataTable.row(tr);

    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
    } else {
      // Open this row
      row.child(format(row.data())).show();
      $(".link").on("click", function () {
        window.open($(this).text());
      });
    }
  });
}
// function format(d) {
//   // `d` is the original data object for the row
//   return (
//     "<dl>" +
//     '<dt style="display: inline-block; font-weight:600">Article URL:</dt>' +
//     '<dd style="display: inline-block" >' +
//     '<a class="link">' +
//     d.articleURL +
//     "</a>" +
//     "</dd>" +
//     "</dl>"
//   );
// }

$("#toggleToolbar").on("click", function () {
  if ($("#secondary-toolbar").is(":visible")) {
    $("#secondary-toolbar").hide();
  } else {
    $("#secondary-toolbar").show();
  }
});

$("#filter").click(function () {
  const selectedQuarters = $("#quater").val(); // Get selected quarters
  const selectedCreatedBy = $("#publisherName").val(); // Get selected creators
  const selectedTags = $("#tags").val(); // Get selected tags

  $.ajax({
    url: "/api/filter-articles",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      quarters: selectedQuarters,
      createdBy: selectedCreatedBy,
      tags: selectedTags,
    }),
    success: function (filteredArticles) {
      drawtable(filteredArticles);
    },
    error: function (error) {
      console.log("Error fetching filtered articles", error);
      $.notify("Error fetching filtered articles", "error");
    },
  });
});

function updateArticleStatus(
  uuid,
  status,
  statusDescription,
  publicationScope
) {
  $.ajax({
    url: `/api/update-article`, // API endpoint with base URL
    type: "POST",
    contentType: "application/json", // Set content type to JSON
    data: JSON.stringify({
      // Send data as JSON
      status: status,
      statusDescription: statusDescription,
      uuid: uuid,
      publicationScope: publicationScope,
    }),
    success: function (response) {
      // Handle success
      $.notify("Article status updated successfully", "success");
      $(".popupDiv").hide();
      $(".comment").val();
      //alert('Article status updated to: ' + status);
    },
    error: function (xhr, status, error) {
      // Handle error
      console.error("Error updating article:", error);
      $.notify("Error updating article:" + error, "error");
      // alert('Failed to update article status: ' + error);
    },
  });
}

$("#userButton").click(function (e) {
  // Check if user data is already stored in localStorage
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (storedUser) {
    // Set the content of the tooltip with HTML
    const userDetails = `
          <strong style='color:#6e5494'>Username:</strong> ${storedUser[0].name}<br>
          <strong  style='color:#6e5494'>Role:</strong> ${storedUser[0].role}<br>
          <strong  style='color:#6e5494'>Email:</strong> ${storedUser[0].ldap}<br>
          <button class="logout-button" id="logoutButton" style='float:right'>Logout  <i class="fa-solid fa-right-from-bracket"></i></button>
      `;
    $("#userTooltip").html(userDetails);
    $("#logoutButton")
      .off()
      .on("click", function () {
        console.log("testtt??");
        localStorage.removeItem("loggedInUser");
        window.location.href = "http://localhost:5000/index.html";
      });
    // Position the tooltip near the button
    const buttonOffset = $(this).offset();
    const buttonWidth = $(this).outerWidth();
    const tooltipWidth = $("#userTooltip").outerWidth();
    const tooltipHeight = $("#userTooltip").outerHeight();

    let tooltipLeft = buttonOffset.left + buttonWidth / 2 - tooltipWidth / 2;
    let tooltipTop = buttonOffset.top + 40; // 40px below the button

    // Prevent the tooltip from going off the right side of the screen
    if (tooltipLeft + tooltipWidth > $(window).width()) {
      tooltipLeft = $(window).width() - tooltipWidth - 10; // 10px margin from the edge
    }

    // Prevent the tooltip from going off the left side of the screen
    if (tooltipLeft < 0) {
      tooltipLeft = 10; // 10px margin from the left edge
    }

    // Prevent the tooltip from going off the bottom of the screen
    if (tooltipTop + tooltipHeight > $(window).height()) {
      tooltipTop = $(window).height() - tooltipHeight - 10; // 10px margin from the bottom
    }

    // Show the tooltip
    $("#userTooltip")
      .css({
        top: tooltipTop,
        left: tooltipLeft,
      })
      .fadeIn();
  } else {
    alert("No user data found. Please log in.");
  }
});

// Hide the tooltip when clicked outside
$(document).click(function (e) {
  if (!$(e.target).closest("#userButton, #userTooltip").length) {
    $("#userTooltip").fadeOut();
  }
});

getallarticle();
window.getallarticle = getallarticle;
window.drawtable = drawtable;
window.stopLoading = stopLoading;
window.startLoading = startLoading;
