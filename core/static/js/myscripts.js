// 'use strict';

// indian mobile phone number valiation

function validateIndianMobilePhoneNumber(number) {
  const regex = /^\d{10}$/;
  return regex.test(number);
}

// # spare request

$(document).ready(function () {
  $("#no-spare").change(function () {
    if ($(this).is(":checked")) {
      $("#sparerequestform").slideUp();
      $("#nospareform").slideDown();
    } else {
      $("#sparerequestform").slideDown();
      $("#nospareform").slideUp();
    }
  });
});






// ## Loader

const preloadWrapper = document.querySelector(".preloader-wrapper");

window.addEventListener("load", function () {
  preloadWrapper.classList.add("fade-out-animation");
});



// form save
// document.querySelectorAll('form').forEach(form => {
//   form.addEventListener('submit', function() {
//     form.querySelector('button[type="submit"], input[type="submit"]').disabled = true;
//     const preloadWrapper = document.querySelector(".preloader-wrapper");
//     preloadWrapper.classList.add("fade-out-animation");
//   });
// });



document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function() {
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    submitButton.disabled = true;

    // Override the default alert function
    const originalAlert = window.alert;
    window.alert = function(message) {
      submitButton.disabled = false; // Re-enable the button
      originalAlert(message); // Show the alert
      window.alert = originalAlert; // Restore original alert
    };

    // Override confirm dialog too (in case confirm dialogs are used)
    const originalConfirm = window.confirm;
    window.confirm = function(message) {
      submitButton.disabled = false;
      const result = originalConfirm(message);
      window.confirm = originalConfirm;
      return result;
    };
  });
});



// ## service image zoom
$(document).ready(function () {
  // Handle click event on the image
  $(".zoomable-image").click(function () {
    // Get the source of the clicked image
    var imgSrc = $(this).attr("src");

    // Set the source of the modal image
    $("#zoomedImg").attr("src", imgSrc);
    $("#zoomedImg").css("transform", "scale(3)");

    $("#zoomedImg").css("margin-top", "10%");

    // Show the modal
    $("#zoomModal").modal("show");
  });
});

// ########################################################
// ############### Notification section ###########################
// ########################################################

$(document).ready(function () {
  var csrftoken = csrf_token;

  $.ajax({
    url: "/get_call_schedule_notifications/",
    type: "POST",
    data: {},
    contentType: "application/json",
    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Call schedule response-", response);

      notification_count = response.active_count;
      document.querySelector(".count-call").innerHTML = response.active_count;
      document.querySelector(".count-call-second").innerHTML =
        response.active_count;
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);
    },
  });
});

$(document).ready(function () {
  var csrftoken = csrf_token;

  $.ajax({
    url: "/get_notifications_unseen/",
    type: "POST",
    data: {},
    contentType: "application/json",
    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      // console.log("Data sent successfully!", response);

      finalResponse = response.response;

      finalResponse.forEach((element) => {
        let header;

        if (element.notification_type == "spare_request") {
          header = "Spare Request";
        } else if (element.notification_type == "service_charge_request") {
          header = "Service Charge Request";
        } else if (element.notification_type == "service_entry") {
          header = "Service Entry";
        } else if (element.notification_type == "service_checkout") {
          header = "Service Checkout";
        } else if (element.notification_type == "service_booking") {
          header = "Service Booking";
        } else if (element.notification_type == "not_serviced") {
          header = "Not Serviced";
        } else if (element.notification_type == "qc_completed") {
          header = "QC Completed";
        } else if (element.notification_type == "serviced") {
          header = "Service Completed";
        } else if (element.notification_type == "spare_allocated") {
          header = "Spare Allocated";
        } else if (element.notification_type == "spare_cancelled") {
          header = "Spare Cancelled";
        } else if (element.notification_type == "service_assigned") {
          header = "Service Assigned";
        } else if (element.notification_type == "qc_failed") {
          header = "QC Failed";
        } else if (element.notification_type == "cnp_pending") {
          header = "CNP Pending";
        } else if (element.notification_type == "service_charge_estimated") {
          header = "Service Charge Estimated";
        } else {
          header = "Heading";
        }

        $.toast({
          heading: `<h4 class='fw-bold mb-2'>${header}</h4>`,
          text: `<p class='fw-bold fs-6'>${element.message}</p>`,
          hideAfter: false,
          showHideTransition: "slide",
          position: "top-center",
          icon: "info",
          stack: 20,
          bgColor: "#40c057",
          textColor: "white",
          afterShown: function () {
            var csrftoken = csrf_token;

            $.ajax({
              url: "/update_notifications_seen/",
              type: "POST",
              data: { id: element.id },
              contentType: "application/json",

              headers: {
                "X-CSRFToken": csrftoken,
              },
              success: function (response) {
                console.log(response);
              },
              error: function (xhr, textStatus, errorThrown) {
                console.log(errorThrown);
              },
            });
          },
        });
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);
    },
  });
});

$(document).ready(function () {
  var csrftoken = csrf_token;

  $.ajax({
    url: "/get_notifications/",
    type: "POST",
    data: {},
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);
      let finalResponse = response.response;

      // console.log("final resp",finalResponse)

      let htmlStr = "";

      finalResponse.forEach((element) => {
        //  Notification dropdown
        let bgColor = element.active ? "#e8e1d7" : "#eee";
        let titleColor = element.active ? "#4555B9" : "#7c7c7c";

        let greyClass = element.active ? "" : "grayscale-image";

        let header;
        let href = "#";
        let imageUrl = "";
        if (element.notification_type == "spare_request") {
          header = "Spare Request";
          href = `/sparerequestdetails/${element.notification_id}/`;
          imageUrl = "/static/images//icons/purchase.png";
        } else if (element.notification_type == "service_charge_request") {
          header = "Service Charge Request";
          href = `/servicechargeestimationdetails/${element.notification_id}/`;
          imageUrl = "/static/images/icons/cost-t.png";
        } else if (element.notification_type == "service_entry") {
          header = "Service Entry";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/journal-book.png";
        } else if (element.notification_type == "service_checkout") {
          header = "Service Checkout";
          href = `/servicecheckout/${element.notification_id}/`;
          imageUrl = "/static/images/icons/cart.png";
        } else if (element.notification_type == "service_booking") {
          header = "Service Booking";
          href = `/servicebooking/`;
          imageUrl = "/static/images/icons/service_booking.png";
        } else if (element.notification_type == "not_serviced") {
          header = "Not Serviced";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/no-data.png";
        } else if (element.notification_type == "qc_completed") {
          header = "QC Completed";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/checked.png";
        } else if (element.notification_type == "serviced") {
          header = "Service Completed";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/serviced.png";
        } else if (element.notification_type == "spare_allocated") {
          header = "Spare Allocated";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/settings-1111216.png";
        } else if (element.notification_type == "spare_cancelled") {
          header = "Spare Cancelled";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/spare_cancelled.png";
        } else if (element.notification_type == "service_charge_estimated") {
          header = "Service Charge Estimated";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/settings-1111216.png";
        } else if (element.notification_type == "service_assigned") {
          header = "Service Assigned";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/wrench-923840.png";
        } else if (element.notification_type == "qc_failed") {
          header = "QC Failed";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/technical-support-8509963.png";
        } else if (element.notification_type == "cnp_pending") {
          header = "CNP Pending";
          href = `/serviceupdateform/${element.notification_id}/`;
          imageUrl = "/static/images/icons/deadline-1378330.png";
        } else {
          header = "Heading";
          href = "#";
          imageUrl = "";
        }

        let htmlFinal = `<a class="content " href="${href}" data-id="${element.id}" >
                          
        <div class="notification-item border-bottom" style='background-color:${bgColor};box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;'>
           
        
        <div class="d-flex justify-content-between">
           
              <h4 class="item-title" style='color:${titleColor};'>${header}</h4>
              <h4 class="item-title" style='color:${titleColor};'>${element["created_date"]}</h4>
           </div>
         
           <div class="d-flex">

           <div>
           <img class="${greyClass}" src="${imageUrl}" alt="spare request" style='width:20px;'>
           </div>
         
         <p class="item-info">${element["message"]}</p>
         </div>
       </div>
        
     </a>`;

        htmlStr += htmlFinal;
      });

      let notificationWrapper = document.querySelector(
        ".notifications-wrapper",
      );

      notificationWrapper.insertAdjacentHTML("beforeend", htmlStr);
      let count_notif = response.active_count;
      if (response.active_count > 99) {
        count_notif = "99+";
      }
      document.querySelector(".count-number").innerHTML = count_notif;

      $(".notifications-wrapper .content").on("click", function (event) {
        event.preventDefault();

        let notificationId = $(this).data("id");

        // Call your AJAX function with the notification ID

        var csrftoken = csrf_token;

        $.ajax({
          url: "/update_notifications_active/",
          type: "POST",
          data: { id: notificationId },
          contentType: "application/json",

          headers: {
            "X-CSRFToken": csrftoken,
          },
          success: function (response) {
            console.log(response);
          },
          error: function (xhr, textStatus, errorThrown) {
            console.log(errorThrown);
          },
        });

        // Navigate to the specified href after AJAX call
        let href = $(this).attr("href");
        window.location.href = href;
      });
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);
    },
  });


  $(".count-indicator-notification").on("click", function () {
    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_notifications/",
      type: "POST",
      data: {},
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        let notificationWrapperDiv = document.querySelector(
          ".notifications-wrapper",
        );
        notificationWrapperDiv.innerHTML = "";

        console.log("Data sent successfully!", response);
        let finalResponse = response.response;

        // console.log("final resp",finalResponse)

        let htmlStr = "";

        finalResponse.forEach((element) => {
          let bgColor = element.active ? "#ffd43b" : "#eee";
          let titleColor = element.active ? "#4555B9" : "#7c7c7c";
          let greyClass = element.active ? "" : "grayscale-image";

          let header;
          let href = "#";
          let imageUrl = "";
          if (element.notification_type == "spare_request") {
            header = "Spare Request";
            href = `/sparerequestdetails/${element.notification_id}/`;
            imageUrl = "/static/images/icons/purchase.png";
          } else if (element.notification_type == "service_charge_request") {
            header = "Service Charge Request";
            href = `/servicechargeestimationdetails/${element.notification_id}/`;
            imageUrl = "/static/images/icons/cost-t.png";
          } else if (element.notification_type == "service_entry") {
            header = "Service Entry";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/journal-book.png";
          } else if (element.notification_type == "service_checkout") {
            header = "Service Checkout";
            href = `/servicecheckout/${element.notification_id}/`;
            imageUrl = "/static/images/icons/cart.png";
          } else if (element.notification_type == "service_booking") {
            header = "Service Booking";
            href = `/servicebooking/`;
            imageUrl = "/static/images/icons/service_booking.png";
          } else if (element.notification_type == "not_serviced") {
            header = "Not Serviced";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/no-data.png";
          } else if (element.notification_type == "qc_completed") {
            header = "QC Completed";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/checked.png";
          } else if (element.notification_type == "serviced") {
            header = "Service Completed";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/serviced.png";
          } else if (element.notification_type == "spare_allocated") {
            header = "Spare Allocated";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/settings-1111216.png";
          } else if (element.notification_type == "spare_cancelled") {
            header = "Spare Cancelled";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/spare_cancelled.png";
          } else if (element.notification_type == "service_charge_estimated") {
            header = "Service Charge Estimated";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/settings-1111216.png";
          } else if (element.notification_type == "service_assigned") {
            header = "Service Assigned";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/wrench-923840.png";
          } else if (element.notification_type == "qc_failed") {
            header = "QC Failed";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/technical-support-8509963.png";
          } else if (element.notification_type == "cnp_pending") {
            header = "CNP Pending";
            href = `/serviceupdateform/${element.notification_id}/`;
            imageUrl = "/static/images/icons/deadline-1378330.png";
          } else {
            header = "Heading";
            href = "#";
            imageUrl = "";
          }

          let htmlFinal = `<a class="content " href="${href}" data-id="${element.id}">
                        
      <div class="notification-item border-bottom" style='background-color:${bgColor};box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;'>
         
      
      <div class="d-flex justify-content-between">
         
            <h4 class="item-title" style='color:${titleColor};'>${header}</h4>
            <h4 class="item-title" style='color:${titleColor};'>${element["created_date"]}</h4>
         </div>

         <div class="d-flex align-items-center">

         <div>
         <img class="${greyClass}" src="${imageUrl}" alt="spare request" style='width:30px;'>
         </div>
       
       <p class="item-info mt-2 ms-3">${element["message"]}</p>
       </div>
     </div>
      
   </a>`;

          htmlStr += htmlFinal;
        });

        let notificationWrapper = document.querySelector(
          ".notifications-wrapper",
        );

        notificationWrapper.insertAdjacentHTML("beforeend", htmlStr);
        let count_notif = response.active_count;
        if (response.active_count > 99) {
          count_notif = "99+";
        }
        document.querySelector(".count-number").innerHTML = count_notif;

        $(".notifications-wrapper .content").on("click", function (event) {
          event.preventDefault();

          let notificationId = $(this).data("id");

          // Call your AJAX function with the notification ID
          // Example: ajaxFunction(notificationId);
          console.log("Notification clicked. ID:", notificationId);

          var csrftoken = csrf_token;

          $.ajax({
            url: "/update_notifications_active/",
            type: "POST",
            data: { id: notificationId },
            contentType: "application/json",

            headers: {
              "X-CSRFToken": csrftoken,
            },
            success: function (response) {
              console.log(response);
            },
            error: function (xhr, textStatus, errorThrown) {
              console.log(errorThrown);
            },
          });

          // Navigate to the specified href after AJAX call
          let href = $(this).attr("href");
          // console.log('Notification href:', href);
          window.location.href = href;
        });
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        // Handle the error case
      },
    });
  });
});

// $(document).ready(function() {

//   var csrftoken = csrf_token

//   $.ajax({
//     url: '/check_notification/',
//     type: 'POST',

//     contentType: 'application/json',

//   headers: {
//     'X-CSRFToken': csrftoken
//   },
//     success: function(response) {
//       console.log('Data sent successfully!');

//     },
//     error: function(xhr, textStatus, errorThrown) {
//       console.error('Error sending data:', errorThrown);
//       // Handle the error case
//     }
//   });

// });

// ############################################
// ############### General ####################
// ############################################

// activating tooltip

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// this script is for customizing jquery datatable

$(document).ready(function () {
  $(".add-pagination").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: ["csv", "excel", "pdf", "colvis"],
  });

  $(".add-pagination-sparetax").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Spare Tax",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Spare Tax",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Spare Tax",
        filename: "Spare Tax",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-servicetax").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Service Tax",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Service Tax",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Service Tax",
        filename: "Service Tax",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-salereturntax").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Sale Return Tax",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Sale Return Tax",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Sale Return Tax",
        filename: "Sale Return Tax",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-purchasereturntax").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Purchase Return Tax",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Purchase Return Tax",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Purchase Return Tax",
        filename: "Purchase Return Tax",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-saletax").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Sale Tax",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Sale Tax",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Sale Tax",
        filename: "Sale Tax",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-purchasetax").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Purchase Tax",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Purchase Tax",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Purchase Tax",
        filename: "Purchase Tax",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-products").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Products",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Products",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Products",
        filename: "Products",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-transaction").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Transactions",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Transactions",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Transactions",
        filename: "Transactions",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-ledger").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "General Ledger",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "General Ledger",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "General Ledger",
        filename: "General Ledger",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-cashbook").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Cashbook",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Cashbook",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Cashbook",
        filename: "Cashbook",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-placcount").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "PL Account",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "PL Account",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "PL Account",
        filename: "PL Account",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-sales").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Sales",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Sales",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Sales",
        filename: "Sales",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-purchase").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Purchase",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Purchase",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Purchase",
        filename: "Purchase",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-daily-sales").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Sales Report Datewise",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Sales Report Datewise",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Sales Report Datewise",
        filename: "Sales Report Datewise",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });


  $(".add-pagination-detailed-service").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Service Report",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Service Report",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Service Report",
        filename: "Service Report",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-detailed-sales").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Sale Report",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Sale Report",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Sale Report",
        filename: "Sale Report",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-monthly-sales").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Sales Report Monthly",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Sales Report Monthly",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Sales Report Monthly",
        filename: "Sales Report Monthly",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-yearly-sales").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Sales Report Yearly",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Sales Report Yearly",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Sales Report Yearly",
        filename: "Sales Report Yearly",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-daily-purchase").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Purchase Reportt Datewise",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Purchase Report Datewise",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Purchase Report Datewise",
        filename: "Purchase Report Datewise",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-monthly-purchase").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Purchase Report Monthly",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Purchase Report Monthly",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Purchase Report Monthly",
        filename: "Purchase Report Monthly",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-yearly-purchase").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: [
      {
        extend: "csv",
        text: "CSV",
        filename: "Purchase Report Yearly",
      },
      {
        extend: "excel",
        text: "Excel",
        filename: "Purchase Report Yearly",
        title: null,
      },
      {
        extend: "pdf",
        text: "PDF",
        title: "Purchase Report Yearly",
        filename: "Purchase Report Yearly",
        exportOptions: {
          columns: ":visible",
        },
      },
      "colvis",
    ],
  });

  $(".add-pagination-service-report").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: false,
    bSort: false,
    pageLength: 5,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
    dom: 'lBfrtip<"actions">',
    buttons: ["excel", "pdf", "colvis"],
  });

  $(".settings-add-pagination").DataTable({
    paging: true,
    searching: true,
    info: true,
    lengthChange: true,
    bSort: false,
    pageLength: 10,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
  });

  $(".add-pagination-modal").DataTable({
    paging: false,
    searching: true,
    info: false,
    lengthChange: false,
    bSort: false,
    // pageLength: 100,
    language: {
      paginate: {
        previous: "<",
        next: ">",
      },
    },
  });

  $(document).ready(function () {
    var table = $(".dashboard-table").DataTable({
      paging: false,
      searching: false,
      info: false,
      lengthChange: false,
      bSort: false,
      pageLength: 100,
      dom: "Bfrtip",
      buttons: [
        {
          extend: "excelHtml5",
          text: "&darr; Excel",
          titleAttr: "Export to Excel",
          className: "btn-excel",
        },
        {
          extend: "pdfHtml5",
          text: "&darr; PDF",
          titleAttr: "Export to PDF",
          className: "btn-pdf",
        },
        {
          text: "See More &rarr;",
          action: function (e, dt, node, config) {
            window.location.href = "/dashboardtable/";
          },
          className: "btn-see-more",
        },
      ],
    });

    // Adjust button styles if necessary
    $(".btn-excel").css({
      position: "absolute",
      left: "-10px",
      top: "-25px",
      background: "none",
      border: "none",
      "border-bottom": "#0068b4 dotted 2px",
      padding: 0,
      color: "#0068b4",
      "font-weight": "bold",
    });
    $(".btn-pdf").css({
      position: "absolute",
      left: "65px",
      top: "-25px",
      background: "none",
      border: "none",
      "border-bottom": "#0068b4 dotted 2px",
      padding: 0,
      color: "#0068b4",
      "font-weight": "bold",
    });
    $(".btn-see-more").css({
      position: "absolute",
      right: "0",
      top: "-25px",
      background: "none",
      border: "none",
      "border-bottom": "#0068b4 dotted 2px",
      padding: 0,
      color: "#0068b4",
      "font-weight": "bold",
    });

    $(".btn-excel, .btn-pdf, .btn-see-more").on(
      "mousedown mouseup",
      function (e) {
        e.preventDefault();
      },
    );
  });

  $(document).ready(function () {
    var table = $(".dashboard-table-search").DataTable({
      paging: false,
      searching: false,
      info: false,
      lengthChange: false,
      bSort: false,
      pageLength: 100,
      dom: "Bfrtip", // Adjust this to position your buttons
      buttons: [
        {
          extend: "excelHtml5",
          text: "&darr; Excel",
          titleAttr: "Export to Excel",
          className: "btn-excel",
        },
        {
          extend: "pdfHtml5",
          text: "&darr; PDF",
          titleAttr: "Export to PDF",
          className: "btn-pdf",
        },
        {
          text: "Search &#128269;",
          action: function (e, dt, node, config) {
            // window.location.href="/dashboardtable/"
            $("#searchdashtable").modal("show");
          },
          className: "btn-search",
        },
      ],
    });

    // Adjust button styles if necessary
    $(".btn-excel").css({
      position: "absolute",
      left: "-10px",
      top: "-25px",
      background: "none",
      border: "none",
      "border-bottom": "#0068b4 dotted 2px",
      padding: 0,
      color: "#0068b4",
      "font-weight": "bold",
    });
    $(".btn-pdf").css({
      position: "absolute",
      left: "65px",
      top: "-25px",
      background: "none",
      border: "none",
      "border-bottom": "#0068b4 dotted 2px",
      padding: 0,
      color: "#0068b4",
      "font-weight": "bold",
    });
    $(".btn-search").css({
      position: "absolute",
      right: "0",
      top: "-25px",
      background: "none",
      border: "none",
      "border-bottom": "#0068b4 dotted 2px",
      padding: 0,
      color: "#0068b4",
      "font-weight": "bold",
    });

    $(".btn-excel, .btn-pdf, .btn-search").on(
      "mousedown mouseup",
      function (e) {
        e.preventDefault();
      },
    );
  });
});

//   $(document).ready(function () {
//     // Setup - add a text input to each footer cell
//     $('#moneyreciept-table thead tr')
//         .clone(true)
//         .addClass('filters')
//         .appendTo('#moneyreciept-table thead');

//     var table = $('#moneyreciept-table').DataTable({
//         orderCellsTop: true,
//         fixedHeader: true,
//         initComplete: function () {
//             var api = this.api();

//             // For each column
//             api
//                 .columns()
//                 .eq(0)
//                 .each(function (colIdx) {
//                     // Set the header cell to contain the input element
//                     var cell = $('.filters th').eq(
//                         $(api.column(colIdx).header()).index()
//                     );
//                     var title = $(cell).text();
//                     $(cell).html('<input type="text" placeholder="' + title + '" />');

//                     // On every keypress in this input
//                     $(
//                         'input',
//                         $('.filters th').eq($(api.column(colIdx).header()).index())
//                     )
//                         .off('keyup change')
//                         .on('change', function (e) {
//                             // Get the search value
//                             $(this).attr('title', $(this).val());
//                             var regexr = '({search})'; //$(this).parents('th').find('select').val();

//                             var cursorPosition = this.selectionStart;
//                             // Search the column for that value
//                             api
//                                 .column(colIdx)
//                                 .search(
//                                     this.value != ''
//                                         ? regexr.replace('{search}', '(((' + this.value + ')))')
//                                         : '',
//                                     this.value != '',
//                                     this.value == ''
//                                 )
//                                 .draw();
//                         })
//                         .on('keyup', function (e) {
//                             e.stopPropagation();

//                             $(this).trigger('change');
//                             $(this)
//                                 .focus()[0]
//                                 .setSelectionRange(cursorPosition, cursorPosition);
//                         });
//                 });
//         },
//     });
// });

//   this script is for clickable row functionality in all the tables

$(document).ready(function ($) {
  $(".clickable-row").click(function () {
    window.location = $(this).data("href");
  });
});

// ####################################################
// ############### User section #######################
// ####################################################

// this script is for form validation on submit Add user form & user update form (adduserpage.html,userupdateform.html)

$(document).ready(function () {
  // Function to check form validation on submit
  $("#add-user-form").submit(function (event) {
    var password = $("#password").val();
    var confirmPassword = $("#passwordConfirmation").val();
    var username = $("#username").val();
    var email = $("#email").val();
    var branch = $("#branch").val();
    var mobile = $("#mobile").val();
    var role = $("#role").val();
    // var branchadmin =$("#is_branch_admin").val()

    // check if branchadmin and fieldengineer is True (user cant have two roles)
    if (role === "") {
      $(".roleValidation").text("Rols is required.").addClass("text-danger");
      event.preventDefault();
    }
    // Check if password and confirm password match
    // Check if password meets requirements
    if (password === "") {
      $(".passwordValidation")
        .text("Password is required.")
        .addClass("text-danger");
      $(".passwordMatch").text("");
      event.preventDefault(); // Prevent form submission
    } else if (!isValidPassword(password)) {
      $(".passwordValidation")
        .text("Password must have atleast 8 charecters.")
        .addClass("text-danger");
      $(".passwordMatch").text("");
      event.preventDefault();
    } else {
      $(".passwordValidation").text("");
      if (password !== confirmPassword) {
        $(".passwordMatch")
          .text("Passwords do not match.")
          .addClass("text-danger");
        event.preventDefault();
      } else {
        $(".passwordMatch").text("");
      }
    }
    // Check if username is valid
    if (username === "") {
      $(".usernameValidation")
        .text("Username is required.")
        .addClass("text-danger");
      event.preventDefault();
    } else {
      $(".usernameValidation").text("");
    }
    if (branch === "") {
      $(".branchValidation")
        .text("Branch selection is required.")
        .addClass("text-danger");
      event.preventDefault();
    } else {
      $(".branchValidation").text("");
    }

    // Check if mobile is provided
    if (mobile === "") {
      $(".mobileValidation")
        .text("Mobile number is required.")
        .addClass("text-danger");
      event.preventDefault();
    } else {
      $(".mobileValidation").text("");
    }

    // Check if Email is provided
    if (email === "") {
      $(".emailValidation")
        .text("Email Id is required.")
        .addClass("text-danger");
      event.preventDefault();
    } else {
      $(".emailValidation").text("");
      if (!isValidEmail(email)) {
        $(".emailValidation")
          .text("Email is not valid.")
          .addClass("text-danger");
        event.preventDefault();
      } else {
        $(".emailValidation").text("");
      }
    }
  });

  // function to check if password has 8 charectors
  function isValidPassword(password) {
    return password.length >= 8;
  }

  //  function to check if email is valid
  function isValidEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});

// this script is for toggle button functionality for Activating/Deactivating user (myprofile.html)

$(document).ready(function () {
  $("#toggleButton").change(function () {
    var togleStatus;
    if ($(this).is(":checked")) {
      togleStatus = true;
    } else {
      togleStatus = false;
    }

    var csrftoken = csrf_token;

    $.ajax({
      url: "/update_user_status/",
      type: "POST",
      data: { status: togleStatus, id: $("#user_id").val() },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!");
        // Handle the response from the Django backend
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        // Handle the error case
      },
    });
  });
});

// ########################################################
// ############### Customer section #######################
// ########################################################

// this script do the functionality whenever the branch in customer list
// filter changes this ajax function send selected branch to /get_user_by_branch/ url
// and get back all the users in that branch and append it to the added by dropdown
// in customer list (customers.html)

// $(document).ready(function(){

//     $("#customer_list_branch").change(function(){

//       var branch =$("#customer_list_branch").val()
//       console.log('branch---',branch)

//       var csrftoken =csrf_token

//       $.ajax({
//         url:"/get_user_by_branch/",
//         type:"POST",
//         data:{branch:branch},
//         contentType:"application/json",

