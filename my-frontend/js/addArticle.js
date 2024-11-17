let getTag = () => {
      $("#choosetags").empty();
      $("#choosetags").trigger("chosen:updated");
      // You can now use the tags array in your application
      analyticsTags.forEach((tag) => {
        const option = $("<option></option>").attr("value", tag).text(tag);
        $("#choosetags").append(option);
      });
      $("#choosetags").chosen({ width: "100% !important" });
    
      $("#choosetags").trigger("chosen:updated"); // If using Chosen for styling
  

};
// Open the form modal
$("#add-new").click(function () {
  $("#formModal").show();
  getTag();
  var $publisherDropdown = $("#enterpublisherName");
  allusers.forEach(user => {
      const option = $("<option></option>")  // Create a new option
          .attr("value", user.name)  // Set the value as user ID
          .text(user.name);  // Set the text as user name
          $publisherDropdown.append(option);  // Append the option to the dropdown
  });

  $("#enterpublisherName").chosen({
    width: "100% !important",
    max_selected_options: 1
});

// Update Chosen dynamically if needed
$("#enterpublisherName").trigger("chosen:updated");
  //add new tag
  // $("#addTagBtn")
  //   .off("click")
  //   .on("click", function () {
  //     var newTag = $("#newTag").val().trim();
  //     if (newTag !== "") {
  //       // Add new option to the select element
  //       $.ajax({
  //         url: "/api/tags", 
  //         method: "POST",
  //         contentType: "application/json",
  //         data: JSON.stringify({ name: newTag }),
  //         success: function (response) {
  //           $.notify("Tag added", "success");
  //           $("#newTag").val("");
  //           getTag();
  //           $("#newTagInput").hide();
  //         },
  //         error: function (error) {
  //           if (error.status === 409) {

  //               $.notify("Tag already exists.", "error");
  //           } else {
  //             $.notify("Error adding tags", "error");
  //           }
  //           console.error("Error adding tag:", error);
  //         },
  //       });
  //     }
  //   });

  $("#articleFormSubmit")
    .off()
    .on("click", function (event) {
      event.preventDefault();    
      let publisher =$("#enterpublisherName").val()
      var createdOn = $("#createdOn").val();
      var publisherName = publisher[0];
      var subject = $("#subject").val();
      var articleURL = $("#articleURL").val();
      var cja = $("#cja").val();
      $("#choosetags").trigger("chosen:updated");
      var sendtags = $("#choosetags").val();

      var datevalidation = isValidDate(createdOn);

      var formData = {
        createdOn: createdOn,
        publisherName: publisherName,
        subject: subject,
        articleURL: articleURL,
        tag: sendtags,
        isCJA: cja,
        status: "NA",
        statusDescription: "NA",
      };
if(datevalidation==true){
  $.ajax({
    url: "/api/add-article",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (response) {
      console.log(response.message);
      $("#articleForm input").val("");
      $("#choosetags").val([]); // For multiple select dropdowns
      $("#choosetags").trigger("chosen:updated"); // Update the Chosen dropdown
      //Close the form modal after submission
      $("#formModal").hide();
      $.notify("Thank you for adding article", "success");

      getallarticle();
    },
    error: function (error) {
      console.log("Error adding article", error);
      $.notify("Error adding article", "error");
    },
  });
}else{
  $.notify("Date format incorrect", "error");
}
      
    });
});

// Close the form modal
$(".close").off().on('click',function () {
  $("#articleForm input").val("");
  $("#choosetags").val([]); // For multiple select dropdowns
  $("#choosetags").trigger("chosen:updated"); // Update the Chosen dropdown
  $("#formModal").hide();
});

// Close the modal when clicking outside the form
$(window).click(function (event) {
  if (event.target.id === "formModal") {
    $("#formModal").hide();
  }
  if (event.target.id === "popupDiv") {
    $(".popupDiv").hide();
  }
});

// Show the new tag input when the "Add New Tag" link is clicked
$("#addTagLink").click(function (event) {
  event.preventDefault();
  $("#newTagInput").show();
});

function isValidDate(dateString) {
  // Regular expression to match the format MM/DD/YYYY
  const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

  // Check if the date string matches the format
  if (!regex.test(dateString)) {
    return false;
  }

  // Parse the date components
  const [month, day, year] = dateString.split('/').map(Number);

  // Check for valid days in each month
  const isValidDay = (day <= new Date(year, month, 0).getDate());

  return isValidDay;
}