//         headers: {
//       'X-CSRFToken': csrftoken
//     },

//     success:function(response){
//       $("#customer_list_fieldengineer").empty();

//       console.log(response);
//       $.each(response.added_by, function(index, element) {

//         console.log("element..",element)
//                   row="<option value="+element+">"+element+"</option>"

//                     $('#customer_list_fieldengineer').append(row);
//                 });
//                 $('#customer_list_fieldengineer').prepend("<option value='' selected>Select User</option>");

//     },
//         error:function(errorThrown){
//           console.log(errorThrown)
//         }

//       })

//     })
//   })

$(document).ready(function () {
  $("#customer_list_branch").change(function () {
    var branch = $(this).val();

    console.log(branch);

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_user_by_branch/",
      type: "POST",
      data: { branch: branch },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!");
        console.log("response..", response);

        // Assuming you have initialized Selectize.js on the #expensetype element
        var $expensetypeSelect = $("#customer_list_fieldengineer")[0].selectize;

        // Clear existing options
        $expensetypeSelect.clearOptions();

        // Add new options
        $.each(response.added_by, function (index, element) {
          console.log(element);
          $expensetypeSelect.addOption({ value: element, text: element });
        });

        // Refresh Selectize.js to update the UI
        $expensetypeSelect.refreshItems();

        // Set the selected option to the default (if needed)
        $expensetypeSelect.setValue("", false);

        // Trigger the change event to update Selectize.js
        $expensetypeSelect.trigger("change");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        $("#customer_list_fieldengineer").empty();
        $("#customer_list_fieldengineer").prepend(
          "<option value='' selected >Select SubCategory</option>",
        );
      },
    });
  });
});

// this function do the filtering of customer list when selecting Branch,Added By (customers.html)
function myFilterFunction() {
  var branch = $("#branch_list").val();
  var added_by = $("#added_by_list").val();

  $(".search_results").each(function () {
    var classList = $(this).attr("class").split(/\s+/);
    if (branch === "" && added_by === "") {
      $(".search_results").show();
    } else if (branch && added_by) {
      $(this).toggle(
        classList.includes(branch) && classList.includes(added_by),
      );
    } else if (branch) {
      $(this).toggle(classList.includes(branch));
    } else if (added_by) {
      $(this).toggle(classList.includes(added_by));
    }
  });
}

// this script do the clear filter functionality (customers.html)

$("#clear_filter").click(function (e) {
  $("#added_by").empty();
  $("#added_by_list").val("");
  // $("#branch").empty();
  $("#branch_list").val("");
  // $("#added_by option:not([value=''])").remove();
  $(".search_results").show();
});

// this script is for the customer delete pop up in customer view (customerview.html)

$(document).ready(function () {
  $("#deleteButton").click(function () {
    $("#confirmationModal").show();
  });

  $("#cancelButton").click(function () {
    $("#confirmationModal").hide();
  });
});

// ########################################################
// ############### Purchase section #######################
// ########################################################

// # print purchase barcode

$(document).ready(function () {
  $(".print-purchase-barcode").click(function () {
    console.log($(this).data("barcode"));
  });
});

// generate barcode

$(document).ready(function () {
  $(".purchase-entry-table tbody").click(function (event) {
    if (
      event.target.classList.contains("barcode-btn") ||
      event.target.classList.contains("barcode-btn-icon")
    ) {
      let barcodeInput = $(event.target)
        .closest("td")
        .find('[name^="barcode"]');

      console.log("closest elem -", barcodeInput);

      var csrftoken = csrf_token;

      $.ajax({
        url: "/generate_purchase_barcode/",
        type: "POST",
        data: {},
        contentType: "application/json",

        headers: {
          "X-CSRFToken": csrftoken,
        },
        success: function (response) {
          console.log("Data sent successfully!");
          const barcodeNumber = response.barcode;
          // alert(barcodeNumber)

          barcodeInput.val(barcodeNumber);
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    }
  });
});

$(document).ready(function () {
  $("#purchaseDueForm").submit(function (event) {
    event.preventDefault();

    let submitStatus = false;

    let previousDue = $("#prevdue").val();
    let amountPaid = $("#amountrecieved").val();
  
    if (parseFloat(amountPaid) > parseFloat(previousDue)) {
      submitStatus = true;
      alert("Amount Paid is larger than Previous Due");
      return false; // Stop further processing
    }

    if (!submitStatus) {
      $("#purchaseDueForm")[0].submit();
    }
  });
});



$(".close-conf").click(function () {
  $("#confirmationModal").css("display", "none");
});



// purchase form product fetch function 

const productFetchFucntion = function (num) {
  $(`.purchase-entry-table input[name="name${num}"]`).on("change input", function () {
    const productname = $(this).val();

    console.log("product change11")

    let csrftoken = csrf_token;

    $.ajax({
      url: "/get_product_details/",
      type: "POST",
      data: { productname: productname },
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        // $(`.purchase-entry-table input[name="barcode${num}"]`).val(response.barcodenumber)
        $(`.purchase-entry-table input[name="price${num}"]`).val(
          response.unitprice,
        );
        $(`.purchase-entry-table input[name="purchase_priceafterdiscount${num}"]`).val(
          response.unitprice,
        );
        $(`.purchase-entry-table input[name="sellingprice${num}"]`).val(
          response.sellingprice,
        );
        $(`.purchase-entry-table input[name="mrp${num}"]`).val(response.mrp);
        $(`.purchase-entry-table input[name="mop${num}"]`).val(response.mop);
        $(`.purchase-entry-table input[name="purchasegst${num}"]`).val(
          response.purchasegst,
        );

        let purchasegst = response.purchasegst;
        $(
          `.purchase-entry-table select[name='purchasegst${num}'] option[value='${purchasegst}']`,
        ).prop("selected", true);

        let salegst = response.salegst;
        $(
          `.purchase-entry-table select[name='salegst${num}'] option[value='${salegst}']`,
        ).prop("selected", true);

        if (Object.keys(response).length == 0) {
          $(
            `.purchase-entry-table select[name='purchasegst${num}'] option[value='']`,
          ).prop("selected", true);
          $(
            `.purchase-entry-table select[name='salegst${num}'] option[value='']`,
          ).prop("selected", true);

          $(`.purchase-entry-table input[name="quantity${num}"]`).val("");
          $(`.purchase-entry-table input[name="barcode${num}"]`).val("");

         

      
        }

        $('.purchase-entry-table input[name^="quantity"]').trigger('change');

        
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });
};

// This script append new row to purchase table

$(document).ready(function () {
  

  productFetchFucntion("1");

  // Use event delegation to handle click events for dynamically added buttons
  $(document).on("click", ".addrowbtn", function () {
    const lastRow = $(".purchase-entry-table tbody tr:last");
    

      // Check how many rows currently exist
      let rowCount = $(".purchase-entry-table tbody tr").length;
    // Check if the last row's input with name starting with "name" has a value
    if (lastRow.find('[name^="name"]').val() !== "") {
      rowCount++;

      const newRow = lastRow.clone(); // Copy the last row

      // Update the row number in the new row
      newRow.find("td:first").text(rowCount);

      // Increment the numeric part of input names and IDs in the new row
      newRow.find('[name^="name"]').attr("name", `name${rowCount}`);
      newRow.find('[name^="barcode"]').attr("name", `barcode${rowCount}`);
      newRow
        .find('[name^="sellingprice"]')
        .attr("name", `sellingprice${rowCount}`);
      newRow.find('[name^="price"]').attr("name", `price${rowCount}`);
      newRow.find('[name^="purchase_priceafterdiscount"]').attr("name", `purchase_priceafterdiscount${rowCount}`);
      newRow
        .find('[name^="purchasegst"]')
        .attr("name", `purchasegst${rowCount}`);
      newRow.find('[name^="salegst"]').attr("name", `salegst${rowCount}`);
      newRow.find('[name^="mrp"]').attr("name", `mrp${rowCount}`);
      newRow.find('[name^="mop"]').attr("name", `mop${rowCount}`);
      newRow.find('[name^="quantity"]').attr("name", `quantity${rowCount}`);
      newRow
        .find('[id^="search-input-name"]')
        .attr("id", `search-input-name${rowCount}`);
      newRow.find('[list^="name"]').attr("list", `name${rowCount}`);
      newRow.find('[id^="name"]').attr("id", `name${rowCount}`);

      // Clear the input values in the new row (optional)
      newRow.find('input[type="text"]').val("");
      newRow.find('input[type="number"]').val("");

      lastRow.find(".addrowbtn").remove();

      lastRow
        .find(".puchase-qty-left")
        .html(
          '<span class="deletebtn"><i class="fa-solid fa-minus"></i></span>',
        );

      // Append the new row to the table body
      $(".purchase-entry-table tbody").append(newRow);

      productFetchFucntion(`${rowCount}`);
    }
  });
});







$(document).ready(function () {
  // Function to update the attributes based on the row index
  function updateAttributes(row) {
    $(row)
      .find("td:first")
      .text(row.index() + 1);
    $(row)
      .find('[name^="name"]')
      .attr("name", `name${row.index() + 1}`);
    $(row)
      .find('[name^="barcode"]')
      .attr("name", `barcode${row.index() + 1}`);
    $(row)
      .find('[name^="price"]')
      .attr("name", `price${row.index() + 1}`);
    $(row)
      .find('[name^="purchase_priceafterdiscount"]')
      .attr("name", `purchase_priceafterdiscount${row.index() + 1}`);
    $(row)
      .find('[name^="sellingprice"]')
      .attr("name", `sellingprice${row.index() + 1}`);
    $(row)
      .find('[name^="purchasegst"]')
      .attr("name", `purchasegst${row.index() + 1}`);
    $(row)
      .find('[name^="salegst"]')
      .attr("name", `salegst${row.index() + 1}`);
    $(row)
      .find('[name^="mrp"]')
      .attr("name", `mrp${row.index() + 1}`);
    $(row)
      .find('[name^="mop"]')
      .attr("name", `mop${row.index() + 1}`);
    $(row)
      .find('[name^="quantity"]')
      .attr("name", `quantity${row.index() + 1}`);
    $(row)
      .find('[id^="search-input-name"]')
      .attr("id", `search-input-name${row.index() + 1}`);
    $(row)
      .find('[list^="name"]')
      .attr("list", `name${row.index() + 1}`);
    $(row)
      .find('[id^="name"]')
      .attr("id", `name${row.index() + 1}`);

    productFetchFucntion(`${row.index() + 1}`);
  }
 


  $(document).on("click", ".deletebtn", function () {
    var row = $(this).closest("tr");
    
    // Check if it's the last row
    if ($(".purchase-entry-table tbody tr").length === 1) {
        alert("You cannot delete the last row!");
        return; // Exit the function to prevent deletion
    }

    // Remove the row
    row.remove();
    restoreOriginalPrices();
    calculateNetAmount();
    dueCalculation();

    // Update attributes for remaining rows
    $(".purchase-entry-table tbody tr").each(function () {
        updateAttributes($(this));
    });
});



  let totalAmount = 0;
  let originalTotalAmount = 0;
  let dueAmount = 0;
  
  // Initialize values
  $('input[name="recieved"]').val(0.0);
  $('input[name="totalbillingamount"]').val(0.0);

  // Event listeners for input changes
  $(".purchase-entry-table tbody").on(
    "input change",
    'input[name^="quantity"], input[name^="price"], select[name^="purchasegst"]',
    function () {
      calculateNetAmount();
      dueCalculation();
    }
  );

  // Calculate discount when discount method changes
  $('select[name="discountmethod"]').on("change", function () {
    restoreOriginalPrices();
    calculateDiscount();
    calculateNetAmount();
    dueCalculation();
  });

  // Calculate discount when discount amount changes
  $('input[name="discount"]').on("input change", function () {
    restoreOriginalPrices();
    calculateDiscount();
    calculateNetAmount();
    dueCalculation();
  });

  // Handle received amount changes
  $('input[name="recieved"]').on("input change", function () {
    dueCalculation();
  });

  function calculateNetAmount() {
    calculateDiscount();
    var netAmount = 0;
    var totalTaxAmount = 0;
    var finalOriginal = 0;

    // Calculate original total first
    $(".purchase-entry-table tr:gt(0)").each(function () {
      var quantity = parseInt($(this).find('input[name^="quantity"]').val()) || 0;
      var price = parseFloat($(this).find('input[name^="price"]').val()) || 0;
      var purchaseGst = parseFloat(
        $(this)
          .find('select[name^="purchasegst"]')
          .find(":selected")
          .data("purchasegst")
      ) || 0;
      finalOriginal += (quantity * price) + (quantity * price * (purchaseGst / 100));
    });
    originalTotalAmount = finalOriginal;

    // Calculate amounts after discount
    $(".purchase-entry-table tr:gt(0)").each(function () {
      var quantity = parseInt($(this).find('input[name^="quantity"]').val()) || 0;
      var price = parseFloat($(this).find('input[name^="purchase_priceafterdiscount"]').val()) || 0;
      var purchaseGst = parseFloat(
        $(this)
          .find('select[name^="purchasegst"]')
          .find(":selected")
          .data("purchasegst")
      ) || 0;

      var totalTax = quantity * price * (purchaseGst / 100);
      var totalPrice = quantity * price + totalTax;

      netAmount += totalPrice;
      totalTaxAmount += totalTax;
    });

    // Update form fields with calculated values
    $('input[name="totalbillingamount"]').val(netAmount.toFixed(2));
    $('input[name="recieved"]').val(netAmount.toFixed(2));
    $('input[name="duebalance"]').val(netAmount.toFixed(2));
    $('input[name="totalamount"]').val((netAmount - totalTaxAmount).toFixed(2));
    $('input[name="totaltax"]').val(totalTaxAmount.toFixed(2));
    totalAmount = netAmount;
    dueAmount = netAmount;
  }

  function calculateDiscount() {
    var discount = parseFloat($('input[name="discount"]').val()) || 0;
    var discountMethod = $("#discountmethod").val();
    
    if (discount <= 0) {
      restoreOriginalPrices();
      return;
    }

    var discountPercentage = 0;
    if (discountMethod === "percentage") {
      discountPercentage = discount;
    } else if (discountMethod === "flat") {
      discountPercentage = (discount * 100) / originalTotalAmount;
    }

    // Distribute discount across products
    $(".purchase-entry-table tr:gt(0)").each(function () {
      var price = parseFloat($(this).find('input[name^="price"]').val()) || 0;
      var newPrice = price - (price * (discountPercentage / 100));
      $(this).find('input[name^="purchase_priceafterdiscount"]').val(newPrice.toFixed(2));
    });
  }

  function restoreOriginalPrices() {
    var finalOriginal = 0;
    $(".purchase-entry-table tr:gt(0)").each(function () {
      var originalPrice = parseFloat($(this).find('input[name^="price"]').val());
      if (originalPrice) {
        $(this).find('input[name^="purchase_priceafterdiscount"]').val(originalPrice.toFixed(2));
      }
      
      var quantity = parseInt($(this).find('input[name^="quantity"]').val()) || 0;
      var price = parseFloat($(this).find('input[name^="price"]').val()) || 0;
      var purchaseGst = parseFloat(
        $(this)
          .find('select[name^="purchasegst"]')
          .find(":selected")
          .data("purchasegst")
      ) || 0;
      finalOriginal += (quantity * price) + (quantity * price * (purchaseGst / 100));
    });
    originalTotalAmount = finalOriginal;
  }

  function dueCalculation() {
    let recieved = parseFloat($('input[name="recieved"]').val()) || 0;
    let duebal = dueAmount - recieved;

    
    if (Math.abs(duebal) <= 0.01) {
      duebal = 0.00;
    }

    $('input[name="duebalance"]').val(duebal.toFixed(2));
  }


});





// this script is for supplier form pop up modal in purchase form

$(document).ready(function () {
  $(".addsupplierbtn").click(function () {
    $("#confirmationModal").show();
  });

  $("#cancelButton").click(function () {
    $("#confirmationModal").hide();
  });
});

// this script is to calculate final due in purchasedue and saledue form

$(document).ready(function () {
  var finalvalue = 0.0;

  $(".saleamountrecieveddue").on("input change", function () {
    calculateFinalDue();
  });

  $(".purchaseamountrecieveddue").on("input change", function () {
    calculateFinalDue();
  });


  function calculateFinalDue() {
    let finalDue = $(".due").val() || 0;
    let amount = $(".amount").val() || 0;
    finalvalue = parseFloat(finalDue) - parseFloat(amount);
    $(".finaldue").val(finalvalue.toFixed(2));
  }
});



// #####################################################
// ##############  Purchase Return Section #############
// #####################################################

const purchaseReturnFormValidation = function () {
  $("#purchasereturnform").submit(function (event) {
    event.preventDefault();
    let status = false;
   
    // enable tax select element
    $(".purchasereturn-tax-select").prop("disabled", false);

    // Check if at least one checkbox is checked
    if ($("[name^='productcheck']:checked").length === 0) {
      status = true;
      alert("Please check at least one product row.");
      return false;
    }

    // Iterate through checked checkboxes
    $("[name^='productcheck']:checked").each(function () {
      var rowIndex = this.name.match(/\d+/)[0];

      // Get return quantity and refund amount inputs for the current row
      var returnQtyInput = $("#returnqty" + rowIndex);
      var refundAmountInput = $("#refundamount" + rowIndex);

      // Check if return quantity and refund amount are empty
      if (!returnQtyInput.val() || !refundAmountInput.val()) {
        status = true;
        // Alert and prevent form submission
        alert(
          "Please fill in return quantity and refund amount for the checked rows.",
        );
        location.reload();
        return false;
        
      }

      let returnQtyInput2 = parseFloat($("#returnqty" + rowIndex).val());
      let availableQuantity = parseFloat($("#qtynow" + rowIndex).val());
      let product = $("#product" + rowIndex).val();

     

      if(availableQuantity < returnQtyInput2){


        status = true;
        // Alert and prevent form submission
        alert(
          `Only ${availableQuantity} ${product} left in stock`,
        );
        location.reload();
        return false;
      }

    });

    // If all checks pass, the form will be submitted
    if (!status) {
      $("#purchasereturnform")[0].submit();
    }

      // disable tax select element
    $(".purchasereturn-tax-select").prop("disabled", true);
  });
};

purchaseReturnFormValidation();


$(document).ready(function () {
  let totalAmount = 0;
  let taxFinal = 0;
  let qtyFinal = 0;
  let adjustment = 0;
  let originalTotalAmount = 0;
  let isAdjustmentChange = false;

  // Keep existing checkbox change handler
  $(".purchase-return-table tbody tr [name^='productcheck']").change(
    function () {


      purchaseReturnFormValidation();

      let closestTr = $(this).closest("tr");

      if ($(this).prop("checked")) {
        closestTr.find("[name^='returnqty']").removeAttr("readonly");
        closestTr.find("[name^='reason']").removeAttr("disabled");
      } else {
        closestTr.find("[name^='returnqty']").attr("readonly", true);
        closestTr.find("[name^='rate']").attr("readonly", true);
        closestTr.find("[name^='tax']").attr("disabled", true);
        closestTr.find("[name^='refundamount']").attr("readonly", true);
        closestTr.find("[name^='refundamount']").val("");
        closestTr.find("[name^='reason']").attr("disabled", true);
        closestTr.find("[name^='returnqty']").val("");
        calculateNetAmount()
      }
    },
  );

  function restoreOriginalPrices() {
    $(".purchase-return-table tr:gt(0)").each(function () {
      if ($(this).find("[name^='productcheck']").prop("checked")) {
        var originalPrice = parseFloat($(this).find('input[name^="price"]').val());
        if (originalPrice) {
          $(this).find('input[name^="priceafteradjustment"]').val(originalPrice.toFixed(2));
          // $(this).find('input[name^="rate"]').val(originalPrice.toFixed(2));
        }
      }
    });
  }

  function calculateOriginalTotal() {
    var finalOriginal = 0;
    $(".purchase-return-table tr:gt(0)").each(function () {
      if ($(this).find("[name^='productcheck']").prop("checked")) {
        let returnQty = parseInt($(this).find('input[name^="returnqty"]').val()) || 0;
        let price = parseFloat($(this).find('input[name^="price"]').val()) || 0;
        let tax = parseFloat($(this).find('select[name^="tax"]').find(":selected").data("tax")) || 0;
        finalOriginal += ((returnQty * price) + (returnQty * price * (tax / 100)));
      }
    });
    originalTotalAmount = finalOriginal;
  }

  function applyAdjustment() {
    let adjustmentVal = parseFloat($("#adjustment").val()) || 0;
    if (adjustmentVal <= 0) {
      restoreOriginalPrices();
      return;
    }

    calculateOriginalTotal();
    let adjustmentPercentage = (adjustmentVal * 100) / originalTotalAmount;

    $(".purchase-return-table tr:gt(0)").each(function () {
      if ($(this).find("[name^='productcheck']").prop("checked")) {
        let originalPrice = parseFloat($(this).find('input[name^="price"]').val()) || 0;
        let newPrice = originalPrice - (originalPrice * (adjustmentPercentage / 100));
        $(this).find('input[name^="priceafteradjustment"]').val(newPrice.toFixed(2));
        // $(this).find('input[name^="rate"]').val(newPrice.toFixed(2));
      }
    });
  }

  function calculateNetAmount() {
    var netAmount = 0;
    var totalTaxAmount = 0;
    let totalQty = 0;

    $(".purchase-return-table tr:gt(0)").each(function () {
      if ($(this).find("[name^='productcheck']").prop("checked")) {
        let returnQty = parseInt($(this).find('input[name^="returnqty"]').val()) || 0;
        // let rate = parseFloat($(this).find('input[name^="rate"]').val()) || 0;
        let rate = parseFloat($(this).find('input[name^="priceafteradjustment"]').val()) || 0; //added24-11-2024
        let tax = parseFloat($(this).find('select[name^="tax"]').find(":selected").data("tax")) || 0;
        
        let rowAmount = returnQty * rate;
        let rowTax = rowAmount * (tax / 100);
        let totalRowAmount = rowAmount + rowTax;

        netAmount += totalRowAmount;
        totalTaxAmount += rowTax;
        totalQty += returnQty;

        $(this).find('input[name^="refundamount"]').val(totalRowAmount.toFixed(2));
      }
    });

    if (!isAdjustmentChange) {
      $('input[name="totalamount"]').val(netAmount.toFixed(2));
      totalAmount = netAmount;
    }

    // $('input[name="totalamount"]').val(netAmount.toFixed(2));
    $('input[name="totalqty"]').val(totalQty);
    $('input[name="totaltax"]').val(totalTaxAmount.toFixed(2));
    $("#nettotal").val(netAmount.toFixed(2));

    totalAmount = netAmount;
    taxFinal = totalTaxAmount;
    qtyFinal = totalQty;
  }

  $("#adjustment").on("change input", function() {
    isAdjustmentChange = true;
    restoreOriginalPrices();
    applyAdjustment();
    calculateNetAmount();
    isAdjustmentChange = false;
  });

  $(".purchase-return-table tbody tr [name^='returnqty']").on("change input",function () {
    let closestTr = $(this).closest("tr");
    if (!$(this).val()) {
      closestTr.find("[name^='refundamount']").val("");
      calculateNetAmount();
      return false;
    }

    let avqty = parseInt(closestTr.find("[name^='availablequantity']").val());
    let rqty = parseInt($(this).val());

    if (rqty > avqty) {
      alert("Quantity Should not be greater than Available Quantity");
      $(this).val("");
      return false;
    }

    applyAdjustment();
    calculateNetAmount();
  });

  $(".purchase-return-table tbody tr [name^='rate']").on("change input",function () {
    calculateNetAmount();
  });

  $(".purchase-return-table tbody tr select[name^='tax']").on("change input",function () {
    calculateNetAmount();
  });
});




// ########################################################
// ############### sales section ###########################
// ########################################################

$(document).ready(function () {
  $("#saleDueForm").submit(function (event) {
    event.preventDefault();

    let submitStatus = false;

    let previousDue = $(".saleprevdue").val();
    let amountPaid = $(".saleamountrecieveddue").val();
    console.log("prev", previousDue, "amount rec", amountPaid);
    if (parseFloat(amountPaid) > parseFloat(previousDue)) {
      submitStatus = true;
      alert("Amount Recieved is larger than Previous Due");
      return false; // Stop further processing
    }

    if (!submitStatus) {
      $("#saleDueForm")[0].submit();
    }
  });
});

$(document).ready(function () {
  $(".sale_category").change(function () {
    var category = $(this).val();

    console.log(category);

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_subcategory_by_category/",
      type: "POST",
      data: { category: category },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!");
        console.log("response..", response);

        // Assuming you have initialized Selectize.js on the #expensetype element
        var $expensetypeSelect = $(".sale_subcategory")[0].selectize;

        // Clear existing options
        $expensetypeSelect.clearOptions();

        // Add new options
        $.each(response.subcategory, function (index, element) {
          console.log(element);
          $expensetypeSelect.addOption({ value: element, text: element });
        });

        // Refresh Selectize.js to update the UI
        $expensetypeSelect.refreshItems();

        // Set the selected option to the default (if needed)
        $expensetypeSelect.setValue("", false);

        // Trigger the change event to update Selectize.js
        $expensetypeSelect.trigger("change");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        $(".sale_subcategory").empty();
        $(".sale_subcategory").prepend(
          "<option value='' selected >Select SubCategory</option>",
        );
      },
    });
  });
});

// sale form validation

$(document).ready(function () {
  const salesFormValidation = function () {
    $("#salesForm").submit(function (event) {
      event.preventDefault(); // Prevent default form submission
      
      $(".saledisabledselectinsale").prop("disabled", false);
      var submitStatus = false; // Flag to track validation failures
      
      // Check for duplicate products and empty product names in purchase-entry-table
      var products = [];
      $(".sale-entry-table tbody tr").each(function () {
        var product = $(this).find('[name^="salename"]').val();

        console.log("product",product)
        
        // Check if product name is empty
        if (!product || product.trim() === "") {
          submitStatus = true;
          alert("Please select a product for all rows in the invoice entries.");
          return false; // Stop further processing
        }

        
        // Check for duplicates
        if (products.includes(product)) {
          submitStatus = true;
          alert("Duplicate product in invoice entries.");
          return false;
        }
        products.push(product);
        
        // Rest of the validation checks
        var unitprice = $(this).find('[name^="saleprice"]').val();
        if (unitprice === "" || unitprice === undefined || unitprice == "") {
          submitStatus = true;
          alert("Unit Price is required.");
          return false;
        }

        if (unitprice < 1) {
          submitStatus = true;
          alert("Unit Price should be greater than 0.");
          return false;
        }


        let finalAmount = $(".saletotalbillingamount").val();
        let amountRecieved = $(".amountrecievedsales").val();
        
        if (parseFloat(amountRecieved) > parseFloat(finalAmount)) {
          submitStatus = true;
          alert("Amount Recieved is larger than Final Amount.");
          return false;
        }

        var salegst = $(this).find('[name^="salegstsale"]').val();
        if (salegst === "" || salegst === undefined || salegst == "") {
          submitStatus = true;
          alert("Sales GST is required.");
          return false;
        }

        var quantity = $(this).find('[name^="salequantity"]').val();
        if (quantity === "" || quantity === undefined || quantity == "") {
          submitStatus = true;
          alert("Quantity is required.");
          return false;
        }

        var mrp = $(this).find('[name^="salemrp"]').val();
        if (mrp === "" || mrp === undefined || mrp == "") {
          submitStatus = true;
          alert("MRP is required.");
          return false;
        }

        var mop = $(this).find('[name^="salemop"]').val();
        if (mop === "" || mop === undefined || mop == "") {
          submitStatus = true;
          alert("MOP is required.");
          return false;
        }
      });
      
      var invoicenumber = $(this).find('[name^="saleinvoicenumber"]').val();
      if (invoicenumber === "" || invoicenumber === undefined || invoicenumber === null) {
        submitStatus = true;
        alert("Invoice Number is required.");
        return false;
      }

      var customer = $(this).find('[name^="customer"]').val();
      if (customer === "" || customer === undefined || customer === null) {
        submitStatus = true;
        alert("Customer is required.");
        return false;
      }

      var paymentmode = $(this).find('[name^="salepaymentmode"]').val();
      if (paymentmode === "" || paymentmode === undefined || paymentmode == "") {
        submitStatus = true;
        alert("Payment Mode is required.");
        return false;
      }

      // If no validation failures found, submit the form
      if (!submitStatus) {
        $("#salesForm")[0].submit();
      }
    });
  };

  $(".amountrecievedsales").on("change", function () {
    salesFormValidation();
  });

  salesFormValidation();
});








$(document).ready(function () {
  $(".sale-status").click(function () {
    $("#saleconfirmationModal").show();
  });

  $("#cancelButton").click(function () {
    $("#saleconfirmationModal").hide();
  });
});

// checking quanty and available quantity in sales

function saleQtyChecking(num){
  $(`.sale-entry-table tbody tr [name^='salequantity${num}']`).on("input change",
    function () {
      console.log("qty- quantity changed from quantity checking", $(this).val());
      let closestTr = $(this).closest("tr");
      if (
        $(this).val() == "" ||
        $(this).val() == undefined ||
        $(this).val() == null
      ) {
      } else {
        if (
          parseInt($(this).val()) >
          parseInt(closestTr.find("[name^='availablesaleqty']").val())
        ) {
          alert(
            `Available Quantity is ${closestTr
              .find("[name^='availablesaleqty']")
              .val()}`,
          );
          $(this).val("");
        }
      }
    },
  );
};

// #####fetching product in sales entry using barcode

const productFetchFucntionSalesUsingProductName = function (num) {
  $(`.sale-entry-table input[name="salename${num}"]`).on("change input", function () {
    const product = $(this).val();
    if (!product) {
      $(
        `.sale-entry-table select[name='salegstsale${num}'] option[value='']`,
      ).prop("selected", true);

      $(`.sale-entry-table input[name="salequantity${num}"]`).val("");
      $(`.sale-entry-table input[name="salebarcode${num}"]`).val("");
      $(`.sale-entry-table input[name="availablesaleqty${num}"]`).val("");

      // ###### 17/10/2024
      $(`.sale-entry-table input[name="saleprice${num}"]`).val("");
      $(`.sale-entry-table input[name="sale_priceafterdiscount${num}"]`).val("");
      $(`.sale-entry-table input[name="salemrp${num}"]`).val("");
      $(`.sale-entry-table input[name="salemop${num}"]`).val("");
      return;
    }
    // console.log(product);

    let csrftoken = csrf_token;

    $.ajax({
      url: "/get_product_details_by_product/",
      type: "POST",
      data: { product: product },
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("resp", response);
        if (response.Response == "Product not found") {
          $.toast({
            heading: "Error",
            text: "Product not found!",
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });

          $(
            `.sale-entry-table select[name='salegstsale${num}'] option[value='']`,
          ).prop("selected", true);

          $(`.sale-entry-table input[name="salequantity${num}"]`).val("");
          $(`.sale-entry-table input[name="salebarcode${num}"]`).val("");
          $(`.sale-entry-table input[name="availablesaleqty${num}"]`).val("");
          // ###### 17/10/2024
          $(`.sale-entry-table input[name="saleprice${num}"]`).val("");
          $(`.sale-entry-table input[name="sale_priceafterdiscount${num}"]`).val("");
          $(`.sale-entry-table input[name="salemrp${num}"]`).val("");
          $(`.sale-entry-table input[name="salemop${num}"]`).val("");
        } else {

        
          $(`.sale-entry-table input[name="salequantity${num}"]`).val("");

          $(`.sale-entry-table input[name="saleprice${num}"]`).val(
            response.Response.sellingprice,
          );

          $(`.sale-entry-table input[name="sale_priceafterdiscount${num}"]`).val(
            response.Response.sellingprice,
          );
          $(`.sale-entry-table input[name="salemrp${num}"]`).val(
            response.Response.mrp,
          );
          $(`.sale-entry-table input[name="salemop${num}"]`).val(
            response.Response.mop,
          );
          $(`.sale-entry-table input[name="availablesaleqty${num}"]`).val(
            response.Response.available_qty,
          );

          let salegst = response.Response.salegst;
          $(
            `.sale-entry-table select[name='salegstsale${num}'] option[value='${salegst}']`,
          ).prop("selected", true);

          let productName = response.Response.product;

          $(`.sale-entry-table input[name='salename${num}']`).val(productName);

          if (Object.keys(response.Response).length == 0) {
            $(
              `.sale-entry-table select[name='salegstsale${num}'] option[value='']`,
            ).prop("selected", true);

            $(`.sale-entry-table input[name="salequantity${num}"]`).val("");
            $(`.sale-entry-table input[name="salebarcode${num}"]`).val("");
            $(`.sale-entry-table input[name="availablesaleqty${num}"]`).val("");
            // ###### 17/10/2024
            $(`.sale-entry-table input[name="saleprice${num}"]`).val("");
           $(`.sale-entry-table input[name="sale_priceafterdiscount${num}"]`).val("");
            $(`.sale-entry-table input[name="salemrp${num}"]`).val("");
            $(`.sale-entry-table input[name="salemop${num}"]`).val("");
          }

        }




        $('.sale-entry-table input[name^="salequantity"]').trigger('change');
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });
};

// #####fetching product in sales entry using barcode

const productFetchFucntionSales = function (num) {
  $(`.sale-entry-table input[name="salebarcode${num}"]`).on(
    "change",
    function () {
      const barcode = $(this).val();

      if (!barcode) {
        $(
          `.sale-entry-table select[name='salegstsale${num}'] option[value='']`,
        ).prop("selected", true);

        $(`.sale-entry-table input[name="salequantity${num}"]`).val("");
        $(`.sale-entry-table input[name="salebarcode${num}"]`).val("");
        $(`.sale-entry-table input[name="availablesaleqty${num}"]`).val("");
        // ###### 17/10/2024
        $(`.sale-entry-table input[name="saleprice${num}"]`).val("");
        $(`.sale-entry-table input[name="sale_priceafterdiscount${num}"]`).val("");
        $(`.sale-entry-table input[name="salemrp${num}"]`).val("");
        $(`.sale-entry-table input[name="salemop${num}"]`).val("");

      
        return;
      }
     

      let csrftoken = csrf_token;

      $.ajax({
        url: "/get_product_details_by_barcode/",
        type: "POST",
        data: { barcode: barcode },
        contentType: "application/json",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        success: function (response) {
          console.log("resp pp", response);
          if (response.Response == "Product not found") {
            $.toast({
              heading: "Error",
              text: "Product not found!",
              icon: "error",
              bgColor: "red",
              textColor: "white",
              position: "top-center",
              hideAfter: 4000,
            });

            $(
              `.sale-entry-table select[name='salegstsale${num}'] option[value='']`,
            ).prop("selected", true);

            $(`.sale-entry-table input[name="salequantity${num}"]`).val("");
            $(`.sale-entry-table input[name="salebarcode${num}"]`).val("");
            $(`.sale-entry-table input[name="availablesaleqty${num}"]`).val("");
            // ###### 17/10/2024
            $(`.sale-entry-table input[name="saleprice${num}"]`).val("");
            $(`.sale-entry-table input[name="sale_priceafterdiscount${num}"]`).val("");
            $(`.sale-entry-table input[name="salemrp${num}"]`).val("");
            $(`.sale-entry-table input[name="salemop${num}"]`).val("");

         

           
          } else {
            $(`.sale-entry-table input[name="saleprice${num}"]`).val(
              response.Response.sellingprice,
            );
            $(`.sale-entry-table input[name="sale_priceafterdiscount${num}"]`).val(
              response.Response.sellingprice,
            );
            $(`.sale-entry-table input[name="salemrp${num}"]`).val(
              response.Response.mrp,
            );
            $(`.sale-entry-table input[name="salemop${num}"]`).val(
              response.Response.mop,
            );
            $(`.sale-entry-table input[name="availablesaleqty${num}"]`).val(
              response.Response.available_qty,
            );

            let salegst = response.Response.salegst;
            $(
              `.sale-entry-table select[name='salegstsale${num}'] option[value='${salegst}']`,
            ).prop("selected", true);

            let productName = response.Response.product;

            $(`.sale-entry-table input[name='salename${num}']`).val(
              productName,
            );

            if (Object.keys(response.Response).length == 0) {
              $(
                `.sale-entry-table select[name='salegstsale${num}'] option[value='']`,
              ).prop("selected", true);

              $(`.sale-entry-table input[name="salequantity${num}"]`).val("");
              $(`.sale-entry-table input[name="salebarcode${num}"]`).val("");
              $(`.sale-entry-table input[name="availablesaleqty${num}"]`).val(
                "",
              );
              // ###### 17/10/2024
            $(`.sale-entry-table input[name="saleprice${num}"]`).val("");
            $(`.sale-entry-table input[name="sale_priceafterdiscount${num}"]`).val("");
            $(`.sale-entry-table input[name="salemrp${num}"]`).val("");
            $(`.sale-entry-table input[name="salemop${num}"]`).val("");

            }

           
    
          }




         


          $('.sale-entry-table input[name^="salequantity"]').trigger('change');

        },
        error: function (errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    },
  );
};

// This script append new row to sale table
$(document).ready(function () {
  productFetchFucntionSales("1");
  productFetchFucntionSalesUsingProductName("1");
  saleQtyChecking("1");

  // Use event delegation to handle click events for dynamically added buttons
  $(document).on("click", ".addrowbtn", function () {
    const lastRow = $(".sale-entry-table tbody tr:last");

    console.log("last row", lastRow.find('[name^="salename"]').val());

    // Check how many rows currently exist
    let rowCount = $(".sale-entry-table tbody tr").length;

    // Check if the last row's input with name starting with "salename" has a value
    if (lastRow.find('[name^="salename"]').val() !== "") {
      rowCount++; // Increment rowCount by 1

      const newRow = lastRow.clone(); // Clone the last row

      // Update the row number in the new row
      newRow.find("td:first").text(rowCount);

      // Increment the numeric part of input names and IDs in the new row
      newRow.find('[name^="salename"]').attr("name", `salename${rowCount}`);
      newRow.find('[name^="salebarcode"]').attr("name", `salebarcode${rowCount}`);
      newRow.find('[name^="saleprice"]').attr("name", `saleprice${rowCount}`);
      newRow.find('[name^="sale_priceafterdiscount"]').attr("name", `sale_priceafterdiscount${rowCount}`);
      newRow.find('[name^="salegstsale"]').attr("name", `salegstsale${rowCount}`);
      newRow.find('[name^="salemrp"]').attr("name", `salemrp${rowCount}`);
      newRow.find('[name^="salemop"]').attr("name", `salemop${rowCount}`);
      newRow.find('[name^="salequantity"]').attr("name", `salequantity${rowCount}`);
      newRow.find('[name^="availablesaleqty"]').attr("name", `availablesaleqty${rowCount}`);
      newRow.find('[id^="sale-search-input-name"]').attr("id", `sale-search-input-name${rowCount}`);
      newRow.find('[list^="salename"]').attr("list", `salename${rowCount}`);
      newRow.find('[id^="salename"]').attr("id", `salename${rowCount}`);

      // Clear the input values in the new row (optional)
      newRow.find('input[type="text"]').val("");
      newRow.find('input[type="number"]').val("");

      lastRow.find(".addrowbtn").remove();
      lastRow.find(".puchase-qty-left").html(
        '<span class="deletebtnsales"><i class="fa-solid fa-minus"></i></span>'
      );

      // Append the new row to the table body
      $(".sale-entry-table tbody").append(newRow);

      // Call necessary functions for the new row
      productFetchFucntionSales(`${rowCount}`);
      productFetchFucntionSalesUsingProductName(`${rowCount}`);
      saleQtyChecking(`${rowCount}`);
    }
  });
});






//this script do the Total quantity, Net quantity ,
// Discount calculations when entering values in sale form (addsale.html)
//this script do the Total quantity, Net quantity ,
// Discount calculations when entering values in sale form (addsale.html)
$(document).ready(function () {

    // Function to update the attributes based on the row index
    function updateAttributesSales(row) {
      $(row)
        .find("td:first")
        .text(row.index() + 1);
      $(row)
        .find('[name^="salename"]')
        .attr("name", `salename${row.index() + 1}`);
      $(row)
        .find('[name^="salebarcode"]')
        .attr("name", `salebarcode${row.index() + 1}`);
      $(row)
        .find('[name^="saleprice"]')
        .attr("name", `saleprice${row.index() + 1}`);
  
        $(row)
        .find('[name^="sale_priceafterdiscount"]')
        .attr("name", `sale_priceafterdiscount${row.index() + 1}`);
  
      $(row)
        .find('[name^="salegstsale"]')
        .attr("name", `salegstsale${row.index() + 1}`);
      $(row)
        .find('[name^="salemrp"]')
        .attr("name", `salemrp${row.index() + 1}`);
      $(row)
        .find('[name^="salemop"]')
        .attr("name", `salemop${row.index() + 1}`);
      $(row)
        .find('[name^="salequantity"]')
        .attr("name", `salequantity${row.index() + 1}`);
      $(row)
        .find('[name^="availablesaleqty"]')
        .attr("name", `availablesaleqty${row.index() + 1}`);
      $(row)
        .find('[id^="sale-search-input-name"]')
        .attr("id", `sale-search-input-name${row.index() + 1}`);
      $(row)
        .find('[list^="salename"]')
        .attr("list", `salename${row.index() + 1}`);
      $(row)
        .find('[id^="salename"]')
        .attr("id", `salename${row.index() + 1}`);
  
      productFetchFucntionSales(`${row.index() + 1}`);
      productFetchFucntionSalesUsingProductName(`${row.index() + 1}`);
      saleQtyChecking(`${row.index() + 1}`);
    }
   

    
  var totalAmount = 0;
  var originalTotalAmount = 0; // Store the original total amount
  $('input[name="salerecieved"]').val(0.0);
  $('input[name="saletotalbillingamount"]').val(0.0);

  // Trigger the calculation when the quantity or unit price inputs change
  $(".sale-entry-table tbody").on(
    "input change",
    'input[name^="salequantity"], input[name^="saleprice"], select[name^="salegstsale"]',
    function () {
      console.log("sale price changed")
      calculateNetAmountsale();
      // calculateDiscountsale();
      dueCalculationsale();
    }
  );
  
  $(document).on("click", ".deletebtnsales", function () {

      var row = $(this).closest("tr");

      if ($(".sale-entry-table tbody tr").length === 1) {
        alert("You cannot delete the last row!");
        return; // Exit the function to prevent deletion
    }
  
      row.remove();
      // Update attributes for remaining rows
      $(".sale-entry-table tbody tr").each(function () {
        updateAttributesSales($(this));
      });
      restoreOriginalPrices()
    calculateNetAmountsale();
    dueCalculationsale();
});





   // Calculate discount when discount method changes
   $('select[name="salediscountmethod"]').on("change", function () {
    restoreOriginalPrices()
    calculateDiscountsale();
    calculateNetAmountsale();
    dueCalculationsale();
  });

  // Calculate discount when discount changes
  $('input[name="salediscount"]').on("input change", function () {
    restoreOriginalPrices()
    calculateDiscountsale();
    calculateNetAmountsale();
    dueCalculationsale();
  });


  $('input[name="salerecieved"]').on("input change", function () {
    dueCalculationsale();
  });



  function calculateNetAmountsale() {

    calculateDiscountsale();

    var netAmount = 0;
    var totalTaxAmount = 0;
    var finalOriginal = 0
    $(".sale-entry-table tr:gt(0)").each(function (index) {
      var quantity =
        parseInt($(this).find('input[name^="salequantity"]').val()) || 0;
      var price =
        $(this).find('input[name^="saleprice"]').val()
      price = price === '' ? 0 : parseFloat(price) || 0;
      console.log("sale price.....",price)
      console.log("quantity......",quantity)
      var saleGst =
        parseFloat(
          $(this)
            .find('select[name^="salegstsale"]')
            .find(":selected")
            .data("salegstsale")
        ) || 0;
      finalOriginal +=   ((quantity * price) + (quantity * price * (saleGst / 100))) ;
    })
    originalTotalAmount=finalOriginal

    calculateDiscountsale();

    // Loop through each row in the table
    $(".sale-entry-table tr:gt(0)").each(function (index) {
      var quantity =
        parseInt($(this).find('input[name^="salequantity"]').val()) || 0;
      var price =
        parseFloat($(this).find('input[name^="sale_priceafterdiscount"]').val()) || 0;
      var saleGst =
        parseFloat(
          $(this)
            .find('select[name^="salegstsale"]')
            .find(":selected")
            .data("salegstsale")
        ) || 0;

      var totalTax = quantity * price * (saleGst / 100);
      var totalPrice = quantity * price + totalTax;

      netAmount += totalPrice;
      totalTaxAmount += totalTax;
    });

   
    // Set the calculated net amount in the input field and round to two decimal places
    $('input[name="saletotalbillingamount"]').val(netAmount.toFixed(2));
    $('input[name="salerecieved"]').val(netAmount.toFixed(2));
    $('input[name="saleduebalance"]').val(netAmount.toFixed(2));
    $('input[name="saletotalamount"]').val((netAmount - totalTaxAmount).toFixed(2));
    $('input[name="saletotaltax"]').val(totalTaxAmount.toFixed(2));
    totalAmount = netAmount;
    console.log("final amount",netAmount)
   
  }



  function calculateDiscountsale() {
    var discount = parseFloat($('input[name="salediscount"]').val()) || 0;
    var discountMethod = $("#salediscountmethod").val();
      if (discount <= 0) {
        restoreOriginalPrices(); 
        return;
      }
   
  
    var discountPercentage = 0;
    if (discountMethod === "percentage") {
      discountPercentage = discount;
    } else if (discountMethod === "flat") {
      discountPercentage = (discount * 100) / originalTotalAmount;
    }

    // Distribute the discount across products
    $(".sale-entry-table tr:gt(0)").each(function (index) {
      var price = $(this).find('input[name^="saleprice"]').val();
      price = price === '' ? 0 : parseFloat(price) || 0;
      // console.log("price....",price)
      
      var newPrice = price - price * (discountPercentage / 100);
      console.log('new price after disc',newPrice)
      $(this).find('input[name^="sale_priceafterdiscount"]').val(newPrice.toFixed(2)); 
    });
  }

    // Restore original prices function
    function restoreOriginalPrices() {
      var finalOriginal = 0
      $(".sale-entry-table tr:gt(0)").each(function (index) {
        var originalPrice = parseFloat($(this).find('input[name^="saleprice"]').val())
        if (originalPrice) {
          $(this).find('input[name^="sale_priceafterdiscount"]').val(originalPrice.toFixed(2)); 
        }
        var quantity =
        parseInt($(this).find('input[name^="salequantity"]').val()) || 0;
      var price =
        $(this).find('input[name^="saleprice"]').val()
      price = price === '' ? 0 : parseFloat(price) || 0;
      var saleGst =
        parseFloat(
          $(this)
            .find('select[name^="salegstsale"]')
            .find(":selected")
            .data("salegstsale")
        ) || 0;
        finalOriginal +=   ((quantity * price) + (quantity * price * (saleGst / 100))) ;

      });
      originalTotalAmount=finalOriginal
    }

    
  function dueCalculationsale() {
    let total = parseFloat($('input[name="saletotalbillingamount"]').val()) || 0;
    let recieved = parseFloat($('input[name="salerecieved"]').val()) || 0;
    let duebal = total - recieved;


    $('input[name="saleduebalance"]').val(duebal.toFixed(2));
  }
});


// changes when clicking on addsalediscount saleform
 

// this script is for customer form pop up modal in sale form

$(document).ready(function () {
  $(".addcustomerbtn").click(function () {
    $(".confirmationModal").show();
  });

  $(".cancelButton").click(function () {
    $(".confirmationModal").hide();
  });
});


// #############################################
// ##############  Sales Return Section ########
// #############################################


// Modify the form validation to enable tax dropdowns
const salesReturnFormValidation = function () {
  $("#salesreturnform").submit(function (event) {
    event.preventDefault();
    let status = false;

    if ($("[name^='productcheck']:checked").length === 0) {
      status = true;
      alert("Please check at least one product row.");
      return false;
    }

    $("[name^='productcheck']:checked").each(function () {
      var rowIndex = this.name.match(/\d+/)[0];
      var returnQtyInput = $("#returnqty-sale" + rowIndex);
      var refundAmountInput = $("#refundamount-sale" + rowIndex);

      if (!returnQtyInput.val() || !refundAmountInput.val()) {
        status = true;
        alert("Please fill in return quantity and refund amount for the checked rows.");
        location.reload();
        return false;
      }
    });

    if (!status) {
      // Enable tax dropdowns before submission
      $("[name^='productcheck']:checked").each(function () {
        var rowIndex = this.name.match(/\d+/)[0];
        $("#tax-sale" + rowIndex).prop('readonly', false);
      });

      $("#salesreturnform")[0].submit();

      // Disable tax dropdowns after submission
      setTimeout(function() {
        $("[name^='tax-sale']").prop('readonly', true);
      }, 100);
    }
  });
};

salesReturnFormValidation()



$(document).ready(function () {
  let totalAmount = 0;
  let taxFinal = 0;
  let qtyFinal = 0;
  let discount = 0;
  let originalTotalAmount = 0;
  let isAdjustmentChange = false;

  // Keep existing checkbox change handler with additions for new field
  $(".sales-return-table tbody tr [name^='productcheck']").change(function () {
   
    salesReturnFormValidation()
   
    let closestTr = $(this).closest("tr");

    if ($(this).prop("checked")) {
      closestTr.find("[name^='returnqty-sale']").removeAttr("readonly");
      closestTr.find("[name^='reason-sale']").removeAttr("disabled");
    } else {
      
      closestTr.find("[name^='returnqty-sale']").val("");
      closestTr.find("[name^='returnqty-sale']").attr("readonly", true);
      closestTr.find("[name^='reason-sale']").attr("disabled", true);
      closestTr.find("[name^='refundamount-sale']").val("");
      calculateNetAmount();
    }
  });

  function restoreOriginalPrices() {
    $(".sales-return-table tr:gt(0)").each(function () {
      if ($(this).find("[name^='productcheck']").prop("checked")) {
        var originalPrice = parseFloat($(this).find('input[name^="price-sale"]').val());
        if (originalPrice) {
          $(this).find('input[name^="priceafteradjustment-sale"]').val(originalPrice.toFixed(2));
          // $(this).find('input[name^="rate-sale"]').val(originalPrice.toFixed(2));
        }
      }
    });
  }

  function calculateOriginalTotal() {
    var finalOriginal = 0;
    $(".sales-return-table tr:gt(0)").each(function () {
      if ($(this).find("[name^='productcheck']").prop("checked")) {
        let returnQty = parseInt($(this).find('input[name^="returnqty-sale"]').val()) || 0;
        let price = parseFloat($(this).find('input[name^="price-sale"]').val()) || 0;
        let tax = parseFloat($(this).find('select[name^="tax-sale"]').find(":selected").data("tax")) || 0;
        finalOriginal += ((returnQty * price) + (returnQty * price * (tax / 100)));
      }
    });
    originalTotalAmount = finalOriginal;
  }

  function calculateNetAmount() {
    var netAmount = 0;
    var totalTaxAmount = 0;
    let totalQty = 0;

    // Calculate amounts after discount
    $(".sales-return-table tr:gt(0)").each(function () {
      if ($(this).find("[name^='productcheck']").prop("checked")) {
        let returnQty = parseInt($(this).find('input[name^="returnqty-sale"]').val()) || 0;
        // let rate = parseFloat($(this).find('input[name^="rate-sale"]').val()) || 0;
        let rate = parseFloat($(this).find('input[name^="priceafteradjustment-sale"]').val()) || 0;
        let tax = parseFloat($(this).find('select[name^="tax-sale"]').find(":selected").data("tax")) || 0;
        
        let rowAmount = returnQty * rate;
        let rowTax = rowAmount * (tax / 100);
        let totalRowAmount = rowAmount + rowTax;

        $(this).find('input[name^="refundamount-sale"]').val(totalRowAmount.toFixed(2));

        netAmount += totalRowAmount;
        totalTaxAmount += rowTax;
        totalQty += returnQty;
      }
    });

    // Only update totalamount if it's not an adjustment change
    if (!isAdjustmentChange) {
      $('input[name="totalamount-sale"]').val(netAmount.toFixed(2));
      totalAmount = netAmount;
    }

    $('input[name="totalqty-sale"]').val(totalQty);
    $('input[name="totaltax-sale"]').val(totalTaxAmount.toFixed(2));
    $("#nettotal-sale").val((netAmount - discount).toFixed(2));

    taxFinal = totalTaxAmount;
    qtyFinal = totalQty;
  }

  function applyAdjustment() {
    let discountVal = parseFloat($("#discount-sale").val()) || 0;
    if (discountVal <= 0) {
      restoreOriginalPrices();
      return;
    }

    calculateOriginalTotal();
    let discountPercentage = (discountVal * 100) / originalTotalAmount;

    $(".sales-return-table tr:gt(0)").each(function () {
      if ($(this).find("[name^='productcheck']").prop("checked")) {
        let originalPrice = parseFloat($(this).find('input[name^="price-sale"]').val()) || 0;
        let newPrice = originalPrice - (originalPrice * (discountPercentage / 100));
        $(this).find('input[name^="priceafteradjustment-sale"]').val(newPrice.toFixed(2));
        // $(this).find('input[name^="rate-sale"]').val(newPrice.toFixed(2));
      }
    });
  }

  $("#discount-sale").on("change input", function() {
    isAdjustmentChange = true;
    restoreOriginalPrices();
    applyAdjustment();
    calculateNetAmount();
    isAdjustmentChange = false;
  });

  $(".sales-return-table tbody tr [name^='returnqty-sale']").on("change input",function () {
    let closestTr = $(this).closest("tr");
    if (!$(this).val()) {
      closestTr.find("[name^='refundamount-sale']").val("");
      calculateNetAmount();
      return false;
    }

    let avqty = parseInt(closestTr.find("[name^='availablequantity-sale']").val());
    let rqty = parseInt($(this).val());

    if (rqty > avqty) {
      alert("Quantity Should not be greater than Available Quantity");
      $(this).val("");
      return false;
    }

    applyAdjustment();
    calculateNetAmount();
  });
});




// ########################################################
// ############### Accounts section ###########################
// ########################################################


// this function do the filtering of customer list when selecting Branch,Added By (customers.html)
function myFilterFunctionMoneyReciept() {
  var accounts = $("#accounts_list").val().replace(/ /g, "");

  console.log("selected accounte", accounts);
  var invoicenumber = $("#invoicenumber_list").val();

  $(".search_results").each(function () {
    var classList = $(this).attr("class").split(/\s+/);

    console.log(classList);
    if (accounts === "" && invoicenumber === "") {
      $(".search_results").show();
    } else if (accounts && invoicenumber) {
      $(this).toggle(
        classList.includes(accounts) && classList.includes(invoicenumber),
      );
    } else if (accounts) {
      $(this).toggle(classList.includes(accounts));
    } else if (invoicenumber) {
      $(this).toggle(classList.includes(invoicenumber));
    }
  });
}

// this script do the clear filter functionality (customers.html)

$("#clear_filter_money").click(function (e) {
  console.log("clear filer money clicked");
  $("#invoicenumber_list").val("");
  // $("#branch").empty();
  $("#accounts_list").val("");
  // $("#added_by option:not([value=''])").remove();
  $(".search_results").show();
});
// #########################################################
// ############### Dashboard section #######################
// #########################################################

// This code is to open a search box whenever control + g is pressed
document.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;

    if (keyName === "Control") {
      // do not alert when only Control key is pressed.
      return;
    }

    if (event.ctrlKey) {
      // Even though event.key is not 'Control' (e.g., 'a' is pressed),
      // event.ctrlKey may be true if Ctrl key is pressed at the same time.

      if (keyName == "Alt") {
        event.preventDefault();
        // alert("its alt")
        $("#servicesearchModal").on("shown.bs.modal", function () {
          $(".quick-search-serviceref").focus();
        });
        $("#servicesearchModal").modal("show");
      }
    } else {
      // alert(`Key pressed ${keyName}`);
    }
  },
  false,
);

$(document).ready(function () {
  $(".quick-search-service").click(function (event) {
    event.preventDefault();

    let serviceref = $(".quick-search-serviceref").val();
    var csrftoken = csrf_token;

    $.ajax({
      url: "/servicedetailssearch/",
      type: "POST",
      data: { serviceref: serviceref },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },

      success: function (response) {
        console.log(response);
        $("#servicesearchModal").modal("hide");
        if (response.Response != "Service Not Found!") {
          window.location.href = `/serviceupdateform/${response.Response}/`;
        } else {
          $.toast({
            heading: "Error",
            text: response.Response,
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });
        }
      },
      error: function (errorThrown) {
        console.log(errorThrown);
        $("#servicesearchModal").modal("hide");
        $.toast({
          heading: "Error",
          text: "An unexpected error occured!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      },
    });
  });
});

// This code is to open a search box whenever control + g is pressed
document.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;

    if (keyName === "Control") {
      // do not alert when only Control key is pressed.
      return;
    }

    if (event.ctrlKey) {
      // Even though event.key is not 'Control' (e.g., 'a' is pressed),
      // event.ctrlKey may be true if Ctrl key is pressed at the same time.

      if (keyName == "Shift") {
        event.preventDefault();
        // alert("its alt")
        $("#barcodeprintModal").on("shown.bs.modal", function () {
          $(".quick-print-barcode").focus();
        });
        $("#barcodeprintModal").modal("show");
      }
    } else {
      // alert(`Key pressed ${keyName}`);
    }
  },
  false,
);

// $(document).ready(function () {
//   $(".quick-print").click(function (event) {
//     event.preventDefault();

//     let type = $("#typequickprint").val();
//     let quantity = $("#quantityquickprint").val();
//     let barcode = $("#barcodequickprint").val();
//     var csrftoken = csrf_token;

//     $.ajax({
//       url: "/printbarcode/",
//       type: "POST",
//       data: { type:type,
//       quantity:quantity,
//       barcode:barcode },
//       contentType: "application/json",

//       headers: {
//         "X-CSRFToken": csrftoken,
//       },

//       success: function (response) {
//         console.log(response);
//         $("#barcodeprintModal").modal("hide");
//         if (response.Response != "Barcode Not Found!") {

//         } else {
//           $.toast({
//             heading: "Error",
//             text: response.Response,
//             icon: "error",
//             bgColor: "red",
//             textColor: "white",
//             position: "top-center",
//             hideAfter: 4000,
//           });
//         }
//       },
//       error: function (errorThrown) {
//         console.log(errorThrown);
//         $("#servicesearchModal").modal("hide");
//         $.toast({
//           heading: "Error",
//           text: "An unexpected error occured!",
//           icon: "error",
//           bgColor: "red",
//           textColor: "white",
//           position: "top-center",
//           hideAfter: 4000,
//         });
//       },
//     });
//   });
// });

// this code is for making the welcome text in dashboard responsive
$(document).ready(function () {
  // Function to update classes based on screen width
  function updateClasses() {
    var screenWidth = $(window).width();
    var welcomingText = $(".welcoming-text");
    var welcomingImage = $(".welcoming-image");

    if (screenWidth <= 767) {
      welcomingText
        .addClass("text-center")
        .addClass("justify-content-center")
        .addClass("mb-3");
      welcomingImage
        .removeClass("justify-content-end")
        .addClass("justify-content-center");
    } else {
      welcomingText
        .removeClass("text-center")
        .removeClass("justify-content-center")
        .removeClass("mb-3");
      welcomingImage
        .removeClass("justify-content-center")
        .addClass("justify-content-end");
    }
  }

  // Initial call to set classes based on the initial screen width
  updateClasses();

  // Update classes on window resize
  $(window).resize(function () {
    updateClasses();
  });
});

// dashboard get technician when changing branch

$(document).ready(function () {
  $("#servicebranch").change(function () {
    var branch = $("#servicebranch").val();
    console.log("branch", branch);

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_technician_by_branch/",
      type: "POST",
      data: { branch: branch },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },

      success: function (response) {
        $("#servicetechnician").empty();

        console.log(response);
        $.each(response.technicians, function (index, element) {
          console.log("element..", element);
          row = "<option value=" + element + ">" + element + "</option>";

          $("#servicetechnician").append(row);
        });
        $("#servicetechnician").prepend(
          "<option value='alltechnician' selected>Technician</option>",
        );
      },
      error: function (errorThrown) {
        console.log(errorThrown);
      },
    });
  });
});

// this function is to fetch the service status on date range change on dashboard

$(document).ready(function () {
  $("#servicedate , #servicebranch , #servicetechnician").on(
    "change",
    function () {
      console.log("servicedate change..");

      const csrftoken = csrf_token;
      const serviceDate = $("#servicedate").val();
      const serviceBranch = $("#servicebranch").val();
      const serviceTechnician = $("#servicetechnician").val();

      $.ajax({
        url: "/get_service_status/",
        type: "POST",
        data: {
          date: serviceDate,
          branch: serviceBranch,
          technician: serviceTechnician,
        },
        contentType: "application/json",
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
          $("#service-unacknowledged").text(response["Unacknowledged"]);
          $("#service-inprogress").text(response["InProgress"]);
          $("#service-completed").text(response["Completed"]);
          $("#service-spareallocated").text(response["SpareAllocated"]);
          $("#service-rejected").text(response["Rejected"]);
          $("#service-sparerequested").text(response["SpareRequested"]);
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    },
  );
});

// this scripts get the number of customers added per month in current year in a list format from
// /get_customers_monthly/ url and pass it to chart.js for showing the bar chanrt of customers added
// per month in dashboard   (index.html)

$(document).ready(function () {
  console.log("customer monthly..");
  var csrftoken = csrf_token;
  var xValues = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  var yValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  $.ajax({
    url: "/get_customers_monthly/",
    type: "POST",
    data: {},
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);
      yValues = response["response"];
      updateChart();
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);
    },
  });

  function updateChart() {
    new Chart("firstchart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [
          {
            fill: false,
            backgroundColor: "rgba(216, 27, 96, 0.8)",

            // borderColor: "rgba(218,68,55,1.0)",
            borderWidth: 3,

            data: yValues,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Make the chart responsive
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: false,
          text: "Net Promoter Score (NPS)",
        },
        scales: {
          xAxes: [
            {
              ticks: {
                min: 0,
                max: 500,
              },
            },
          ],
          y: {
            beginAtZero: true,
            ticks: {
              min: 0,
            },
          },
        },
      },
    });
  }
});

// this is technician's performance chart
$(document).ready(function () {
  let xValues;
  let yValues;
  let bgColors;
  var csrftoken = csrf_token;
  $.ajax({
    url: "/get_technician_performance/",
    type: "POST",
    data: {},
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      xValues = response["technicians"];

      yValues = response["serviceincome"];
      bgColors = response["bg_colors"];
      updateChartService();
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);
    },
  });

  function updateChartService() {
    var data = {
      labels: xValues,
      datasets: [
        {
          data: yValues,
          backgroundColor: bgColors,
          hoverBackgroundColor: bgColors,
        },
      ],
    };

    var options = {
      cutoutPercentage: 50,
      responsive: true,
      maintainAspectRatio: true,
    };

    // Get the canvas element
    var ctx = document.getElementById("servicechart").getContext("2d");

    var myDoughnutChart = new Chart(ctx, {
      type: "doughnut",
      data: data,
      options: options,
    });
  }
  updateChartService();
});

// this scripts get the total of netpurchase amount per month in current year in a list format from
// /get_purchase_monthly/ url and pass it to chart.js for showing the line chanrt of purchase netamount
// per month in dashboard   (index.html)

$(document).ready(function () {
  console.log("purchase total per month");
  var csrftoken = csrf_token;
  var xValues = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  var yValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  $.ajax({
    url: "/get_purchase_monthly/",
    type: "POST",
    data: {},
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);
      yValues = response["response"];
      updatePurchaseChart();
      $(".netpurchase").text(response["nettotal"].toFixed(2));
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);
    },
  });

  console.log("y values..purchase", yValues);

  function updatePurchaseChart() {
    new Chart("secondchart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            fill: false,
            backgroundColor: "rgba(157,187,175,0.8)",
            borderColor: "rgba(100,150,255,255.1)",
            data: yValues,
            tension: 0,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: false,
          text: "Net Promoter score(NPS)",
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{ ticks: { min: 0, max: 500 } }],
        },
      },
    });
  }
});

// for monthly sales graph in dashboard

$(document).ready(function () {
  console.log("purchase total per month");
  var csrftoken = csrf_token;
  var xValues = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  var yValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  $.ajax({
    url: "/get_sales_monthly/",
    type: "POST",
    data: {},
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      // console.log("Data sent successfully!", response);
      yValues = response["response"];
      updateSalesChart();
      $(".netsales").text(response["nettotal"].toFixed(2));
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);
    },
  });

  function updateSalesChart() {
    new Chart("saleschart", {
      type: "line",
      data: {
        labels: xValues,
        datasets: [
          {
            fill: false,
            backgroundColor: "rgba(157,187,175,0.8)",
            borderColor: "rgba(100,150,255,255.1)",
            data: yValues,
            tension: 0,
          },
        ],
      },
      options: {
        legend: { display: false },
        title: {
          display: false,
          text: "Net Promoter score(NPS)",
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{ ticks: { min: 0, max: 500 } }],
        },
      },
    });
  }
});

// $(document).ready(function() {
//     $(".navbar-toggler").click(function() {

//       var csrftoken = csrf_token

//       $.ajax({
//         url: '/change_sidebar_status/',
//         type: 'POST',
//         data: {status:'clicked'},
//         contentType: 'application/json',

//       headers: {
//         'X-CSRFToken': csrftoken
//       },
//         success: function(response) {
//           console.log('Data sent successfully!',response);

//           if (response.num % 2 != 0 ) {
//             $("body").addClass('sidebar-icon-only')
//         } else {
//             $('body').removeClass('sidebar-icon-only')
//         }

//         },
//         error: function(xhr, textStatus, errorThrown) {
//           console.error('Error sending data:', errorThrown);

//         }
//       });

//     });
// });

// #########################################################
// ############### Service section #######################
// #########################################################

// service edit detection

$(document).ready(function () {
  // Initialize a global variable to store changed input names
  var changedInputs = [];

  $(".track-changes-form").on("change", "input, select, textarea", function () {
    var changedInputName = $(this).data("name");

    if ($.inArray(changedInputName, changedInputs) === -1) {
      changedInputs.push(changedInputName);
    }

    $('input[name="changedattribute"]').val(changedInputs.join(","));
    $("#changedattribute2").val(changedInputs.join(","));
    $("#changedattribute3").val(changedInputs.join(","));
    $("#changedattribute4").val(changedInputs.join(","));
    $("#changedattribute5").val(changedInputs.join(","));
  });
});

//  opening and closing chat box in service call logs

$(document).ready(function () {
  $(".close-chat").click(function () {
    $(".chat-box").slideUp(); // or use .hide() if you want to hide it immediately
  });
  $(".get-chat-box").click(function () {
    $(".chat-box").slideDown();
  });
});

// fetching phone modal when phone brand is selected (add service charge modal)

$(document).ready(function () {
  $("#servicebrand").change(function () {
    const brandid = $(this).val();

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_phone_modals/",
      type: "POST",
      data: { brandid: brandid },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!", response);

        if (response.Response == "error") {
          console.log("something went wrong 1");
          $.toast({
            heading: "Error",
            text: "Something went wrong!",
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });
        } else {
          // Assuming you have initialized Selectize.js on the #expensetype element
          var $servicemodalSelect = $("#servicemodal")[0].selectize;

          // Clear existing options
          $servicemodalSelect.clearOptions();

          // Add new options
          $.each(response.Response, function (index, element) {
            $servicemodalSelect.addOption({
              value: element.id,
              text: element.modal,
            });
          });

          // Refresh Selectize.js to update the UI
          $servicemodalSelect.refreshItems();

          // Set the selected option to the default (if needed)
          $servicemodalSelect.setValue("", false);

          // Trigger the change event to update Selectize.js
          $servicemodalSelect.trigger("change");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        // Handle the error case
        console.log("something went wrong 2");
        $.toast({
          heading: "Error",
          text: "Something went wrong!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      },
    });
  });
});

// fetching phone modal when phone brand is selected (service form)
$(document).ready(function () {
  // $(document).on("change", "#sale-search-input-product1", function () {
  $("#sale-search-input-product1").on("change", function () {
    var selectedOption = $(this).find("option:selected");
    var dataId = selectedOption.data("id");

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_brands_by_product/",
      type: "POST",
      data: { id: dataId },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!", response);

        // ###### for basic selectfield append ####

        $("#brand1").empty();
        $("#brand1").append(`<option value=''></option>`);
        // console.log($("#brand1"))
        response.forEach((elem) => {
          // console.log("elem-",elem)
          $("#brand1").append(
            `<option data-id='${elem.id}' value='${elem.name}'>${elem.name}</option>`,
          );
        });
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        console.log("something went wrong 4");
        $.toast({
          heading: "Error",
          text: "Something went wrong!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      },
    });
  });

  $("#brand1").change(function () {
    var selectedOption = $(this).find("option:selected");
    var dataId = selectedOption.data("id");

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_phone_modals/",
      type: "POST",
      data: { brandid: dataId },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!", response);

        if (response.Response == "error") {
          console.log("something went wrong 3");
          $.toast({
            heading: "Error",
            text: "Something went wrong!",
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });
        } else {
          // ###### for basic selectfield append ####

          $("#model1").empty();
          $("#model1").append(`<option value=''></option>`);
          response.Response.forEach((elem) => {
            $("#model1").append(
              `<option data-id='${elem.id}' value='${elem.modal}'>${elem.modal}</option>`,
            );
          });

          //  ####### for selectize field append ######
          // var $servicemodalSelect = $('#servicemodal')[0].selectize;
          // $servicemodalSelect.clearOptions();
          // $.each(response.Response, function(index, element) {
          //   $servicemodalSelect.addOption({ value: element.id, text: element.modal });
          // });
          // $servicemodalSelect.refreshItems();
          // $servicemodalSelect.setValue('', false);
          // $servicemodalSelect.trigger('change');
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        console.log("something went wrong 4");
        $.toast({
          heading: "Error",
          text: "Something went wrong!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      },
    });
  });
});

// #### get service charge on brand,modal change(serviceform)
$(document).ready(function () {
  $("#model1 , #problem , #brand1").on("change", function () {
    const brand1Value = $("#brand1").find("option:selected").data("id");
    const modal1Value = $("#model1").find("option:selected").data("id");
    const problemValue = $("#problem").find("option:selected").data("id");
    const productValue = $("#sale-search-input-product1")
      .find("option:selected")
      .data("id");

    if (brand1Value && modal1Value && problemValue && productValue) {
      console.log(
        "three are selected",
        brand1Value,
        modal1Value,
        problemValue,
        productValue,
      );

      var csrftoken = csrf_token;

      $.ajax({
        url: "/get_service_charge/",
        type: "POST",
        data: {
          brandid: brand1Value,
          modalid: modal1Value,
          problemid: problemValue,
          productid: productValue,
        },
        contentType: "application/json",

        headers: {
          "X-CSRFToken": csrftoken,
        },
        success: function (response) {
          console.log("Data sent successfully!", response);

          if (response.Response == "error") {
            console.log("something went wrong 5");
            $.toast({
              heading: "Error",
              text: "Something went wrong!",
              icon: "error",
              bgColor: "red",
              textColor: "white",
              position: "top-center",
              hideAfter: 4000,
            });
          } else {
            // ###### for basic selectfield append ####
            $("#serviceprice1").val(response.Response);
            $("#totalamount").val(response.Response);
            const final =
              parseFloat(response.Response) -
              (parseFloat($("#discount").val()) +
                parseFloat($("#totaltax").val()));
            $("#finalamount").val(final);
            const due =
              parseFloat(final) - parseFloat($("#amountrecievedservice").val());
            $("#duebalance").val(due);
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
          console.log("something went wrong 6");
          $.toast({
            heading: "Error",
            text: "Something went wrong!",
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });
        },
      });
    } else {
      $("#serviceprice1").val(0);
    }
  });
});

// ### service checkout


// $(document).ready(function () {

//   originalTotalAmount = 0;

//   $("#finaltotal").on("input change", function () {


//     let discount = $("#finaldiscount").val() || 0

//     if (discount > 0){

//       alert("Please Change Service Total Before Changing Discount")

//       location.reload()
//     }

//     console.log(discount,"discount")

//     let total = $(this).val()
//     let tax = 0;
//     var csrftoken = csrf_token;
//     $.ajax({
//       url: "/get_service_tax/",
//       type: "POST",
//       data: {},
//       contentType: "application/json",
//       headers: {
//         "X-CSRFToken": csrftoken,
//       },
//       success: function (response) {
//        calculateServiceCharge(response,total)
       
//       //  calculateServiceCheckoutDiscount(tax)
     
//       //   calculateFinalAmount(tax)
//       //   dueCalculationServiceCheckout()
       
//       },
//       error: function (errorThrown) {
//         console.log(errorThrown);
//       },
//     });
//   })
  

//   $("#finaldiscount").on("input change", function () {

//     let tax = 0;
//     let csrftoken = csrf_token;
//     $.ajax({
//       url: "/get_service_tax/",
//       type: "POST",
//       data: {},
//       contentType: "application/json",
//       headers: {
//         "X-CSRFToken": csrftoken,
//       },
//       success: function (response) {
//         tax = parseFloat(response.service_tax);

//         console.log("discout tax",tax)
//         restoreOriginalSparePrices(tax)
//         calculateServiceCheckoutDiscount(tax)
//         calculateFinalAmount(tax)
//         dueCalculationServiceCheckout()
//       },
//       error: function (errorThrown) {
//         console.log(errorThrown);
//       },
//     });
//   })

//   $("#finaldiscountmethod").on("change", function () {
//     let tax = 0;
//     var csrftoken = csrf_token;
//     $.ajax({
//       url: "/get_service_tax/",
//       type: "POST",
//       data: {},
//       contentType: "application/json",
//       headers: {
//         "X-CSRFToken": csrftoken,
//       },
//       success: function (response) {
//         tax = parseFloat(response.service_tax);
//         restoreOriginalSparePrices(tax)
//         calculateServiceCheckoutDiscount(tax)
//         calculateFinalAmount(tax)
//         dueCalculationServiceCheckout()
//       },
//       error: function (errorThrown) {
//         console.log(errorThrown);
//       },
//     });
//   })

//   $('#finalamountreceived').on("input change", function () {
    
//     dueCalculationServiceCheckout()
//   });



//   // # changing total 

  

//   function calculateServiceCharge(response,total){

//     console.log("called calculate service charge function")
//     let tax = parseFloat(response.service_tax);
//     let spare_cost_total = $("#spare_cost_total").val()
//     let service_charge_incl_tax = total - spare_cost_total
//     let amountReceived = $("#finalamountreceived").val()
//     // ######### calculate original total #######
//     let finalOriginal= 0
//     $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var quantity =
//         parseInt($(this).find(`.salequantity${index + 1}`).text()) || 0;

//         console.log($(this),quantity)
//       var price =
//         parseFloat($(this).find(`.saleprice${index + 1}`).text()) || 0;
//       var saleGst =
//         parseFloat(
//           $(this)
//             .find(`.salegstsale${index + 1}`).text()
//         ) || 0;
//       finalOriginal +=   ((quantity * price) + (quantity * price * (saleGst / 100))) ;

   
//     })

//     originalTotalAmount = finalOriginal + service_charge_incl_tax;
//     // ####################################
//     $("#servicecost").val(service_charge_incl_tax.toFixed(2))
//     $(".finalamountservicecheckout").val(total)
//     let dueBalance = total - amountReceived
//     $("#finalduebalance").val(dueBalance.toFixed(2))

//     // ### Re-calculate service tax ####
//     let service_charge_tax = service_charge_incl_tax - (service_charge_incl_tax / (1 + (tax / 100)));
//     $("#totaltaxcheckout").val(service_charge_tax.toFixed(2))
//   }





//   function calculateFinalAmount(tax){
//     // calculateServiceCheckoutDiscount(tax)
//     // ## calculate spare total and tax ##
//     var totalSpareTotalIncludingTax = 0;
//     var totalSpareTax = 0
//     $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var price = parseFloat($(this).find(`.sale_priceafterdiscount${index+1}`).text()) || 0;
//       var tax = parseFloat($(this).find(`.salegstsale${index+1}`).text()) || 0;
//       var quantity = parseFloat($(this).find(`.salequantity${index+1}`).text()) || 0;
//      var spareTotal = (price + (price*(tax/100)))*quantity
//      var spareTax = (price*(tax/100)) * quantity
  
//      totalSpareTotalIncludingTax += spareTotal
//      totalSpareTax += spareTax
//     })
//     console.log("total spare tax",totalSpareTax)
//     var serviceChargeExcludingTax = parseFloat($("#servicecostexcltaxafterdiscount").val()) || 0
//     var serviceChargeIncludingTax = serviceChargeExcludingTax + (serviceChargeExcludingTax*(tax/100))
//     var serviceTax = serviceChargeExcludingTax*(tax/100);

//     var finalTotal =  serviceChargeIncludingTax + totalSpareTotalIncludingTax

//     $("#servicecost").val(serviceChargeIncludingTax.toFixed(2))
//     $("#servicecostexcltaxafterdiscount").val(serviceChargeExcludingTax.toFixed(2))
//     $("#totaltaxcheckout").val(serviceTax.toFixed(2))
//     $("#spare_cost_total").val(totalSpareTotalIncludingTax.toFixed(2))
//     $("#sparetx2").val(totalSpareTax.toFixed(2))
//     $("#finaltotal").val(finalTotal.toFixed(2))
//     $("#finalfinalamount").val(finalTotal.toFixed(2))

//   }
//   function calculateServiceCheckoutDiscount(tax){

//     let discountMethod = $("#finaldiscountmethod").val()
//     console.log(discountMethod)
//     let discount = parseFloat($("#finaldiscount").val()) || 0;
//     console.log("discount",discount)
//     if (discount <= 0) {
//       restoreOriginalSparePrices(tax); // Restore original prices when no discount method is selected
//       return;
//     }

//      // Calculate the discount amount based on the method
//      var discountPercentage = 0;
//      if (discountMethod === "Percentage") {
//        discountPercentage = discount;
//      } else if (discountMethod === "Flat") {
//        discountPercentage = (discount * 100) / originalTotalAmount;
//      }
//      // Distribute the discount across products
//      $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var price = parseFloat($(this).find(`.saleprice${index+1}`).text()) || 0;
//       var newPrice = price - price * (discountPercentage / 100);
//       $(this).find(`.sale_priceafterdiscount${index+1}`).text(newPrice.toFixed(2));
//     })
//     // change service charge also
//     var serviceChargeExcludingTax  = parseFloat($("#servicecostexcltax").val()) || 0
//     console.log("serve charge--excl tax",serviceChargeExcludingTax)
//     var newPrice = serviceChargeExcludingTax - serviceChargeExcludingTax* (discountPercentage / 100);
//     $("#servicecostexcltaxafterdiscount").val(newPrice.toFixed(2))
    
//   }

  

//   // Restore original prices function
//   function restoreOriginalSparePrices(tax) {
//     var finalOriginal = 0
//     // var spare_cost_total = $("#spare_cost_total").val()
//     $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var originalPrice = parseFloat($(this).find(`.saleprice${index+1}`).text())
//       if (originalPrice) {
//         $(this).find(`.sale_priceafterdiscount${index+1}`).text(originalPrice.toFixed(2)); 
//       }
//       var quantity =
//       parseInt($(this).find(`.salequantity${index + 1}`).text()) || 0;
//     var price =
//       parseFloat($(this).find(`.saleprice${index + 1}`).text()) || 0;
//     var saleGst =
//       parseFloat(
//         $(this)
//           .find(`.salegstsale${index + 1}`).text()
//       ) || 0;
//     finalOriginal +=   ((quantity * price) + (quantity * price * (saleGst / 100))) ;
//     });
//     var serviceChargeExclTax =  parseFloat($("#servicecostexcltax").val()) || 0
//     $("#servicecostexcltaxafterdiscount").val(serviceChargeExclTax.toFixed(2))
//     var serviceTaxtotal = parseFloat($("#servicecostexcltaxafterdiscount").val()) * (tax/100)
//     var serviceChargeTotal =  parseFloat($("#servicecostexcltaxafterdiscount").val())+ serviceTaxtotal;
//     originalTotalAmount = finalOriginal + serviceChargeTotal;
//   }

//   function dueCalculationServiceCheckout() {
//     let total = parseFloat($('#finalfinalamount').val()) || 0;
//     let recieved = parseFloat($('#finalamountreceived').val()) || 0;
//     console.log("amount received",recieved,total)
//     let duebal = total - recieved;
//     $('#finalduebalance').val(duebal.toFixed(2));
//   }


// })



// $(document).ready(function () {
//   let originalTotalAmount = 0;

//   // Initialize originalTotalAmount when page loads
//   function initializeOriginalTotal() {
//     let sparesOriginalTotal = 0;
    
//     // Calculate original spares total
//     $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var quantity = parseInt($(this).find(`.salequantity${index + 1}`).text()) || 0;
//       var price = parseFloat($(this).find(`.saleprice${index + 1}`).text()) || 0;
//       var saleGst = parseFloat($(this).find(`.salegstsale${index + 1}`).text()) || 0;
//       sparesOriginalTotal += ((quantity * price) + (quantity * price * (saleGst / 100)));
//     });

//     // Get initial service charge
//     let serviceChargeInclTax = parseFloat($("#servicecost").val()) || 0;
    
//     // Set initial originalTotalAmount
//     originalTotalAmount = sparesOriginalTotal + serviceChargeInclTax;
    
//     // Set initial final amount
//     // $("#finalfinalamount").val(originalTotalAmount.toFixed(2));
    
//     return originalTotalAmount;
//   }

//   // Call initialization on page load
//   originalTotalAmount = initializeOriginalTotal();

//   $("#finaltotal").on("input change", function () {

//     let discount = $("#finaldiscount").val() || 0;
//     let discountMethod = $("#finaldiscountmethod").val();

//     // Store the new total temporarily
//     let newTotal = parseFloat($(this).val()) || 0;

//     // if (discount > 0) {
//     //   alert("Please Change Service Total Before Changing Discount");
//     //   location.reload();
//     //   return;
//     // }

//     let tax = 0;
//     var csrftoken = csrf_token;
//     $.ajax({
//       url: "/get_service_tax/",
//       type: "POST",
//       data: {},
//       contentType: "application/json",
//       headers: {
//         "X-CSRFToken": csrftoken,
//       },
//       success: function (response) {
//         tax = response.service_tax
//         calculateServiceCharge(response, newTotal);
//         calculateServiceCheckoutDiscount(tax);
//       },
//       error: function (errorThrown) {
//         console.log(errorThrown);
//       },
//     });
//   });

//   function calculateServiceCharge(response, total) {
//     let tax = parseFloat(response.service_tax);
//     let spare_cost_total = parseFloat($("#spare_cost_total").val()) || 0;
//     let service_charge_incl_tax = total - spare_cost_total;
//     let amountReceived = parseFloat($("#finalamountreceived").val()) || 0;

//     // Calculate original total from spares
//     let sparesOriginalTotal = 0;
//     $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var quantity = parseInt($(this).find(`.salequantity${index + 1}`).text()) || 0;
//       var price = parseFloat($(this).find(`.saleprice${index + 1}`).text()) || 0;
//       var saleGst = parseFloat($(this).find(`.salegstsale${index + 1}`).text()) || 0;
//       sparesOriginalTotal += ((quantity * price) + (quantity * price * (saleGst / 100)));
//     });

//     // Update original total amount with new service charge
//     originalTotalAmount = sparesOriginalTotal + service_charge_incl_tax;

//     // Update service charge related fields
//     $("#servicecost").val(service_charge_incl_tax.toFixed(2));
//     $(".finalamountservicecheckout").val(total);
    
//     // Calculate and update due balance
//     let dueBalance = total - amountReceived;
//     $("#finalduebalance").val(dueBalance.toFixed(2));

//     // Calculate and update service tax
//     let service_charge_excl_tax = service_charge_incl_tax / (1 + (tax / 100));
//     let service_charge_tax = service_charge_incl_tax - service_charge_excl_tax;
//     $("#totaltaxcheckout").val(service_charge_tax.toFixed(2));
//     $("#servicecostexcltax").val(service_charge_excl_tax.toFixed(2));
//     $("#servicecostexcltaxafterdiscount").val(service_charge_excl_tax.toFixed(2));
//   }

//   $("#finaldiscount, #finaldiscountmethod").on("input change", function () {


//     let tax = 0;
//     let csrftoken = csrf_token;
//     $.ajax({
//       url: "/get_service_tax/",
//       type: "POST",
//       data: {},
//       contentType: "application/json",
//       headers: {
//         "X-CSRFToken": csrftoken,
//       },
//       success: function (response) {
//         tax = parseFloat(response.service_tax);
//         calculateServiceCheckoutDiscount(tax);
//         calculateFinalAmount(tax);
//         dueCalculationServiceCheckout();

//         if ($("#servicecostexcltaxafterdiscount").val() < 0){
//           alert("Service Charge Can't be Negative Value")
//           location.reload()
//         }
//       },
//       error: function (errorThrown) {
//         console.log(errorThrown);
//       },
//     });
//   });

//   function calculateServiceCheckoutDiscount(tax) {
//     let discountMethod = $("#finaldiscountmethod").val();
//     let discount = parseFloat($("#finaldiscount").val()) || 0;
    
//     if (discount <= 0) {
//       restoreOriginalSparePrices(tax);
//       return;
//     }

//     // Calculate discount percentage
//     let discountPercentage;
//     if (discountMethod === "Percentage") {
//       discountPercentage = discount;
//     } else if (discountMethod === "Flat") {
//       discountPercentage = (discount * 100) / originalTotalAmount;
//     }



//     // Apply discount to spares
//     let amountToDeductFromSpare = 0
//     $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var price = parseFloat($(this).find(`.saleprice${index + 1}`).text()) || 0;
//       // var newPrice = price - (price * (discountPercentage / 100));
//       amountToDeductFromSpare += Math.round((price * (discountPercentage / 100)),2)

//       // $(this).find(`.sale_priceafterdiscount${index + 1}`).text(newPrice.toFixed(2));
//     });

//     // Apply discount to service charge
//     var serviceChargeExcludingTax = parseFloat($("#servicecostexcltax").val()) || 0;
//     var newServicePrice = serviceChargeExcludingTax - (serviceChargeExcludingTax * (discountPercentage / 100));
//     newServicePrice = newServicePrice - Math.round(amountToDeductFromSpare,2)
//     $("#servicecostexcltaxafterdiscount").val(newServicePrice.toFixed(2));
//   }

//   function calculateFinalAmount(tax) {
//     let totalSpareTotalIncludingTax = 0;
//     let totalSpareTax = 0;
//     // Calculate spares total and tax
//     $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var price = parseFloat($(this).find(`.sale_priceafterdiscount${index + 1}`).text()) || 0;
//       var tax = parseFloat($(this).find(`.salegstsale${index + 1}`).text()) || 0;
//       var quantity = parseFloat($(this).find(`.salequantity${index + 1}`).text()) || 0;
//       var spareTotal = (price + (price * (tax / 100))) * quantity;
//       var spareTax = (price * (tax / 100)) * quantity;

//       totalSpareTotalIncludingTax += spareTotal;
//       totalSpareTax += spareTax;
//     });

//     // Calculate service charge amounts
//     var serviceChargeExcludingTax = parseFloat($("#servicecostexcltaxafterdiscount").val()) || 0;
//     var serviceChargeIncludingTax = serviceChargeExcludingTax + (serviceChargeExcludingTax * (tax / 100));
//     var serviceTax = serviceChargeExcludingTax * (tax / 100);

//     // Calculate final total
//     var finalTotal = serviceChargeIncludingTax + totalSpareTotalIncludingTax;

//     // Update all relevant fields
//     $("#servicecost").val(serviceChargeIncludingTax.toFixed(2));
//     $("#totaltaxcheckout").val(serviceTax.toFixed(2));
//     $("#spare_cost_total").val(totalSpareTotalIncludingTax.toFixed(2));
//     $("#sparetx2").val(totalSpareTax.toFixed(2));
//     $("#finaltotal").val(finalTotal.toFixed(2));
//     $("#finalfinalamount").val(finalTotal.toFixed(2));
//   }

//   function restoreOriginalSparePrices(tax) {
//     let sparesOriginalTotal = 0;
    
//     // Restore original spare prices
//     $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
//       var originalPrice = parseFloat($(this).find(`.saleprice${index + 1}`).text());
//       if (originalPrice) {
//         $(this).find(`.sale_priceafterdiscount${index + 1}`).text(originalPrice.toFixed(2));
//       }
      
//       // Recalculate original total
//       var quantity = parseInt($(this).find(`.salequantity${index + 1}`).text()) || 0;
//       var saleGst = parseFloat($(this).find(`.salegstsale${index + 1}`).text()) || 0;
//       sparesOriginalTotal += ((quantity * originalPrice) + (quantity * originalPrice * (saleGst / 100)));
//     });

//     // Restore original service charge
//     var serviceChargeExclTax = parseFloat($("#servicecostexcltax").val()) || 0;
//     $("#servicecostexcltaxafterdiscount").val(serviceChargeExclTax.toFixed(2));
    
//     // Update original total
//     let serviceChargeInclTax = parseFloat($("#servicecost").val()) || 0;
//     originalTotalAmount = sparesOriginalTotal + serviceChargeInclTax;
//   }

//   $('#finalamountreceived').on("input change", function () {
//     dueCalculationServiceCheckout();
//   });

//   function dueCalculationServiceCheckout() {
//     let total = parseFloat($('#finalfinalamount').val()) || 0;
//     let received = parseFloat($('#finalamountreceived').val()) || 0;
//     let dueBalance = total - received;
//     $('#finalduebalance').val(dueBalance.toFixed(2));
//   }
// });



$(document).ready(function () {
  let originalTotalAmount = 0;

  // Initialize originalTotalAmount when page loads
  function initializeOriginalTotal() {
    let sparesOriginalTotal = 0;
    
    // Calculate original spares total
    $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
      var quantity = parseInt($(this).find(`.salequantity${index + 1}`).text()) || 0;
      var price = parseFloat($(this).find(`.saleprice${index + 1}`).text()) || 0;
      var saleGst = parseFloat($(this).find(`.salegstsale${index + 1}`).text()) || 0;
      sparesOriginalTotal += ((quantity * price) + (quantity * price * (saleGst / 100)));
    });

    let serviceChargeInclTax = parseFloat($("#servicecost").val()) || 0;
    originalTotalAmount = sparesOriginalTotal + serviceChargeInclTax;
    return originalTotalAmount;
  }

  // Call initialization on page load
  originalTotalAmount = initializeOriginalTotal();

  // Real-time calculations without validation
  $("#finaltotal").on("input change", function() {
    let csrftoken = csrf_token;
    $.ajax({
      url: "/get_service_tax/",
      type: "POST",
      data: {},
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        let tax = parseFloat(response.service_tax);
        recalculateAll(tax);
      },
      error: function (errorThrown) {
        console.log(errorThrown);
      },
    });
  });

  // Validation on blur
  $("#finaltotal").on("blur", function() {
    checkServiceCharge();
  });

  // Real-time calculations for discount
  $("#finaldiscount, #finaldiscountmethod").on("input change", function() {
    let csrftoken = csrf_token;
    $.ajax({
      url: "/get_service_tax/",
      type: "POST",
      data: {},
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        let tax = parseFloat(response.service_tax);
        recalculateAll(tax);
      },
      error: function (errorThrown) {
        console.log(errorThrown);
      },
    });
  });

  // Validation on blur for discount
  $("#finaldiscount, #finaldiscountmethod").on("blur", function() {
    checkServiceCharge();
  });

  // Real-time calculation for amount received
  $('#finalamountreceived').on("input change", function() {
    dueCalculationServiceCheckout(false); // false means don't validate
  });

  // Validation on blur for amount received
  $('#finalamountreceived').on("blur", function() {
    dueCalculationServiceCheckout(true); // true means validate
  });

  function checkServiceCharge(){
    let serviceCheckoutAfterDisc = parseFloat($("#servicecostexcltaxafterdiscount").val());
    if(serviceCheckoutAfterDisc < 0){
      alert("Service charge can't be negative value");
      location.reload();
    }
  }

  function calculateSparesTotal() {
    let sparesTotal = 0;
    // Calculate original spares total - this never changes
    $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
      var quantity = parseInt($(this).find(`.salequantity${index + 1}`).text()) || 0;
      var price = parseFloat($(this).find(`.saleprice${index + 1}`).text()) || 0;
      var saleGst = parseFloat($(this).find(`.salegstsale${index + 1}`).text()) || 0;
      sparesTotal += ((quantity * price) + (quantity * price * (saleGst / 100)));
    });
    return sparesTotal;
  }

  function calculateSparesTax() {
    let sparesTotalTax = 0;
    $(".spare-table-service-checkout tr:gt(0)").each(function (index) {
      var quantity = parseInt($(this).find(`.salequantity${index + 1}`).text()) || 0;
      var price = parseFloat($(this).find(`.saleprice${index + 1}`).text()) || 0;
      var saleGst = parseFloat($(this).find(`.salegstsale${index + 1}`).text()) || 0;
      sparesTotalTax += (quantity * price * (saleGst / 100));
    });
    return sparesTotalTax;
  }

  function recalculateAll(tax) {
    let currentTotal = parseFloat($("#finaltotal").val()) || 0;
    let discount = parseFloat($("#finaldiscount").val()) || 0;
    let discountMethod = $("#finaldiscountmethod").val();
    
    // Get fixed spares total
    let sparesTotal = calculateSparesTotal();
    let spareTax = calculateSparesTax();

    // Calculate service charge (total - spares)
    let serviceChargeInclTax = currentTotal - sparesTotal;
    let serviceChargeExclTax = serviceChargeInclTax / (1 + (tax / 100));
    let serviceTax = serviceChargeInclTax - serviceChargeExclTax;

    // Calculate discount amount
    let discountAmount = 0;
    if (discountMethod === "Percentage") {
      discountAmount = currentTotal * (discount / 100);
    } else if (discountMethod === "Flat") {
      discountAmount = discount;
    }

    // Apply discount to service charge only
    let finalServiceChargeInclTax = serviceChargeInclTax - discountAmount;
    let finalServiceChargeExclTax = finalServiceChargeInclTax / (1 + (tax / 100));
    let finalServiceTax = finalServiceChargeInclTax - finalServiceChargeExclTax;

    // Calculate final amount
    let finalAmount = sparesTotal + finalServiceChargeInclTax;

    // Update all fields
    $("#servicecost").val(finalServiceChargeInclTax.toFixed(2));
    $("#servicecostexcltax").val(serviceChargeExclTax.toFixed(2));
    $("#servicecostexcltaxafterdiscount").val(finalServiceChargeExclTax.toFixed(2));
    $("#totaltaxcheckout").val(finalServiceTax.toFixed(2));
    $("#spare_cost_total").val(sparesTotal.toFixed(2));
    $("#sparetx2").val(spareTax.toFixed(2));
    $("#finalfinalamount").val(finalAmount.toFixed(2));

    // Calculate due without validation
    dueCalculationServiceCheckout(false);
  }

  function dueCalculationServiceCheckout(validate = false) {
    let total = parseFloat($('#finalfinalamount').val()) || 0;
    let received = parseFloat($('#finalamountreceived').val()) || 0;
    let dueBalance = total - received;
    $('#finalduebalance').val(dueBalance.toFixed(2));

    // Only validate if explicitly requested (on blur)
    if (validate) {
      let finalDue = parseFloat(dueBalance);
      if(finalDue < 0){
        alert("Due balance can't be negative value");
        location.reload();
      }
    }
  }



  $(".amountreceived-service-checkout").on('change',function(){

    let finalamountreceived = parseFloat($(this).val()) || 0;
    let finalamountreceivedold = parseFloat($('.amountreceived-service-checkout-old').val()) || 0;
    console.log("old amount",finalamountreceivedold,finalamountreceived);

    if(finalamountreceived < finalamountreceivedold){
      alert("Received amount should be greater than previously received amount");
      location.reload();

    }






  })






});


// ###### spare request #########

$(document).ready(function () {
  function calculateGrandTotal() {
    var grandTotal = 0;
    var totalTax = 0;

    $("table.spare-request-details-table tbody tr").each(function () {
      console.log("text-", $(this).find("#statussparerequestdetails").text());

      if (
        $(this).find('input[name^="allocate"]').is(":checked") |
        ($(this).find("#statussparerequestdetails").text() == "Allocated")
      ) {
        var sellingPrice = parseFloat(
          $(this).find('input[name^="sellingprice"]').val(),
        );
        var saleGstPercentage = parseFloat(
          $(this).find('input[name^="sparesalegst"]').val(),
        );
        var requestedQty = parseInt(
          $(this).find('input[name^="reqqty"]').val(),
        );

        // console.log("price-",sellingPrice,"perc-",saleGstPercentage,"qty-",requestedQty)

        var subtotal = sellingPrice * (saleGstPercentage / 100) + sellingPrice;

        totalTax += sellingPrice * (saleGstPercentage / 100) * requestedQty;

        grandTotal += subtotal * requestedQty;
      }
    });

    var serviceCharge =
      parseFloat($('input[name="spareservicecharge"]').val()) || 0;
    grandTotal += serviceCharge;

    $('input[name="grandtotal"]').val(grandTotal.toFixed(2));
    $('input[name="grandtotalfinal"]').val(grandTotal.toFixed(2));
    $('input[name="sparetotaltax"]').val(totalTax.toFixed(2));
    console.log(totalTax.toFixed(2));
  }

  $("table.spare-request-details-table tbody").on(
    "change",
    'input[name^="allocate"]',
    function () {
      calculateGrandTotal();
    },
  );

  $('input[name="spareservicecharge"]').on("change", function () {
    calculateGrandTotal();
  });

  $("table.spare-request-details-table tbody tr").each(function () {
    $(this)
      .find('input[name^="sellingprice"]')
      .on("change", function () {
        calculateGrandTotal();
      });

    $(this)
      .find('input[name^="sparesalegst"]')
      .on("change", function () {
        calculateGrandTotal();
      });
  });

  calculateGrandTotal();
});

$(document).ready(function () {
  $(".initial-fault-btn").click(function () {
    $(".qc-verify-btn").slideUp();
    $(".initial-fault-btn").slideUp();
    $(".qcfaultremarkdiv").slideDown();
    $(".final-fault-btn").slideDown();
    $("#faultnofault").prop("checked", true);
  });

  $(".qcxmarkremark").click(function () {
    $(".qcfaultremarkdiv").slideUp();
    $(".final-fault-btn").slideUp();
    $(".initial-fault-btn").slideDown();
    $(".qc-verify-btn").slideDown();
    $("#faultnofault").prop("checked", false);
  });
});

// QC check boxes

$(document).ready(function () {
  for (let index = 0; index < 30; index++) {
    $(`.check${index}`).change(function () {
      if ($(`.check${index}`).is(":checked")) {
        $(`.x${index}`).css("display", "none");
        $(`.c${index}`).css("display", "block");
      } else {
        $(`.x${index}`).css("display", "block");
        $(`.c${index}`).css("display", "none");
      }
    });
  }

  $("#flexCheckDefaultcheckall").change(function () {
    if ($("#flexCheckDefaultcheckall").is(":checked")) {
      for (let index = 0; index < 30; index++) {
        $(`.x${index}`).css("display", "none");
        $(`.c${index}`).css("display", "block");
        $(`.check${index}`).prop("checked", true);
      }
    } else {
      for (let index = 0; index < 30; index++) {
        $(`.x${index}`).css("display", "block");
        $(`.c${index}`).css("display", "none");
        $(`.check${index}`).prop("checked", false);
      }
    }
  });
});

$(document).ready(function () {
  if ($("#ok").is(":checked")) {
    // $("#notokcode").css("display","none");
    $("#notokcode").slideUp();
  } else {
    // $("#notokcode").css("display","block");
    $("#notokcode").slideDown();
  }

  $("#ok").change(function () {
    if ($(this).is(":checked")) {
      // $("#notokcode").css("display","none");
      $("#notokcode").slideUp();
    } else {
      // $("#notokcode").css("display","block");
      $("#notokcode").slideDown();
    }
  });

  $("#notok").change(function () {
    if ($(this).is(":checked")) {
      // $("#notokcode").css("display","block");
      $("#notokcode").slideDown();
    } else {
      // $("#notokcode").css("display","none");
      $("#notokcode").slideUp();
    }
  });

  $("#notok").change(function () {});
});

$(document).ready(function () {
  $(".service-status").change(function () {
    let status = $(this).val();
    if (status === "Paused") {
      $(".pausereason").css("display", "block");
      $(".pausereasontextarea").css("border-color", "Red");
      $(".rejectreason").css("display", "none");
      // $(".pausereasontextarea").css("border-width","5px");
    } else if (status === "Rejected") {
      $(".rejectreason").css("display", "block");
      $(".rejectreasontextarea").css("border-color", "Red");
      $(".pausereason").css("display", "none");
    } else {
      $(".pausereason").css("display", "none");
    }
  });
});

$(document).ready(function () {
  $(
    ".photo-one , .photo-two , .photo-three , .photo-four , .photo-five , .photo-six",
  ).css("display", "none");

  $(".select-picture-count").change(function () {
    let count = $(this).val();

    if (count == "1") {
      $(".photo-one").css("display", "block");
      $(".photo-two").css("display", "none");
      $(".photo-three").css("display", "none");
      $(".photo-four").css("display", "none");
      $(".photo-five").css("display", "none");
      $(".photo-six").css("display", "none");
    } else if (count == "2") {
      $(".photo-one").css("display", "block");
      $(".photo-two").css("display", "block");
      $(".photo-three").css("display", "none");
      $(".photo-four").css("display", "none");
      $(".photo-five").css("display", "none");
      $(".photo-six").css("display", "none");
    } else if (count == "3") {
      $(".photo-one").css("display", "block");
      $(".photo-two").css("display", "block");
      $(".photo-three").css("display", "block");
      $(".photo-four").css("display", "none");
      $(".photo-five").css("display", "none");
      $(".photo-six").css("display", "none");
    } else if (count == "4") {
      $(".photo-one").css("display", "block");
      $(".photo-two").css("display", "block");
      $(".photo-three").css("display", "block");
      $(".photo-four").css("display", "block");
      $(".photo-five").css("display", "none");
      $(".photo-six").css("display", "none");
    } else if (count == "5") {
      $(".photo-one").css("display", "block");
      $(".photo-two").css("display", "block");
      $(".photo-three").css("display", "block");
      $(".photo-four").css("display", "block");
      $(".photo-five").css("display", "block");
      $(".photo-six").css("display", "none");
    } else if (count == "6") {
      $(".photo-one").css("display", "block");
      $(".photo-two").css("display", "block");
      $(".photo-three").css("display", "block");
      $(".photo-four").css("display", "block");
      $(".photo-five").css("display", "block");
      $(".photo-six").css("display", "block");
    } else {
      $(".photo-one").css("display", "none");
      $(".photo-two").css("display", "none");
      $(".photo-three").css("display", "none");
      $(".photo-four").css("display", "none");
      $(".photo-five").css("display", "none");
      $(".photo-six").css("display", "none");
    }
  });
});

// get technician when changing branch

$(document).ready(function () {
  $(
    "#dailyservicebranch , #monthlyservicebranch , #yearlyservicebranch",
  ).change(function () {
    var branch = $(this).val();

    const currentId = this.id;

    console.log("this", this.id);
    console.log("branch", branch);

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_technician_by_branch/",
      type: "POST",
      data: { branch: branch },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },

      success: function (response) {
        if (currentId == "dailyservicebranch") {
          $("#dailyservicetechnician").empty();
        } else if (currentId == "monthlyservicebranch") {
          $("#monthlyservicetechnician").empty();
        } else if (currentId == "yearlyservicebranch") {
          $("#yearlyservicetechnician").empty();
        }

        console.log(response);
        $.each(response.technicians, function (index, element) {
          console.log("element..", element);
          row = "<option value=" + element + ">" + element + "</option>";

          if (currentId == "dailyservicebranch") {
            $("#dailyservicetechnician").append(row);
          } else if (currentId == "monthlyservicebranch") {
            $("#monthlyservicetechnician").append(row);
          } else if (currentId == "yearlyservicebranch") {
            $("#yearlyservicetechnician").append(row);
          }
        });

        if (currentId == "dailyservicebranch") {
          $("#dailyservicetechnician").prepend(
            "<option value='alltechnician' selected>Technician</option>",
          );
        } else if (currentId == "monthlyservicebranch") {
          $("#monthlyservicetechnician").prepend(
            "<option value='alltechnician' selected>Technician</option>",
          );
        } else if (currentId == "yearlyservicebranch") {
          $("#yearlyservicetechnician").prepend(
            "<option value='alltechnician' selected>Technician</option>",
          );
        }
        // $('#servicetechnician').prepend("<option value='alltechnician' selected>Technician</option>");
      },
      error: function (errorThrown) {
        console.log(errorThrown);
      },
    });
  });
});

// this function is to fetch the service status on date range change on service report

$(document).ready(function () {
  $("#dailyservicedate , #dailyservicebranch , #dailyservicetechnician").on(
    "change",
    function () {
      console.log("servicedate change..");

      const csrftoken = csrf_token;
      const serviceDate = $("#dailyservicedate").val();

      console.log("--date", serviceDate);
      const serviceBranch = $("#dailyservicebranch").val();
      const serviceTechnician = $("#dailyservicetechnician").val();

      $.ajax({
        url: "/get_service_status_daily/",
        type: "POST",
        data: {
          date: serviceDate,
          branch: serviceBranch,
          technician: serviceTechnician,
        },
        contentType: "application/json",
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
          console.log("response below");
          console.log("response-", response);

          $(".servicedailyunacknowledged").text(response["Unacknowledged"]);
          $(".servicedailyinprogress").text(response["InProgress"]);
          $(".servicedailycompleted").text(response["Completed"]);
          $(".servicedailysparerequested").text(response["SpareRequested"]);
          $(".servicedailyrejected").text(response["Rejected"]);
          $(".servicedailyassigned").text(response["Assigned"]);
          $(".servicedailyspareallocated").text(response["SpareAllocated"]);
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    },
  );
});

$(document).ready(function () {
  $(
    "#monthlyservicedate , #monthlyservicebranch , #monthlyservicetechnician",
  ).on("change", function () {
    console.log("servicedate change..");

    const csrftoken = csrf_token;
    const serviceDate = $("#monthlyservicedate").val();

    console.log("--date", serviceDate);
    const serviceBranch = $("#monthlyservicebranch").val();
    const serviceTechnician = $("#monthlyservicetechnician").val();

    $.ajax({
      url: "/get_service_status_monthly/",
      type: "POST",
      data: {
        date: serviceDate,
        branch: serviceBranch,
        technician: serviceTechnician,
      },
      contentType: "application/json",
      headers: { "X-CSRFToken": csrftoken },
      success: function (response) {
        console.log("response below");
        console.log("response-", response);

        $(".servicemonthlyunacknowledged").text(response["Unacknowledged"]);
        $(".servicemonthlyinprogress").text(response["InProgress"]);
        $(".servicemonthlycompleted").text(response["Completed"]);
        $(".servicemonthlysparerequested").text(response["SpareRequested"]);
        $(".servicemonthlyrejected").text(response["Rejected"]);
        $(".servicemonthlyassigned").text(response["Assigned"]);
        $(".servicemonthlyspareallocated").text(response["SpareAllocated"]);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });
});

$(document).ready(function () {
  $("#yearlyservicedate , #yearlyservicebranch , #yearlyservicetechnician").on(
    "change",
    function () {
      console.log("servicedate change..");

      const csrftoken = csrf_token;
      const serviceDate = $("#yearlyservicedate").val();

      console.log("--date", serviceDate);
      const serviceBranch = $("#yearlyservicebranch").val();
      const serviceTechnician = $("#yearlyservicetechnician").val();

      $.ajax({
        url: "/get_service_status_yearly/",
        type: "POST",
        data: {
          date: serviceDate,
          branch: serviceBranch,
          technician: serviceTechnician,
        },
        contentType: "application/json",
        headers: { "X-CSRFToken": csrftoken },
        success: function (response) {
          console.log("response below");
          console.log("response-", response);

          $(".serviceyearlyunacknowledged").text(response["Unacknowledged"]);
          $(".serviceyearlyinprogress").text(response["InProgress"]);
          $(".serviceyearlycompleted").text(response["Completed"]);
          $(".serviceyearlysparerequested").text(response["SpareRequested"]);
          $(".serviceyearlyrejected").text(response["Rejected"]);
          $(".serviceyearlyassigned").text(response["Assigned"]);
          $(".serviceyearlyspareallocated").text(response["SpareAllocated"]);
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    },
  );
});

$("#datetimepicker").datetimepicker({
  format: "d.m.Y H:i",
  inline: true,
  lang: "ru",
  step: 5,
});

$(document).ready(function () {
  $(".service-status").change(function () {
    if ($(this).val() === "Completed") {
      $("#myModals").show();
    }
  });
  $("#cancelButton2").click(function () {
    $("#myModals").hide();
  });
});

$(document).ready(function () {
  $(".serviceprint").click(function () {
    $("#confirmationModal").show();
  });
});

$(document).ready(function () {
  $("#mobileservice").on("change", function () {
    let mobile = $(this).val();

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_customer_details/",
      type: "POST",
      data: { phone: mobile },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!", response);

        $("#firstnameservice").val(response.firstname);
        $("#lastnameservice").val(response.lastname);
        $("#addressservice").val(response.address);
        $("#customeridservice").val(response.customerid);
        $("#mobilenumber").val(response.phone);
        $("#customergst").val(response.vatnumber);
        $("#customertypeservice").val(response.customertype).change();
      },
      error: function (xhr, textStatus, errorThrown) {
        $("#firstnameservice").val("");
        $("#lastnameservice").val("");
        $("#addressservice").val("");
        $("#customeridservice").val("");
        $("#mobilenumber").val("");
        $("#customergst").val("");
        $("#customertypeservice").val("").change();
        console.error("Error sending data:", errorThrown);
        // Handle the error case
      },
    });
  });

  $("#customerbooking").on("change", function () {
    let bookingid = $(this).val();

    console.log("booking id selected");
    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_customer_booking_details/",
      type: "POST",
      data: { id: bookingid },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!", response);

        $("#firstnameservice").val(response.firstname);
        // $("#lastnameservice").val(response.lastname);
        $("#addressservice").val(response.address);
        // $("#customeridservice").val(response.customerid);
        $("#mobilenumber").val(response.phone);
        //   $('#sale-search-input-product1 option').each(function() {

        //     if ($(this).val() === response.product) {

        //         $(this).attr('selected', 'selected');
        //     }
        // });
      },
      error: function (xhr, textStatus, errorThrown) {
        $("#firstnameservice").val("");
        // $("#lastnameservice").val("");
        $("#addressservice").val("");
        // $("#customeridservice").val("");
        $("#mobilenumber").val("");
        console.error("Error sending data:", errorThrown);
        // Handle the error case
      },
    });
  });
});

// this is for date picker

$(document).ready(function () {
  $(".datepicker-field").datepicker({
    autoclose: true,
    todayHighlight: true,
  });
});

$(document).ready(function () {
  $(".datepicker-field-min-today").datepicker({
    autoclose: true,
    todayHighlight: true,
    startDate: new Date(), // This sets minimum date to today
    format: 'dd-mm-yyyy'
  });
});

// this datepicker has default current date as value
$(function () {
  $(".datepicker-current")
    .datepicker({
      autoclose: true,
      todayHighlight: true,
      
    })
    .datepicker("update", new Date());
});

// ########################
$(function () {
  $(".datepicker-current-new")
    .datepicker({
      autoclose: true,
      todayHighlight: true,
      startDate:new Date(),
      endDate:"+1d",
      
    })
    .datepicker("update", new Date());
});


    // ########################################


$(function () {
  $(".datepicker-nodefault")
    .datepicker({
      autoclose: true,
      todayHighlight: true,
      
    })
    
});

// this is for search option in select field in service entry form
$(document).ready(function () {
  $(".selectizefield").selectize({
    sortField: "text",
  });
});

// $(document).ready(function () {
//   $(select).selectize({
//     sortField:'text'
//   })
// });

$(document).ready(function () {
  $(".addsalebtnservice").click(function () {
    $(".sales-in-service").toggle();

    if ($(".sales-in-service").is(":visible")) {
      console.log("visible.......");
      $(this).text("Hide Spare Parts");
    } else {
      console.log("not visible.......");
      $(this).text("Show Spare Parts");
    }
  });
});

// ############### SERVICE ENTRY SECTION #############

// SERICE ENTRY FORM VALIDATION

$(document).ready(function () {
  const serviceEntryFormValidation = function () {
    $("#serviceForm").submit(function (event) {
      event.preventDefault(); // Prevent default form submission

      var submitStatus = false; // Flag to track duplicates

      // Check for duplicate products in service-entry-table
      var products = [];
      $(".service-entry-table tbody tr").each(function () {
        var product = $(this).find('[name^="product"]').val();
        if (products.includes(product)) {
          submitStatus = true;
          alert("Duplicate product in service table.");
          return false; // Stop further processing
        }
        products.push(product);

        var product = $(this).find('[name^="product"]').val();
        if (product === "" || product === undefined || product == "") {
          submitStatus = true;
          alert("Product is required.");
          return false;
        }

        var brand = $(this).find('[name^="brand"]').val();
        if (brand === "" || brand === undefined || brand == "") {
          submitStatus = true;
          alert("Brand is required.");
          return false;
        }

        var model = $(this).find('[name^="model"]').val();
        if (model === "" || model === undefined || model == "") {
          submitStatus = true;
          alert("Model is required.");
          return false;
        }
      });

      // Check for duplicate spareparts in sale-entry-table-in-service
      var saleNames = [];
      $(".sale-entry-table-in-service tbody tr").each(function () {
        var saleName = $(this).find('[name^="salename"]').val();
        if (saleNames.includes(saleName)) {
          submitStatus = true;
          alert("Duplicate product in Spare Parts table.");
          return false; // Stop further processing
        }
        saleNames.push(saleName);

        var salename = $(this).find('[name^="salename"]').val();
        if (salename !== "" && salename !== undefined) {
          var price = $(this).find('[name^="saleprice"]').val();
     
          if (price === "" || price === undefined || price == "") {
            submitStatus = true;
            alert("Unit Price is required.");
            return false;
          }
         

          var salegst = $(this).find('[name^="salegstsale"]').val();
          if (salegst === "" || salegst === undefined || salegst == "") {
            submitStatus = true;
            alert("Sales GST is required.");
            return false;
          }

          var salemrp = $(this).find('[name^="salemrp"]').val();
          if (salemrp === "" || salemrp === undefined || salemrp == "") {
            submitStatus = true;
            alert("MRP is required.");
            return false;
          }


          

          var salemop = $(this).find('[name^="salemop"]').val();
          if (salemop === "" || salemop === undefined || salemop == "") {
            submitStatus = true;
            alert("MOP is required.");
            return false;
          }

          var salequantity = $(this).find('[name^="salequantity"]').val();
          if (
            salequantity === "" ||
            salequantity === undefined ||
            salequantity == ""
          ) {
            submitStatus = true;
            alert("Quantity is required.");
            return false;
          }
        }
      });

      let finalAmount = $(".finalamountservice").val();
      let amountRecieved = $(".amountrecievedservice").val();

      if (parseFloat(amountRecieved) > parseFloat(finalAmount)) {
        submitStatus = true;
        alert("Amount Recieved is larger than Final Amount.");
        return false;
      }

      var firstname = $(this).find('[name^="firstnameservice"]').val();
      if (firstname === "" || firstname === undefined || firstname == "") {
        submitStatus = true;
        alert("Firstname is required.");
        return false;
      }

      var mobile = $(this).find('[name^="mobilenumber"]').val();
      if (mobile === "" || mobile === undefined || mobile == "") {
        submitStatus = true;
        alert("Mobile Number is required.");
        return false;
      }

      var status = $(this).find('[name^="status"]').val();
      if (status === "" || status === undefined || status == "") {
        submitStatus = true;
        alert("Status is required.");
        return false;
      }

      // var expdate = $(this).find('[name^="expecteddate"]').val();
      // if (expdate === "" || expdate === undefined || expdate == "") {
      //   submitStatus = true;
      //   alert("Expected date is required.");
      //   return false;
      // }

      var imei = $(this).find('[name^="imei"]').val();
      if (imei === "" || imei === undefined || imei == "") {
        submitStatus = true;
        alert("IMEI number is required.");
        return false;
      }

      
 

      var advanceAmount = parseFloat($(this).find('#amountrecievedservice').val()) || 0; 
    
      if (advanceAmount > 0) {
          var paymentmode = $(this).find('[name="paymentmode"]').val();
          if (paymentmode === "" || paymentmode === undefined || paymentmode == "") {
              submitStatus = true;
              alert("Payment Mode is required.");
              return false;
          }
      }

     

      var mobileDigit = Number(
        $(this).find('[name^="phone_number_digit"]').val(),
      );
      var enteredDigit = String(
        $(this).find('[name^="mobilenumber"]').val(),
      ).length;

      // If no duplicates found, submit the form
      if (!submitStatus) {
        $("#serviceForm")[0].submit();
      }
    });
  };
  $(".amountrecievedservice").on("change", function () {
    serviceEntryFormValidation();
  });

  serviceEntryFormValidation();
});

// code for checking when entering a service if advance amount is larger than final amount or not

$(document).ready(function () {
  $(".amountrecievedservice").change(function () {
    let finalAmount = $(".finalamountservice").val();
    let amountRecieved = $(".amountrecievedservice").val();
    if (parseFloat(amountRecieved) > parseFloat(finalAmount)) {
      submitStatus = true;
      alert("Amount Recieved is larger than Final Amount.");
      return false;
    }
  });
});

// This script append new row to service table

$(document).ready(function () {
  let rowCount = $(".service-entry-table tbody tr").length;
  // Use event delegation to handle click events for dynamically added buttons
  $(document).on("click", ".addrowbtnservice", function () {
    const lastRow = $(".service-entry-table tbody tr:last");

    console.log("new row added", rowCount);

    // Check if the last row's input with name starting with "name" has a value
    if (lastRow.find('[name^="product"]').val() !== "") {
      rowCount++;

      const newRow = lastRow.clone(); // Copy the last row

      // Update the row number in the new row
      newRow.find("td:first").text(rowCount);

      // Increment the numeric part of input names and IDs in the new row

      newRow.find('[name^="product"]').attr("name", `product${rowCount}`);
      newRow.find('[id^="product"]').attr("id", `product${rowCount}`);
      newRow.find('[list^="product"]').attr("list", `product${rowCount}`);

      newRow.find('[name^="brand"]').attr("name", `brand${rowCount}`);

      newRow.find('[name^="model"]').attr("name", `model${rowCount}`);

      newRow.find('[name^="imei"]').attr("name", `imei${rowCount}`);

      newRow
        .find('[name^="serviceprice"]')
        .attr("name", `serviceprice${rowCount}`);

      // Clear the input values in the new row (optional)
      newRow.find('input[type="text"]').val("");
      newRow.find('input[type="number"]').val("");

      lastRow.find(".addrowbtnservice").remove();

      // Append the new row to the table body
      $(".service-entry-table tbody").append(newRow);
    }
  });
});

$(document).ready(function () {
  // Function to update the attributes based on the row index
  function updateAttributesSpareRequest(row) {
    $(row)
      .find("td:first")
      .text(row.index() + 1);
    $(row)
      .find('[name^="reqspare"]')
      .attr("name", `reqspare${row.index() + 1}`);
    $(row)
      .find('[list^="reqspare"]')
      .attr("list", `reqspare${row.index() + 1}`);
    $(row)
      .find('[id^="reqspare"]')
      .attr("id", `reqspare${row.index() + 1}`);
    $(row)
      .find('[id^="req-spare"]')
      .attr("id", `req-spare${row.index() + 1}`);
    $(row)
      .find('[name^="availablereqqty"]')
      .attr("name", `availablereqqty${row.index() + 1}`);
    $(row)
      .find('[name^="reqqty"]')
      .attr("name", `reqqty${row.index() + 1}`);
    $(row)
      .find('[name^="status"]')
      .attr("name", `status${row.index() + 1}`);

    productFetchFunctionSpareRequest(`${row.index() + 1}`);
    spareRequestQtyChecking(`${row.index() + 1}`);
  }
  // Function to handle row deletion
  $(document).on("click", ".deletebtnsparereq", function () {
    var row = $(this).closest("tr");
    row.remove();

    // Update attributes for remaining rows
    $(".spare-request-table tbody tr").each(function () {
      updateAttributesSpareRequest($(this));
    });
  });
});

const spareRequestQtyChecking = function (num) {
  // checking quanty and available quantity in serviceentry
  $(`.spare-request-table tbody tr [name^='reqqty${num}']`).change(function () {
    console.log("qty-", $(this).val());
    let closestTr = $(this).closest("tr");
    if (
      $(this).val() == "" ||
      $(this).val() == undefined ||
      $(this).val() == null
    ) {
    } else if (
      parseInt($(this).val()) >
      parseInt(closestTr.find("[name^='availablereqqty']").val())
    ) {
      closestTr.find("[name^='status']").val("Not Available");
    } else if (
      parseInt($(this).val()) <=
      parseInt(closestTr.find("[name^='availablereqqty']").val())
    ) {
      closestTr.find("[name^='status']").val("Available");
    }
  });
};

const productFetchFunctionSpareRequest = function (num) {
  $(`.spare-request-table input[name="reqspare${num}"]`).on(
    "change",
    function () {
      const productname = $(this).val();

      let csrftoken = csrf_token;

      $.ajax({
        url: "/get_product_details/",
        type: "POST",
        data: { productname: productname },
        contentType: "application/json",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        success: function (response) {
          $(`.spare-request-table input[name="availablereqqty${num}"]`).val(
            response.available_qty,
          );

          if (parseInt(response.available_qty) == 0) {
            $(`.spare-request-table input[name="status${num}"]`).val(
              "Not Available",
            );
          } else if (parseInt(response.available_qty) > 0) {
            $(`.spare-request-table input[name="status${num}"]`).val(
              "Available",
            );
          }

          if (Object.keys(response).length == 0) {
            $(
              `.sale-entry-table-in-service input[name="availablesaleqty${num}"]`,
            ).val("");
            $(`.spare-request-table input[name="status${num}"]`).val("");
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    },
  );
};


// VALIDATING SPARE REQUEST/ALLOCATION FORM

$(document).ready(function () {
  $("#sparerequestform").submit(function (event) {
    event.preventDefault(); // Prevent default form submission
    
    let isValid = true; // Flag to track validation status
    
    // Check each row in the spare-request-table
    $(".spare-request-table tbody tr").each(function (index) {
      const spareInput = $(this).find('[name^="reqspare"]').val();
      const qtyInput = $(this).find('[name^="reqqty"]').val();
      
      // Check if spare part is empty
      if (!spareInput || spareInput.trim() === "") {
        alert("Please select a spare part for all rows before submitting.");
        isValid = false;
        return false; // Exit the loop
      }
      
      // Check if quantity is empty or less than 1
      if (!qtyInput || qtyInput < 1) {
        alert("Please enter a valid quantity (minimum 1) for all spare parts.");
        isValid = false;
        return false; // Exit the loop
      }
    });
    
    // If validation passes, submit the form
    if (isValid) {
      this.submit();
    }
  });
});

// code for adding new row in spare request section

$(document).ready(function () {
  // let rowCount = 1;

  productFetchFunctionSpareRequest("1");
  spareRequestQtyChecking("1");
  $(document).on("click", ".addbtnsparereq", function () {
    const lastRow = $(".spare-request-table tbody tr:last");
    let rowCount = $(".spare-request-table tbody tr").length;
    if (lastRow.find('[name^="reqspare"]').val() !== "") {
      rowCount++;

      const newRow = lastRow.clone(); // Copy the last row

      // Update the row number in the new row
      newRow.find("td:first").text(rowCount);

      newRow.find('[name^="reqspare"]').attr("name", `reqspare${rowCount}`);
      newRow.find('[list^="reqspare"]').attr("list", `reqspare${rowCount}`);
      newRow.find('[id^="reqspare"]').attr("id", `reqspare${rowCount}`);
      newRow.find('[id^="req-spare"]').attr("id", `req-spare${rowCount}`);
      newRow
        .find('[name^="availablereqqty"]')
        .attr("name", `availablereqqty${rowCount}`);
      newRow.find('[name^="reqqty"]').attr("name", `reqqty${rowCount}`);
      newRow.find('[name^="status"]').attr("name", `status${rowCount}`);

      newRow.find('input[type="text"]').val("");
      newRow.find('input[type="number"]').val("");

      lastRow.find(".addrowbtnsaleservice").remove();
      lastRow
        .find(".reqappendbtn")
        .html(
          '<span class="deletebtnsparereq"><i class="fa-solid fa-minus"></i></span>',
        );

      $(".spare-request-table tbody").append(newRow);

      productFetchFunctionSpareRequest(`${rowCount}`);
      spareRequestQtyChecking(`${rowCount}`);
    }
  });
});

const serviceSaleUpdateQtyChecking = function (num) {
  // checking quanty and available quantity in serviceentry
  $(
    `.sale-entry-table-in-service tbody tr [name^='salequantity${num}']`,
  ).change(function () {
    console.log("qty-", $(this).val());
    let closestTr = $(this).closest("tr");
    if (
      $(this).val() == "" ||
      $(this).val() == undefined ||
      $(this).val() == null
    ) {
    } else {
      if (
        parseInt($(this).val()) >
        parseInt(closestTr.find("[name^='availablesaleqty']").val())
      ) {
        alert(
          `Available Quantity is ${closestTr
            .find("[name^='availablesaleqty']")
            .val()}`,
        );
        $(this).val("");
      }
    }
  });
};

const productFetchFunctionService = function (num) {
  $(`.sale-entry-table-in-service input[name="salename${num}"]`).on(
    "change",
    function () {
      const productname = $(this).val();

      let csrftoken = csrf_token;

      $.ajax({
        url: "/get_product_details/",
        type: "POST",
        data: { productname: productname },
        contentType: "application/json",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        success: function (response) {
          // $(`.sale-entry-table-in-service input[name="salebarcode${num}"]`).val(response.barcodenumber)
          $(`.sale-entry-table-in-service input[name="saleprice${num}"]`).val(
            response.unitprice,
          );
          $(`.sale-entry-table-in-service input[name="salemrp${num}"]`).val(
            response.mrp,
          );
          $(`.sale-entry-table-in-service input[name="salemop${num}"]`).val(
            response.mop,
          );
          $(
            `.sale-entry-table-in-service input[name="availablesaleqty${num}"]`,
          ).val(response.available_qty);

          let salegst = response.salegst;
          $(
            `.sale-entry-table-in-service select[name='salegstsale${num}'] option[value='${salegst}']`,
          ).prop("selected", true);

          if (Object.keys(response).length == 0) {
            // $(`.purchase-entry-table select[name='purchasegst${num}'] option[value='']`).prop("selected", true);
            $(
              `.sale-entry-table-in-service select[name='salegstsale${num}'] option[value='']`,
            ).prop("selected", true);
            $(
              `.sale-entry-table-in-service input[name="salequantity${num}"]`,
            ).val("");
            $(
              `.sale-entry-table-in-service input[name="salebarcode${num}"]`,
            ).val("");
            $(
              `.sale-entry-table-in-service input[name="availablesaleqty${num}"]`,
            ).val("");
          }

          //  ################################################################

          let totalAmount = 0;
          let totalAmountSale = 0;
          let discount = 0;
          let amountRecieved = 0;

          function calculateNetAmount() {
            var netAmount = 0;
            // Loop through each row in the table
            $(".service-entry-table tr:gt(0)").each(function () {
              var serviceCharge =
                parseFloat($(this).find('input[name^="serviceprice"]').val()) ||
                0;

              netAmount += serviceCharge;
            });

            totalAmount = roundToTwoDecimal(netAmount);

            $('input[name="totalamount"]').val(
              roundToTwoDecimal(totalAmount + totalAmountSale).toFixed(2),
            );
            $('input[name="finalamount"]').val(
              roundToTwoDecimal(
                totalAmountSale + totalAmount - discount,
              ).toFixed(2),
            );
            $('input[name="duebalance"]').val(
              roundToTwoDecimal(
                totalAmount + totalAmountSale - discount - amountRecieved,
              ).toFixed(2),
            );
          }

          function calculateSale() {
            var netAmount = 0;
            var totalTaxAmount = 0;
            // Loop through each row in the table
            $(".sale-entry-table-in-service tr:gt(0)").each(function () {
              // console.log(this)
              var quantity =
                parseInt($(this).find('input[name^="salequantity"]').val()) ||
                0;
              var price =
                parseFloat($(this).find('input[name^="saleprice"]').val()) || 0;
              var saleGst =
                parseFloat(
                  $(this)
                    .find('select[name^="salegstsale"]')
                    .find(":selected")
                    .data("salegstsale"),
                ) || 0;
              // var totalPrice = quantity * price ;
              var totalTax = quantity * price * (saleGst / 100);
              var totalPrice =
                quantity * price + quantity * price * (saleGst / 100);

              netAmount += totalPrice;
              totalTaxAmount += totalTax;
            });
            // Set the calculated net amount in the input field and round to two decimal places

            totalAmountSale = roundToTwoDecimal(netAmount);

            $('input[name="totalamount"]').val(
              roundToTwoDecimal(totalAmountSale + totalAmount).toFixed(2),
            );
            $('input[name="finalamount"]').val(
              roundToTwoDecimal(
                totalAmountSale + totalAmount - discount,
              ).toFixed(2),
            );

            $('input[name="totaltax"]').val(totalTaxAmount.toFixed(2));
            $('input[name="duebalance"]').val(
              roundToTwoDecimal(
                totalAmount + totalAmountSale - discount - amountRecieved,
              ).toFixed(2),
            );
          }

          // Helper function to round a number to two decimal places
          function roundToTwoDecimal(number) {
            return Math.round(number * 100) / 100;
          }

          calculateSale();
          calculateNetAmount();

          //  ################################################################
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    },
  );
};

$(document).ready(function () {
  // let rowCount = 1;
  let rowCount = $(".sale-entry-table-in-service tbody tr").length;

  if (
    rowCount == 0 ||
    rowCount == undefined ||
    rowCount == "" ||
    rowCount == null
  ) {
  } else {
    for (let index = 0; index <= rowCount; index++) {
      productFetchFunctionService(`${index}`);
      serviceSaleUpdateQtyChecking(`${index}`);
    }
  }

  // Use event delegation to handle click events for dynamically added buttons
  $(document).on("click", ".addrowbtnsaleservice", function () {
    const lastRow = $(".sale-entry-table-in-service tbody tr:last");

    // Check if the last row's input with name starting with "name" has a value
    if (lastRow.find('[name^="salename"]').val() !== "") {
      rowCount++;

      console.log("service update...");

      const newRow = lastRow.clone(); // Copy the last row

      // Update the row number in the new row
      newRow.find("td:first").text(rowCount);

      // Increment the numeric part of input names and IDs in the new row
      newRow.find('[name^="salename"]').attr("name", `salename${rowCount}`);
      newRow
        .find('[name^="salebarcode"]')
        .attr("name", `salebarcode${rowCount}`);
      newRow.find('[name^="saleprice"]').attr("name", `saleprice${rowCount}`);
      // newRow.find('[name^="purchasegst"]').attr('name', `purchasegst${rowCount}`);
      newRow
        .find('[name^="salegstsale"]')
        .attr("name", `salegstsale${rowCount}`);
      newRow.find('[id^="salegstsale"]').attr("id", `salegstsale${rowCount}`);
      newRow
        .find('[list^="salegstsale"]')
        .attr("list", `salegstsale${rowCount}`);
      newRow.find('[name^="salemrp"]').attr("name", `salemrp${rowCount}`);
      newRow.find('[name^="salemop"]').attr("name", `salemop${rowCount}`);
      newRow
        .find('[name^="salequantity"]')
        .attr("name", `salequantity${rowCount}`);
      newRow
        .find('[name^="availablesaleqty"]')
        .attr("name", `availablesaleqty${rowCount}`);
      newRow
        .find('[id^="sale-search-input-name"]')
        .attr("id", `sale-search-input-name${rowCount}`);
      newRow.find('[list^="salename"]').attr("list", `salename${rowCount}`);
      newRow.find('[id^="salename"]').attr("id", `salename${rowCount}`);

      // Clear the input values in the new row (optional)
      newRow.find('input[type="text"]').val("");
      newRow.find('input[type="number"]').val("");

      lastRow.find(".addrowbtnsaleservice").remove();
      lastRow
        .find(".puchase-qty-left")
        .html(
          '<span class="deletebtnservice"><i class="fa-solid fa-minus"></i></span>',
        );

      // Append the new row to the table body
      $(".sale-entry-table-in-service tbody").append(newRow);

      productFetchFunctionService(`${rowCount}`);
      serviceSaleUpdateQtyChecking(`${rowCount}`);
    }
  });
});

$(document).ready(function () {
  // Function to update the attributes based on the row index
  function updateAttributesService(row) {
    $(row)
      .find("td:first")
      .text(row.index() + 1);
    $(row)
      .find('[name^="salename"]')
      .attr("name", `salename${row.index() + 1}`);
    $(row)
      .find('[name^="salebarcode"]')
      .attr("name", `salebarcode${row.index() + 1}`);
    $(row)
      .find('[name^="saleprice"]')
      .attr("name", `saleprice${row.index() + 1}`);

    $(row)
      .find('[name^="salegstsale"]')
      .attr("name", `salegstsale${row.index() + 1}`);
    $(row)
      .find('[name^="salemrp"]')
      .attr("name", `salemrp${row.index() + 1}`);
    $(row)
      .find('[name^="salemop"]')
      .attr("name", `salemop${row.index() + 1}`);
    $(row)
      .find('[name^="salequantity"]')
      .attr("name", `salequantity${row.index() + 1}`);
    $(row)
      .find('[name^="availablesaleqty"]')
      .attr("name", `availablesaleqty${row.index() + 1}`);
    $(row)
      .find('[id^="sale-search-input-name"]')
      .attr("id", `sale-search-input-name${row.index() + 1}`);
    $(row)
      .find('[list^="salename"]')
      .attr("list", `salename${row.index() + 1}`);
    $(row)
      .find('[id^="salename"]')
      .attr("id", `salename${row.index() + 1}`);

    productFetchFunctionService(`${row.index() + 1}`);
    serviceSaleUpdateQtyChecking(`${row.index() + 1}`);
  }
  // Function to handle row deletion
  $(document).on("click", ".deletebtnservice", function () {
    var row = $(this).closest("tr");
    row.remove();

    // Update attributes for remaining rows
    $(".sale-entry-table-in-service tbody tr").each(function () {
      updateAttributesService($(this));
    });
  });
});

// this script is for service entry

$(document).ready(function () {
  let totalAmount = 0;
  let totalAmountSale = 0;
  let discount = 0;
  let amountRecieved = 0;
  // let dueAmount = 0;
  // $('input[name="recieved"]').val(roundToTwoDecimal(0.00))
  // $('input[name="totalamount"]').val(roundToTwoDecimal(0.00))

  // Trigger the calculation when the quantity or unit price inputs change
  $(".service-entry-table tbody").on(
    "input change",
    'input[name^="serviceprice"]',
    function () {
      calculateNetAmount();
      calculateSale();
      // dueCalculation()
    },
  );

  function calculateNetAmount() {
    var netAmount = 0;
    // Loop through each row in the table
    $(".service-entry-table tr:gt(0)").each(function () {
      var serviceCharge =
        parseFloat($(this).find('input[name^="serviceprice"]').val()) || 0;

      netAmount += serviceCharge;
    });

    totalAmount = roundToTwoDecimal(netAmount);

    $('input[name="totalamount"]').val(
      roundToTwoDecimal(totalAmount + totalAmountSale).toFixed(2),
    );
    $('input[name="finalamount"]').val(
      roundToTwoDecimal(totalAmountSale + totalAmount - discount).toFixed(2),
    );
    $('input[name="duebalance"]').val(
      roundToTwoDecimal(
        totalAmount + totalAmountSale - discount - amountRecieved,
      ).toFixed(2),
    );
  }

  $(".sale-entry-table-in-service tbody").on(
    "input change",
    'input[name^="salequantity"], input[name^="saleprice"], select[name^="salegstsale"]',
    function () {
      calculateSale();
      calculateNetAmount();
      // dueCalculation()
    },
  );

  $(document).on("click", ".deletebtnservice", function () {
    calculateSale();
    calculateNetAmount();
    // dueCalculation()
  });

  function calculateSale() {
    var netAmount = 0;
    var totalTaxAmount = 0;
    // Loop through each row in the table
    $(".sale-entry-table-in-service tr:gt(0)").each(function () {
      // console.log(this)
      var quantity =
        parseInt($(this).find('input[name^="salequantity"]').val()) || 0;
      var price =
        parseFloat($(this).find('input[name^="saleprice"]').val()) || 0;
      var saleGst =
        parseFloat(
          $(this)
            .find('select[name^="salegstsale"]')
            .find(":selected")
            .data("salegstsale"),
        ) || 0;
      // var totalPrice = quantity * price ;
      var totalTax = quantity * price * (saleGst / 100);
      var totalPrice = quantity * price + quantity * price * (saleGst / 100);

      netAmount += totalPrice;
      totalTaxAmount += totalTax;
    });
    // Set the calculated net amount in the input field and round to two decimal places

    totalAmountSale = roundToTwoDecimal(netAmount);

    $('input[name="totalamount"]').val(
      roundToTwoDecimal(totalAmountSale + totalAmount).toFixed(2),
    );
    $('input[name="finalamount"]').val(
      roundToTwoDecimal(totalAmountSale + totalAmount - discount).toFixed(2),
    );

    $('input[name="totaltax"]').val(totalTaxAmount.toFixed(2));
    $('input[name="duebalance"]').val(
      roundToTwoDecimal(
        totalAmount + totalAmountSale - discount - amountRecieved,
      ).toFixed(2),
    );
  }

  // Calculate discount when discount method changes
  $('input[name="discountservice"]').on("input change", function () {
    discount = parseFloat($(this).val());
    if (isNaN(discount)) {
      discount = 0;
    }

    calculateNetAmount();
    calculateSale();
  });

  $('input[name="amountrecievedservice"]').change(function () {
    amountRecieved = parseFloat($(this).val());
    if (isNaN(amountRecieved)) {
      amountRecieved = 0.0;
    }
    calculateNetAmount();
    calculateSale();
    // dueCalculationservice()
  });

  // Helper function to round a number to two decimal places
  function roundToTwoDecimal(number) {
    return Math.round(number * 100) / 100;
  }
});

// ############### SERVICE UPDATE SECTION #############

const serviceUpdateSaleQtyChecking = function (num) {
  // checking quanty and available quantity in serviceupdate
  $(
    `.sale-entry-table-in-service-update tbody tr [name^='salequantity${num}']`,
  ).change(function () {
    console.log("qty-", $(this).val());
    let closestTr = $(this).closest("tr");
    if (
      $(this).val() == "" ||
      $(this).val() == undefined ||
      $(this).val() == null
    ) {
    } else {
      if (
        parseInt($(this).val()) >
        parseInt(closestTr.find("[name^='availablesaleqty']").val())
      ) {
        alert(
          `Available Quantity is ${closestTr
            .find("[name^='availablesaleqty']")
            .val()}`,
        );
        $(this).val("");
      }
    }
  });
};

const productFetchFunctionServiceUpdate = function (num) {
  $(`.sale-entry-table-in-service-update input[name="salename${num}"]`).on(
    "change",
    function () {
      const productname = $(this).val();

      console.log(`changed${num}`);
      let csrftoken = csrf_token;

      $.ajax({
        url: "/get_product_details/",
        type: "POST",
        data: { productname: productname },
        contentType: "application/json",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        success: function (response) {
          console.log("response..", response);

          // $(`.sale-entry-table-in-service-update input[name="salebarcode${num}"]`).val(response.barcodenumber)
          $(
            `.sale-entry-table-in-service-update input[name="saleprice${num}"]`,
          ).val(response.unitprice);
          $(
            `.sale-entry-table-in-service-update input[name="salemrp${num}"]`,
          ).val(response.mrp);
          $(
            `.sale-entry-table-in-service-update input[name="salemop${num}"]`,
          ).val(response.mop);
          $(
            `.sale-entry-table-in-service-update input[name="availablesaleqty${num}"]`,
          ).val(response.available_qty);

          let salegst = response.salegst;
          $(
            `.sale-entry-table-in-service-update select[name='salegstsale${num}'] option[value='${salegst}']`,
          ).prop("selected", true);

          if (Object.keys(response).length == 0) {
            // $(`.purchase-entry-table select[name='purchasegst${num}'] option[value='']`).prop("selected", true);
            $(
              `.sale-entry-table-in-service-update select[name='salegstsale${num}'] option[value='']`,
            ).prop("selected", true);
            $(
              `.sale-entry-table-in-service-update input[name="salequantity${num}"]`,
            ).val("");
            $(
              `.sale-entry-table-in-service-update input[name="salebarcode${num}"]`,
            ).val("");

            // #############################################################################

            let totalAmount = 0;
            let totalAmountSale = 0;
            let totalTaxAmountFinal = 0;
            let discount = 0;
            let amountRecieved = parseFloat($("#amountrecievedupdate").val());

            function roundToTwoDecimal(number) {
              return Math.round(number * 100) / 100;
            }

            function calculateNetAmountInDiscount2() {
              var netAmount = 0;
              // Loop through each row in the table
              $(".service-entry-table-update tr:gt(0)").each(function () {
                console.log("changing service.......2222");
                // console.log(this)
                var serviceCharge =
                  parseFloat(
                    $(this).find('input[name^="serviceprice"]').val(),
                  ) || 0;

                netAmount += serviceCharge;
              });

              totalAmount = roundToTwoDecimal(netAmount);
              $('input[name="totalamount"]').val(
                roundToTwoDecimal(totalAmountSale + totalAmount).toFixed(2),
              );
              $('input[name="finalamount"]').val(
                roundToTwoDecimal(
                  totalAmountSale + totalAmount - discount,
                ).toFixed(2),
              );
              $('input[name="duebalance"]').val(
                roundToTwoDecimal(
                  totalAmountSale + totalAmount - discount - amountRecieved,
                ).toFixed(2),
              );
              $('input[name="totaltax"]').val(totalTaxAmountFinal.toFixed(2));
            }

            function calculateSaleInDiscount2() {
              var netAmount = 0;
              var totalTaxAmount = 0;
              // Loop through each row in the table
              $(".sale-entry-table-in-service-update tr:gt(0)").each(
                function () {
                  console.log("changing sale.......2222");

                  var quantity =
                    parseInt(
                      $(this).find('input[name^="salequantity"]').val(),
                    ) || 0;
                  var price =
                    parseFloat(
                      $(this).find('input[name^="saleprice"]').val(),
                    ) || 0;
                  var saleGst =
                    parseFloat(
                      $(this)
                        .find('select[name^="salegstsale"]')
                        .find(":selected")
                        .data("salegstsale"),
                    ) || 0;

                  var totalTax = quantity * price * (saleGst / 100);
                  var totalPrice =
                    quantity * price + quantity * price * (saleGst / 100);

                  netAmount += totalPrice;
                  totalTaxAmount += totalTax;
                },
              );
              // Set the calculated net amount in the input field and round to two decimal places
              console.log("total tax amount", totalTaxAmount);
              totalAmountSale = roundToTwoDecimal(netAmount);
              totalTaxAmountFinal = roundToTwoDecimal(totalTaxAmount);

              $('input[name="totalamount"]').val(
                roundToTwoDecimal(totalAmountSale + totalAmount).toFixed(2),
              );
              $('input[name="finalamount"]').val(
                roundToTwoDecimal(
                  totalAmountSale + totalAmount - discount,
                ).toFixed(2),
              );
              $('input[name="duebalance"]').val(
                roundToTwoDecimal(
                  totalAmountSale + totalAmount - discount - amountRecieved,
                ).toFixed(2),
              );
              $('input[name="totaltax"]').val(totalTaxAmountFinal.toFixed(2));
            }
            calculateNetAmountInDiscount2();
            calculateSaleInDiscount2();

            // #############################################################################
          }
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    },
  );
};

$(document).ready(function () {
  // Function to update the attributes based on the row index
  function updateAttributesServiceUpdate(row) {
    $(row)
      .find("td:first")
      .text(row.index() + 1);
    $(row)
      .find('[name^="salename"]')
      .attr("name", `salename${row.index() + 1}`);
    $(row)
      .find('[name^="salebarcode"]')
      .attr("name", `salebarcode${row.index() + 1}`);
    $(row)
      .find('[name^="saleprice"]')
      .attr("name", `saleprice${row.index() + 1}`);
    // $(row).find('[name^="purchasegst"]').attr('name', `purchasegst${rowCount}`);
    // $(row).find('[name^="salegstsale"]').val("")
    $(row)
      .find('[name^="salegstsale"]')
      .attr("name", `salegstsale${row.index() + 1}`);
    // $(row).find('[id^="salegstsale"]').attr('id', `salegstsale${row.index() + 1}`);
    // $(row).find('[list^="salegstsale"]').attr('list', `salegstsale${rowCount}`);
    $(row)
      .find('[name^="salemrp"]')
      .attr("name", `salemrp${row.index() + 1}`);
    $(row)
      .find('[name^="salemop"]')
      .attr("name", `salemop${row.index() + 1}`);
    $(row)
      .find('[name^="salequantity"]')
      .attr("name", `salequantity${row.index() + 1}`);
    $(row)
      .find('[name^="availablesaleqty"]')
      .attr("name", `availablesaleqty${row.index() + 1}`);
    $(row)
      .find('[id^="sale-search-input-name"]')
      .attr("id", `sale-search-input-name${row.index() + 1}`);
    $(row)
      .find('[list^="salename"]')
      .attr("list", `salename${row.index() + 1}`);
    $(row)
      .find('[id^="salename"]')
      .attr("id", `salename${row.index() + 1}`);

    productFetchFunctionServiceUpdate(`${row.index() + 1}`);
    serviceUpdateSaleQtyChecking(`${row.index() + 1}`);
  }
  // Function to handle row deletion
  $(document).on("click", ".deletebtnserviceupdate", function () {
    var row = $(this).closest("tr");
    row.remove();

    // Update attributes for remaining rows
    $(".sale-entry-table-in-service-update tbody tr").each(function () {
      updateAttributesServiceUpdate($(this));
    });
  });
});

// this script is for service entry update

$(document).ready(function () {
  let totalAmount = 0;
  let totalAmountSale = 0;
  let totalTaxAmountFinal = 0;
  let discount = 0;
  let amountRecieved = parseFloat($("#amountrecievedupdate").val());

  // Trigger the calculation when the quantity or unit price inputs change
  $(".service-entry-table-update tbody").on(
    "input change",
    'input[name^="serviceprice"]',
    function () {
      calculateNetAmountInDiscount();
      calculateSaleInDiscount();
    },
  );

  function calculateNetAmountInDiscount() {
    var netAmount = 0;
    // Loop through each row in the table
    $(".service-entry-table-update tr:gt(0)").each(function () {
      console.log("changing service.......");
      // console.log(this)
      var serviceCharge =
        parseFloat($(this).find('input[name^="serviceprice"]').val()) || 0;

      netAmount += serviceCharge;
    });

    totalAmount = roundToTwoDecimal(netAmount);
    $('input[name="totalamount"]').val(
      roundToTwoDecimal(totalAmountSale + totalAmount).toFixed(2),
    );
    $('input[name="finalamount"]').val(
      roundToTwoDecimal(totalAmountSale + totalAmount - discount).toFixed(2),
    );
    $('input[name="duebalance"]').val(
      roundToTwoDecimal(
        totalAmountSale + totalAmount - discount - amountRecieved,
      ).toFixed(2),
    );
    $('input[name="totaltax"]').val(totalTaxAmountFinal.toFixed(2));
  }

  $(".sale-entry-table-in-service-update tbody").on(
    "input change",
    'input[name^="salequantity"], input[name^="saleprice"], select[name^="salegstsale"]',
    function () {
      calculateSaleInDiscount();
      calculateNetAmountInDiscount();
    },
  );

  $(document).on("click", ".deletebtnserviceupdate", function () {
    calculateSaleInDiscount();
    calculateNetAmountInDiscount();
    // dueCalculation()
  });

  function calculateSaleInDiscount() {
    var netAmount = 0;
    var totalTaxAmount = 0;
    // Loop through each row in the table
    $(".sale-entry-table-in-service-update tr:gt(0)").each(function () {
      console.log("changing sale.......");

      var quantity =
        parseInt($(this).find('input[name^="salequantity"]').val()) || 0;
      var price =
        parseFloat($(this).find('input[name^="saleprice"]').val()) || 0;
      var saleGst =
        parseFloat(
          $(this)
            .find('select[name^="salegstsale"]')
            .find(":selected")
            .data("salegstsale"),
        ) || 0;

      var totalTax = quantity * price * (saleGst / 100);
      var totalPrice = quantity * price + quantity * price * (saleGst / 100);

      netAmount += totalPrice;
      totalTaxAmount += totalTax;
    });
    // Set the calculated net amount in the input field and round to two decimal places
    console.log("total tax amount", totalTaxAmount);
    totalAmountSale = roundToTwoDecimal(netAmount);
    totalTaxAmountFinal = roundToTwoDecimal(totalTaxAmount);

    $('input[name="totalamount"]').val(
      roundToTwoDecimal(totalAmountSale + totalAmount).toFixed(2),
    );
    $('input[name="finalamount"]').val(
      roundToTwoDecimal(totalAmountSale + totalAmount - discount).toFixed(2),
    );
    $('input[name="duebalance"]').val(
      roundToTwoDecimal(
        totalAmountSale + totalAmount - discount - amountRecieved,
      ).toFixed(2),
    );
    $('input[name="totaltax"]').val(totalTaxAmountFinal.toFixed(2));
  }

  // Calculate discount when discount method changes
  $('input[name="discountserviceupdate"]').on("input change", function () {
    discount = parseFloat($(this).val());
    console.log(discount);
    calculateNetAmountInDiscount();
    calculateSaleInDiscount();
  });

  // $('input[name="amountrecievedupdate"]').on('input change',function(){
  $("#amountrecievedupdate").on("input change", function () {
    amountRecieved = parseFloat($(this).val());

    if (isNaN(amountRecieved)) {
      amountRecieved = 0;
    }
    calculateNetAmountInDiscount();
    calculateSaleInDiscount();
    if (isNaN(amountRecieved)) {
      amountRecieved = 0;
    }
  });

  // Helper function to round a number to two decimal places
  function roundToTwoDecimal(number) {
    return Math.round(number * 100) / 100;
  }
});

// this script is for service entry update
$(document).ready(function () {
  let rowCount = $(".service-entry-table-update tbody tr").length;

  // Use event delegation to handle click events for dynamically added buttons
  $(document).on("click", ".addrowbtnservice", function () {
    const lastRow = $(".service-entry-table-update tbody tr:last");

    // Check if the last row's input with name starting with "name" has a value
    if (lastRow.find('[name^="product"]').val() !== "") {
      rowCount++;

      const newRow = lastRow.clone(); // Copy the last row

      // Update the row number in the new row
      newRow.find("td:first").text(rowCount);

      // Increment the numeric part of input names and IDs in the new row

      newRow.find('[name^="product"]').attr("name", `product${rowCount}`);
      newRow.find('[id^="product"]').attr("id", `product${rowCount}`);
      newRow.find('[list^="product"]').attr("list", `product${rowCount}`);

      newRow.find('[name^="brand"]').attr("name", `brand${rowCount}`);

      newRow.find('[name^="model"]').attr("name", `model${rowCount}`);

      newRow.find('[name^="imei"]').attr("name", `imei${rowCount}`);

      newRow
        .find('[name^="serviceprice"]')
        .attr("name", `serviceprice${rowCount}`);

      // Clear the input values in the new row (optional)
      newRow.find('input[type="text"]').val("");
      newRow.find('input[type="number"]').val("");

      lastRow.find(".addrowbtnservice").remove();

      // Append the new row to the table body
      $(".service-entry-table-update tbody").append(newRow);
    }
  });
});

$(document).ready(function () {
  if ($("#finalamount").val() == $("#amountrecievedupdate").val()) {
    $("#amountrecievedupdate").attr("readonly", true);
  }
});

// this script is for service entry update

$(document).ready(function () {
  // let rowCount = 1;
  let rowCount = $(".sale-entry-table-in-service-update tbody tr").length;

  if (
    rowCount == 0 ||
    rowCount == undefined ||
    rowCount == "" ||
    rowCount == null
  ) {
  } else {
    for (let index = 0; index <= rowCount; index++) {
      productFetchFunctionServiceUpdate(`${index}`);
      serviceUpdateSaleQtyChecking(`${index}`);
    }
  }

  // Use event delegation to handle click events for dynamically added buttons
  $(document).on("click", ".addrowbtnsaleservice", function () {
    const lastRow = $(".sale-entry-table-in-service-update tbody tr:last");

    console.log("service update..");

    // Check if the last row's input with name starting with "name" has a value
    if (lastRow.find('[name^="salename"]').val() !== "") {
      rowCount++;

      const newRow = lastRow.clone(); // Copy the last row

      // Update the row number in the new row
      newRow.find("td:first").text(rowCount);

      // Increment the numeric part of input names and IDs in the new row
      newRow.find('[name^="salename"]').attr("name", `salename${rowCount}`);
      newRow
        .find('[name^="salebarcode"]')
        .attr("name", `salebarcode${rowCount}`);
      newRow.find('[name^="saleprice"]').attr("name", `saleprice${rowCount}`);
      // newRow.find('[name^="purchasegst"]').attr('name', `purchasegst${rowCount}`);
      newRow.find('[name^="salegstsale"]').val("");
      newRow
        .find('[name^="salegstsale"]')
        .attr("name", `salegstsale${rowCount}`);
      newRow.find('[id^="salegstsale"]').attr("id", `salegstsale${rowCount}`);
      // newRow.find('[list^="salegstsale"]').attr('list', `salegstsale${rowCount}`);
      newRow.find('[name^="salemrp"]').attr("name", `salemrp${rowCount}`);
      newRow.find('[name^="salemop"]').attr("name", `salemop${rowCount}`);
      newRow
        .find('[name^="salequantity"]')
        .attr("name", `salequantity${rowCount}`);
      newRow
        .find('[name^="availablesaleqty"]')
        .attr("name", `availablesaleqty${rowCount}`);
      newRow
        .find('[id^="sale-search-input-name"]')
        .attr("id", `sale-search-input-name${rowCount}`);
      newRow.find('[list^="salename"]').attr("list", `salename${rowCount}`);
      newRow.find('[id^="salename"]').attr("id", `salename${rowCount}`);

      // Clear the input values in the new row (optional)
      newRow.find('input[type="text"]').val("");
      newRow.find('input[type="number"]').val("");

      lastRow.find(".addrowbtnsaleservice").remove();
      lastRow
        .find(".puchase-qty-left")
        .html(
          '<span class="deletebtnserviceupdate"><i class="fa-solid fa-minus"></i></span>',
        );

      // Append the new row to the table body
      $(".sale-entry-table-in-service-update tbody").append(newRow);

      productFetchFunctionServiceUpdate(`${rowCount}`);
      serviceUpdateSaleQtyChecking(`${rowCount}`);
    }
  });
});

// SERVICE UPDATE FORM VALIDATION

$(document).ready(function () {
  const serviceEntryUpdateFormValidation = function () {
    $("#serviceUpdateForm").submit(function (event) {
      event.preventDefault(); // Prevent default form submission

      var submitStatus = false; // Flag to track duplicates

      // Check for duplicate products in service-entry-table
      var products = [];
      $(".service-entry-table-update tbody tr").each(function () {
        var product = $(this).find('[name^="product"]').val();
        if (products.includes(product)) {
          submitStatus = true;
          alert("Duplicate product in service table.");
          return false; // Stop further processing
        }
        products.push(product);

        var product = $(this).find('[name^="product"]').val();
        if (product === "" || product === undefined || product == "") {
          submitStatus = true;
          alert("Product is required.");
          return false;
        }

        var brand = $(this).find('[name^="brand"]').val();
        if (brand === "" || brand === undefined || brand == "") {
          submitStatus = true;
          alert("Brand is required.");
          return false;
        }

        var model = $(this).find('[name^="model"]').val();
        if (model === "" || model === undefined || model == "") {
          submitStatus = true;
          alert("Model is required.");
          return false;
        }

        var imei = $(this).find('[name^="imei"]').val();
        if (imei === "" || imei === undefined || imei == "") {
          submitStatus = true;
          alert("IMEI is required.");
          return false;
        }

        // var price= $(this).find('[name^="serviceprice"]').val();
        // if (price === '' || price === undefined || price== '') {
        //   submitStatus = true;
        // alert('Service Charge is required.');
        // return false;
        // }
      });

      // Check for duplicate spareparts in sale-entry-table-in-service
      var saleNames = [];
      $(".sale-entry-table-in-service-update tbody tr").each(function () {
        var saleName = $(this).find('[name^="salename"]').val();
        if (saleNames.includes(saleName)) {
          submitStatus = true;
          alert("Duplicate product in Spare Parts table.");
          return false; // Stop further processing
        }
        saleNames.push(saleName);

        var salename = $(this).find('[name^="salename"]').val();
        if (salename !== "" && salename !== undefined) {
          // var barcode= $(this).find('[name^="salebarcode"]').val();
          // if (barcode === '' || barcode === undefined || barcode== '') {
          //   submitStatus = true;
          // alert('Barcode is required.');
          // return false;
          // }

          var price = $(this).find('[name^="saleprice"]').val();
          if (price === "" || price === undefined || price == "") {
            submitStatus = true;
            alert("Unit Price is required.");
            return false;
          }

          let finalAmount = $("#finalamount").val();
          let amountRecieved = $("#amountrecievedupdate").val();

          if (parseFloat(amountRecieved) > parseFloat(finalAmount)) {
            submitStatus = true;
            alert("Amount Recieved is larger than Final Amount.");
            return false;
          }

          // let amountRecievedHidden = $("#amountrecievedupdatehidden").val()

          // alert("recieved-",amountRecievedHidden,"paying-",amountRecieved)
          // if (parseFloat(amountRecieved) < parseFloat(amountRecievedHidden)){
          //   submitStatus = true;
          //   alert(`Customer already paid ${amountRecievedHidden}`);
          //   return false
          // }

          var salegst = $(this).find('[name^="salegstsale"]').val();
          if (salegst === "" || salegst === undefined || salegst == "") {
            submitStatus = true;
            alert("Sales GST is required.");
            return false;
          }

          var salemrp = $(this).find('[name^="salemrp"]').val();
          if (salemrp === "" || salemrp === undefined || salemrp == "") {
            submitStatus = true;
            alert("MRP is required.");
            return false;
          }

          var salemop = $(this).find('[name^="salemop"]').val();
          if (salemop === "" || salemop === undefined || salemop == "") {
            submitStatus = true;
            alert("MOP is required.");
            return false;
          }

          var salequantity = $(this).find('[name^="salequantity"]').val();
          if (
            salequantity === "" ||
            salequantity === undefined ||
            salequantity == ""
          ) {
            submitStatus = true;
            alert("Quantity is required.");
            return false;
          }
        }
      });

      let amountRecievedHidden = parseFloat(
        $("#amountrecievedupdatehidden").val(),
      );
      let amountRecieved = parseFloat($("#amountrecievedupdate").val());

      if (parseFloat(amountRecieved) < parseFloat(amountRecievedHidden)) {
        submitStatus = true;
        alert(`Customer already paid ${amountRecievedHidden}`);
        return false;
      }

      let finalAmount = parseFloat($(".finalamount-serviceupdate").val());

      if (parseFloat(finalAmount) < parseFloat(amountRecieved)) {
        submitStatus = true;
        alert(`Amount Recieved should not be heigher than Final Amount.`);
        return false;
      }

      var firstname = $(this).find('[name^="firstnameservice"]').val();
      if (firstname === "" || firstname === undefined || firstname == "") {
        submitStatus = true;
        alert("Firstname is required.");
        return false;
      }

      var mobile = $(this).find('[name^="mobilenumber"]').val();
      if (mobile === "" || mobile === undefined || mobile == "") {
        submitStatus = true;
        alert("Mobile Number is required.");
        return false;
      }

      var status = $(this).find('[name^="status"]').val();
      if (status === "" || status === undefined || status == "") {
        submitStatus = true;
        alert("Status is required.");
        return false;
      }

      var paymentmode = $(this).find('[name^="paymentmode"]').val();
      if (
        paymentmode === "" ||
        paymentmode === undefined ||
        paymentmode == ""
      ) {
        submitStatus = true;
        alert("Payment Mode is required.");
        return false;
      }

      // If no duplicates found, submit the form
      if (!submitStatus) {
        $("#serviceUpdateForm")[0].submit();
      }
    });
  };

  $(".amountrecievedupdate").on("change", function () {
    serviceEntryUpdateFormValidation();
  });

  serviceEntryUpdateFormValidation();
});

// #########################################################
// ############### Expense section #######################
// #########################################################

$(document).ready(function () {
  $(".addcategorybtn").click(function () {
    $(".modalexpensecategory").show();
  });
});

$(document).ready(function () {
  $(".addcategorytypebtn").click(function () {
    $(".modalexpensecategorytype").show();
  });

  $("#cancelButtontype").click(function () {
    $(".modalexpensecategorytype").hide();
  });
});

$(document).ready(function () {
  $("#expensecategory").change(function () {
    var category = $(this).val();

    console.log("expensecategory");
    console.log(category);

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_expensetype_by_category/",
      type: "POST",
      data: { category: category },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!");
        console.log("response..", response);

        // Assuming you have initialized Selectize.js on the #expensetype element
        var $expensetypeSelect = $("#expensetype")[0].selectize;

        // Clear existing options
        $expensetypeSelect.clearOptions();

        // Add new options
        $.each(response.type, function (index, element) {
          console.log(element);
          $expensetypeSelect.addOption({ value: element, text: element });
        });

        // Refresh Selectize.js to update the UI
        $expensetypeSelect.refreshItems();

        // Set the selected option to the default (if needed)
        $expensetypeSelect.setValue("", false);

        // Trigger the change event to update Selectize.js
        $expensetypeSelect.trigger("change");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        $("#expensetype").empty();
        $("#expensetype").prepend(
          "<option value='' selected >Select Type</option>",
        );
      },
    });
  });
});

// #########################################################
// ############### Registration section #######################
// #########################################################

// ########### Product adding #############

$(document).ready(function () {
  $(".registrationcategory").change(function () {
    var category = $(this).val();

    console.log(category);

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_subcategory_by_category/",
      type: "POST",
      data: { category: category },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!");
        console.log("response..", response);

        // Assuming you have initialized Selectize.js on the #expensetype element
        var $expensetypeSelect = $(".registrationsubcategory")[0].selectize;

        // Clear existing options
        $expensetypeSelect.clearOptions();

        // Add new options
        $.each(response.subcategory, function (index, element) {
          console.log(element);
          $expensetypeSelect.addOption({ value: element, text: element });
        });

        // Refresh Selectize.js to update the UI
        $expensetypeSelect.refreshItems();

        // Set the selected option to the default (if needed)
        $expensetypeSelect.setValue("", false);

        // Trigger the change event to update Selectize.js
        $expensetypeSelect.trigger("change");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        $(".registrationsubcategory").empty();
        $(".registrationsubcategory").prepend(
          "<option value='' selected >Select Sub Category</option>",
        );
      },
    });
  });
});

// ########### Product updating #############

$(document).ready(function () {
  $(".registrationcategoryedit").change(function () {
    var category = $(this).val();

    console.log(category);

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_subcategory_by_category/",
      type: "POST",
      data: { category: category },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!");
        console.log("response..", response);

        // Assuming you have initialized Selectize.js on the #expensetype element
        var $expensetypeSelect = $(".registrationsubcategoryedit")[0].selectize;

        $expensetypeSelect.clear();

        // Clear existing options
        $expensetypeSelect.clearOptions();

        // Add new options
        $.each(response.subcategory, function (index, element) {
          console.log(element, "elem");
          $expensetypeSelect.addOption({ value: element, text: element });
        });

        // Refresh Selectize.js to update the UI
        $expensetypeSelect.refreshItems();

        // Set the selected option to the default (if needed)

        $expensetypeSelect.setValue("", false);

        // Trigger the change event to update Selectize.js
        $expensetypeSelect.trigger("change");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        $(".registrationsubcategoryedit").empty();
        $(".registrationsubcategoryedit").prepend(
          "<option value='' selected >Select Sub Category</option>",
        );
      },
    });
  });
});

// ########################################################
// ############### stock section ###########################
// ########################################################

$(document).ready(function () {
  $(".stocktransferproduct").change(function () {
    const productid = $(this).val();
    const csrftoken = csrf_token;
    $.ajax({
      url: "/get_product_details_stocktransfer/",
      type: "POST",
      data: { productid: productid },
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        $(".stocktransferavailableqty").val(response.available_qty);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });
});

$(document).ready(function () {
  $(".stocktransferqty").change(function () {
    const qty = $(this).val();

    const aqty = $(".stocktransferavailableqty").val();
   
    if (qty == null || qty == undefined || qty == "") {
    } else {
      console.log("else");
      if (parseInt(qty) > parseInt(aqty)) {
        alert(`Available Quantity is ${aqty}`);
        $(this).val("");
      }
    }
  });
});

// #########################################################
// ############### Service Update Section #######################
// #########################################################

$(document).ready(function () {
  let final = parseFloat($("#finalamountupdt").val());
  let recieved = parseFloat($("#amountrecievedupdt").val());
  // let balance = parseFloat($('[name^="duebalanceupdt"]').val());

  function calculateDue() {
    let due = final - recieved;
    $("#duebalanceupdt").val(due);
  }

  $("#finalamountupdt").change(function () {
    final = $(this).val();
    calculateDue();
  });

  $("#amountrecievedupdt").change(function () {
    recieved = $(this).val();

    console.log("amount recived", recieved);
    if (recieved > final) {
      alert("Amount Recieved can't be greater than Expected Amount.");
      // $(this).val(0);
      // return
      location.reload(true);
    }

    let amountRecievedHidden = parseFloat(
      $("#amountrecievedupdatehiddenupdt").val(),
    );

    if (parseFloat(recieved) < parseFloat(amountRecievedHidden)) {
      alert(`Customer already paid ${amountRecievedHidden}`);
      location.reload(true);
    }

    calculateDue();
  });
});

// ################################################
// customer service entry section
// ####################################################

document.addEventListener("DOMContentLoaded", function () {
  $("#ddlproduct").change(function () {
    let selectedOption = $(this).find("option:selected");

    let product_id = selectedOption.data("id");
    let product = $(this).val();

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_brands_by_product/",
      type: "POST",
      data: {
        id: product_id,
      },
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log(response);

        $("#ddlbrand").empty();
        $("#ddlbrand").append(`<option value='0'>Brand *</option>`);

        response.forEach((elem) => {
          $("#ddlbrand").append(
            `<option data-id='${elem.id}' value='${elem.name}'>${elem.name}</option>`,
          );
        });
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#customerServiceEntryForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.querySelector("#txtName").value;
    const phone = document.querySelector(".phone-book").value;
    const city = document.querySelector("#ddlCity").value;
    const brand = document.querySelector("#ddlbrand").value;
    const issue = document.querySelector("#problemDescription").value;
    const email = document.querySelector("#txtEmail").value;
    const product = document.querySelector("#ddlproduct").value;

    if (!name) {
      $.toast({
        heading: "Error",
        text: "Please enter your Name",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    } else if (!phone) {
      $.toast({
        heading: "Error",
        text: "Please enter your Phone Number",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    } else if (!product) {
      $.toast({
        heading: "Error",
        text: "Please select a product",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    } else if (city === "0") {
      $.toast({
        heading: "Error",
        text: "Please select a City",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    } else if (brand === "0") {
      $.toast({
        heading: "Error",
        text: "Please select a Brand",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    } else if (issue === "0") {
      $.toast({
        heading: "Error",
        text: "Please select an Issue",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    } else {
      console.log(name, phone, city, brand, issue);
      var csrftoken = csrf_token;

      $.ajax({
        url: "/save_customer_service_booking/",
        type: "POST",
        data: {
          name: name,
          phone: phone,
          city: city,
          brand: brand,
          issue: issue,
          email: email,
          product: product,
        },
        contentType: "application/json",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        success: function (response) {
          console.log(response);

          $.toast({
            heading: "THANK YOU!",
            text: "Your query has been successfully submitted. Our executive will get back to you soon.",
            showHideTransition: "slide",
            icon: "success",
            textColor: "white",
            position: "top-center",
            hideAfter: 9000,
          });

          document.querySelector("#txtName").value = "";
          document.querySelector(".phone-book").value = "";

          document.querySelector("#txtEmail").value = "";
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
          $.toast({
            heading: "Error",
            text: "An error occured.",
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });
        },
      });
    }
  });
});

////// service setting section  /////////

document.addEventListener("DOMContentLoaded", function () {
  $(".productinmodal").change(function () {
    console.log($(this).val());
    let product_id = $(this).val();

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_brands_by_product/",
      type: "POST",
      data: {
        id: product_id,
      },
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log(response);
        var selectize = $(".brandinmodal")[0].selectize;

        selectize.clearOptions();
        selectize.clear();
        // Loop through your brands and add them to the selectize control
        response.forEach(function (brand) {
          selectize.addOption({ value: brand.id, text: brand.name });
          // If you want to select an option as well, use:
          // selectize.addItem(brand.id);
        });

        // Refresh the selectize dropdown to show the new options
        selectize.refreshOptions(false);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });

  $(".productinservicecharge").change(function () {
    console.log($(this).val());
    let product_id = $(this).val();

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_brands_by_product/",
      type: "POST",
      data: {
        id: product_id,
      },
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log(response);
        var selectize = $(".brandinservicecharge")[0].selectize;

        selectize.clearOptions();
        selectize.clear();
        // Loop through your brands and add them to the selectize control
        response.forEach(function (brand) {
          selectize.addOption({ value: brand.id, text: brand.name });
          // If you want to select an option as well, use:
          // selectize.addItem(brand.id);
        });

        // Refresh the selectize dropdown to show the new options
        selectize.refreshOptions(false);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });
});

// Customer booking section

$(document).ready(function () {
  // Add cursor pointer on hover
  $(".book-repair-btn").hover(
    function () {
      $(this).css("cursor", "pointer");
    },
    function () {
      $(this).css("cursor", "auto");
    },
  );

  // Scroll to the target div on click
  $(".book-repair-btn").click(function () {
    $("html, body").animate(
      {
        scrollTop: $("#book-a-repair").offset().top,
      },
      "slow",
    );
  });
});

// # individual sales report

$(document).ready(function () {
  $(".branchindividualsales").change(function () {
    const branchid = $(this).val();

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_salespersons_branch/",
      type: "POST",
      data: { branchid: branchid },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!", response);

        if (response.Response == "error") {
          console.log("something went wrong 1");
          $.toast({
            heading: "Error",
            text: "Something went wrong!",
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });
        } else {
          // Assuming you have initialized Selectize.js on the #expensetype element
          var $usermodalSelect = $(".userindividualsales")[0].selectize;

          // Clear existing options
          $usermodalSelect.clearOptions();

          // Add new options
          $.each(response.Response, function (index, element) {
            $usermodalSelect.addOption({
              value: element.id,
              text: element.name,
            });
          });

          // Refresh Selectize.js to update the UI
          $usermodalSelect.refreshItems();

          // Set the selected option to the default (if needed)
          $usermodalSelect.setValue("", false);

          // Trigger the change event to update Selectize.js
          $usermodalSelect.trigger("change");
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        // Handle the error case

        $.toast({
          heading: "Error",
          text: "Something went wrong!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      },
    });
  });
});

// # product form section

$("#addcatform").on("submit", function (e) {
  e.preventDefault();

  const catname = $(".catname").val();

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addcatagorymodalajax/",
    type: "POST",
    data: { catagory: catname },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        console.log("something went wrong (adding catagory)");
        $.toast({
          heading: "Error",
          text: "Catagory already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".registrationcategory")[0].selectize;
        let newOption = {
          value: response.Response.catagory,
          text: response.Response.catagory,
        };
        $usermodalSelect.addOption(newOption);
        $usermodalSelect.setValue(newOption.value, false);
        $usermodalSelect.trigger("change");

        let $usermodalSelectSub = $(".registrationcatinsubcat")[0].selectize;
        let newOption2 = {
          value: response.Response.id,
          text: response.Response.catagory,
        };
        $usermodalSelectSub.addOption(newOption2);
        $usermodalSelectSub.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addcat").css("display", "none");
});

$("#addsubcatform").on("submit", function (e) {
  e.preventDefault();

  // console.log("submit cat")

  const subcatname = $(".subcatname").val();
  const catid = $(".catid").val();

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addsubcatagorymodalajax/",
    type: "POST",
    data: { subCatagory: subcatname, catId: catid },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        // console.log("something went wrong (adding catagory)");
        $.toast({
          heading: "Error",
          text: "SubCatagory already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".registrationsubcategory")[0].selectize;

        let newOption = {
          value: response.Response.SubCatagory,
          text: response.Response.SubCatagory,
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addsubcat").css("display", "none");
});

$("#addbrandform").on("submit", function (e) {
  e.preventDefault();

  const brandName = $(".brandname").val();

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addbrandmodalajax/",
    type: "POST",
    data: { brandName: brandName },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        console.log("something went wrong (adding catagory)");
        $.toast({
          heading: "Error",
          text: "Brand already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".registrationbrand")[0].selectize;

        let newOption = {
          value: response.Response.Brand,
          text: response.Response.Brand,
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addbr").css("display", "none");
});

$("#addtypeform").on("submit", function (e) {
  e.preventDefault();

  // console.log("submit cat")

  const typeName = $(".typename").val();

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addtypemodalajax/",
    type: "POST",
    data: { typeName: typeName },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        console.log("something went wrong (adding catagory)");
        $.toast({
          heading: "Error",
          text: "Type already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".registrationtype")[0].selectize;

        let newOption = {
          value: response.Response.Type,
          text: response.Response.Type,
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addtype").css("display", "none");
});

$("#addpackingform").on("submit", function (e) {
  e.preventDefault();

  // console.log("submit cat")

  const packingName = $(".packingname").val();

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addpackingmodalajax/",
    type: "POST",
    data: { packingName: packingName },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        $.toast({
          heading: "Error",
          text: "Packing already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".registrationpacking")[0].selectize;

        let newOption = {
          value: response.Response.Packing,
          text: response.Response.Packing,
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addpacking").css("display", "none");
});

$("#addpurchasetaxform").on("submit", function (e) {
  e.preventDefault();

  // console.log("submit cat")

  const taxName = $(".purchasetaxname").val();
  const taxNumber = $(".purchasetaxnumber").val();

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addpurchasetaxmodalajax/",
    type: "POST",
    data: { taxName: taxName, taxNumber: taxNumber },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        $.toast({
          heading: "Error",
          text: "Tax already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".registrationpurchasetax")[0].selectize;

        let newOption = {
          value: response.Response.Id,
          text: response.Response.Tax,
          data: { purchasegst: response.Response.Percentage },
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");

        let $usermodalSelect2 = $(".registrationsaletax")[0].selectize;
        $usermodalSelect2.addOption(newOption);

        // $usermodalSelect2.setValue(newOption.value, false);

        $usermodalSelect2.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addpurchasetax").css("display", "none");
});

$("#addsaletaxform").on("submit", function (e) {
  e.preventDefault();

  // console.log("submit cat")

  const taxName = $(".saletaxname").val();
  const taxNumber = $(".saletaxnumber").val();

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addsaletaxmodalajax/",
    type: "POST",
    data: { taxName: taxName, taxNumber: taxNumber },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        $.toast({
          heading: "Error",
          text: "Tax already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".registrationsaletax")[0].selectize;

        let newOption = {
          value: response.Response.Id,
          text: response.Response.Tax,
          data: { purchasegst: response.Response.Percentage },
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");

        let $usermodalSelect2 = $(".registrationpurchasetax")[0].selectize;
        $usermodalSelect2.addOption(newOption);

        // $usermodalSelect2.setValue(newOption.value, false);

        $usermodalSelect2.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addsaletax").css("display", "none");
});

// branch stock filter

// SG-23
$(document).ready(function () {
  $(".stockcategoryfilter").change(function () {
    var category = $(this).val();

    console.log(category);

    var csrftoken = csrf_token;

    $.ajax({
      url: "/get_subcategory_by_category_id/",
      type: "POST",
      data: { category: category },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log("Data sent successfully!");
        console.log("response..", response);

        // Assuming you have initialized Selectize.js on the #expensetype element
        var $expensetypeSelect = $(".stocksubcategoryfilter")[0].selectize;

        // Clear existing options
        $expensetypeSelect.clearOptions();

        // Add new options
        $.each(response.subcategory, function (index, element) {
          $expensetypeSelect.addOption({
            value: element.id,
            text: element.name,
          });
        });

        // Refresh Selectize.js to update the UI
        $expensetypeSelect.refreshItems();

        // Set the selected option to the default (if needed)
        $expensetypeSelect.setValue("", false);

        // Trigger the change event to update Selectize.js
        $expensetypeSelect.trigger("change");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        $(".stocksubcategoryfilter").empty();
        $(".stocksubcategoryfilter").prepend(
          "<option value='' selected >Select Sub Category</option>",
        );
      },
    });
  });
});

// customer entry in sales
// SG-29
$(".customerentryinsalesform").on("submit", function (e) {
  e.preventDefault();

  // console.log("submit cat")

  const firstName = $(".customerfirstname").val();
  const lastName = $(".customerlastname").val();
  const phoneNumber = $(".customerphone").val();
  const vatnumber = $(".vatnumbersale").val();
  const customerTypeSale = $(".customertypesale").val();
  const customerAddress = $(".customeraddress").val();

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addcustomerfromsales/",
    type: "POST",
    data: {
      firstname: firstName,
      lastname: lastName,
      phone: phoneNumber,
      address: customerAddress,
      vatnumber: vatnumber,
      customertype: customerTypeSale,
    },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        $.toast({
          heading: "Error",
          text: "Something went wrong!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else if (response.Response == "exist_error") {
        $.toast({
          heading: "Error",
          text: "Phone Number already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".customerdropdownsales")[0].selectize;

        let newOption = {
          value: response.Response.id,
          text: `${response.Response.firstname} ${response.Response.lastname} - ${response.Response.phone}`,
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#customermodal").css("display", "none");
});

// customer entry in sales for WAREHOUSE
//SG-47

$("#customerentryinsalesformwarehouse").on("submit", function (e) {
  e.preventDefault();

  // console.log("submit cat")

  const name = $(".whcustomername").val();
  const phone = $(".whcustphone").val();
  const branchType = $(".whcusttype").val();
  const branchCategory = $(".whcustcatagoty").val();
  const branchGstin = $(".whcustgstin").val();
  const branchAddress = $(".whcustaddress").val();

  // alert(name,phone,branchType,branchCategory,branchGstin,branchAddress)

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addexternalfranchisefromsales/",
    type: "POST",
    data: {
      name: name,
      phone: phone,
      branchType: branchType,
      branchCategory: branchCategory,
      branchGstin: branchGstin,
      branchAddress: branchAddress,
    },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        $.toast({
          heading: "Error",
          text: "Something went wrong!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else if (response.Response == "exist_error") {
        $.toast({
          heading: "Error",
          text: "Customer already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else {
        let $usermodalSelect = $(".customerdropdownsaleswarehouse")[0]
          .selectize;

        let newOption = {
          value: response.Response.id,
          text: `${response.Response.name} - ${response.Response.branchType}`,
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addcustomermodal").css("display", "none");
});

// supplier entry in purchase fom
//SG-47

$("#addsupplierfrompurchase").on("submit", function (e) {
  e.preventDefault();

  // console.log("submit cat")

  const name = $(".pursupplername").val();
  const phone = $(".pursupplerphone").val();
  const gstin = $(".pursupplergstin").val();
  const address = $(".pursuppleraddress").val();

  // alert(name,phone,branchType,branchCategory,branchGstin,branchAddress)

  var csrftoken = csrf_token;

  $.ajax({
    url: "/addsupplierfrompurchase/",
    type: "POST",
    data: { name: name, phone: phone, gstin: gstin, address: address },
    contentType: "application/json",

    headers: {
      "X-CSRFToken": csrftoken,
    },
    success: function (response) {
      console.log("Data sent successfully!", response);

      if (response.Response == "error") {
        $.toast({
          heading: "Error",
          text: "Something went wrong!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else if (response.Response == "exist_error") {
        $.toast({
          heading: "Error",
          text: "Supplier already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      } else if (response.Response == "exist_error_gst") {
        $.toast({
          heading: "Error",
          text: "Supplier with same VAT number already exists!",
          icon: "error",
          bgColor: "red",
          textColor: "white",
          position: "top-center",
          hideAfter: 4000,
        });
      }
      else {
        let $usermodalSelect = $(".selectsupplierfrompurchase")[0].selectize;

        let newOption = {
          value: response.Response.name,
          text: response.Response.name,
        };
        $usermodalSelect.addOption(newOption);

        $usermodalSelect.setValue(newOption.value, false);

        $usermodalSelect.trigger("change");
      }
    },
    error: function (xhr, textStatus, errorThrown) {
      console.error("Error sending data:", errorThrown);

      $.toast({
        heading: "Error",
        text: "Something went wrong!",
        icon: "error",
        bgColor: "red",
        textColor: "white",
        position: "top-center",
        hideAfter: 4000,
      });
    },
  });
  $("#addpurchasemodal").css("display", "none");
});

// ################ stock transfter section | stock recieving #########

$(document).ready(function () {
  $(".close-stock-modal").click(function () {
    $("#stockmodal").modal("hide");
  });

  $(".stock-transfer-receive-list").on(
    "click",
    ".stock-recieved-btn",
    function (e) {
      e.preventDefault();
      $("#stockmodal").modal("show");

      let productId = $(this).data("id");
      console.log("Product ID:", productId);
      let transferId = $(this).data("transferid");
      console.log("transferId:", transferId);
      let csrftoken = csrf_token;

      $.ajax({
        url: "/get_product_details_by_id/",
        type: "POST",
        data: { productid: productId, transferid: transferId },
        contentType: "application/json",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        success: function (response) {
          $(".stocktransfername").val(response.name);
          $(".stocktransfercatagory").val(response.catagory);
          $(".stocktransfersubcatagory").val(response.subcatagory);
          $(".stocktransferbrand").val(response.brand);
          $(".stocktransfertype").val(response.type);
          $(".stocktransferpacking").val(response.packing);
          $(".stocktransferhsn").val(response.hsn);
          $(".stocktransferprice").val(response.unitprice);
          $(".stocktransferpurchasegst").val(response.purchasegst);
          $(".stocktransfersellingprice").val(response.sellingprice);
          $(".stocktransfersalesgst").val(response.salegst);
          $(".stocktransfermrp").val(response.mrp);
          $(".stocktransfermop").val(response.mop);
          $(".stocktransferid").val(response.transferid);
        },
        error: function (xhr, textStatus, errorThrown) {
          console.error("Error sending data:", errorThrown);
        },
      });
    },
  );
});

$(document).ready(function () {
  $(".add-stock-stocktransfer").slideUp(300);
  $("#existingproduct").on("change", function () {
    var isChecked = $(this).is(":checked");

    if (isChecked) {
      $(".add-product-stocktransfer").slideUp(300);
      $(".add-stock-stocktransfer").slideDown(300);
    } else {
      $(".add-stock-stocktransfer").slideUp(300);
      $(".add-product-stocktransfer").slideDown(300);
    }
  });
});

// Stock Adjustment section

$(document).ready(function () {
  $("#stockadjustmentbranch").change(function () {
    branchId = $(this).val();

    let csrftoken = csrf_token;

    $.ajax({
      url: "/get_product_list_by_branchid/",
      type: "POST",
      data: {
        branchid: branchId,
      },
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        let $usermodalSelect = $("#stockadjustmentproduct")[0].selectize;
        $usermodalSelect.clearOptions();
        $.each(response.Response, function (index, value) {
          let newOption = {
            value: value.id,
            text: value.product,
          };
          $usermodalSelect.addOption(newOption);
        });
        $usermodalSelect.refreshItems();
        $usermodalSelect.setValue("", false);
        $usermodalSelect.trigger("change");
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });

  $("#stockadjustmentproduct").change(function () {
    let productId = $(this).val();

    let branchId = $("#stockadjustmentbranch").val();

    if (!productId) return;

    let csrftoken = csrf_token;

    $.ajax({
      url: "/get_product_stock_details/",
      type: "POST",
      data: {
        branchid: branchId,
        productid: productId,
      },
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log(
          "avail qty",
          response.available_qty,
          typeof response.available_qty,
        );

        $(".availableqtystockadj").val(response.available_qty);
        $(".branchstockadj").val(response.branchid);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  });
});

// ##### this function fetch service booking count and show in dashboard #######

$(document).ready(function () {
  function fetchBookingCount() {
    var csrftoken = csrf_token;
    $.ajax({
      url: "/get_service_booking_count/",
      type: "POST",
      data: {},
      contentType: "application/json",
      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        let resp = response.Response;
        if (response.Response > 999) {
          resp = "999+";
        }
        $(".booking-count-dashboard").text(resp);
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
      },
    });
  }

  fetchBookingCount();

  setInterval(() => {
    fetchBookingCount();
  }, 60000);
});

// ###### This code is to activate and inactivate whatsapp integration from company settings

$(document).ready(function () {
  $(".switch-whatsapp-check").change(function () {
    let togleStatus;
    if ($(this).is(":checked")) {
      togleStatus = true;
    } else {
      togleStatus = false;
    }

    let csrftoken = csrf_token;

    $.ajax({
      url: "/update_whatsapp_status/",
      type: "POST",
      data: { status: togleStatus },
      contentType: "application/json",

      headers: {
        "X-CSRFToken": csrftoken,
      },
      success: function (response) {
        console.log(response.Response);
        // Handle the response from the Django backend
        if (response.status == 400) {
          $.toast({
            heading: "Error",
            text: "Invalid Input!",
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });
        } else if (response.status == 500) {
          $.toast({
            heading: "Error",
            text: "Something went wrong!",
            icon: "error",
            bgColor: "red",
            textColor: "white",
            position: "top-center",
            hideAfter: 4000,
          });
        } else {
        }
      },
      error: function (xhr, textStatus, errorThrown) {
        console.error("Error sending data:", errorThrown);
        // Handle the error case
      },
    });
  });
});



