// Prevent scroll

function preventScroll(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

function disableScroll() {
  document.documentElement.addEventListener("wheel", preventScroll, {
    passive: false,
  });
  document.documentElement.addEventListener("touchmove", preventScroll, {
    passive: false,
  });
  document.documentElement.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  });
}

function enableScroll() {
  document.documentElement.removeEventListener("wheel", preventScroll, {
    passive: false,
  });
  document.documentElement.removeEventListener("touchmove", preventScroll, {
    passive: false,
  });
  document.documentElement.removeEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  });
}

// Logout dropdown
document.addEventListener("DOMContentLoaded", function () {
  const profileBtn = document.querySelector(".profile-btn");
  const dropdownContainer = document.querySelector(".dropdown-container");
  profileBtn.addEventListener("click", function (e) {
    e.preventDefault();
    dropdownContainer.classList.toggle("hide-logout");
  });
});

// Notification dropdown
document.addEventListener("DOMContentLoaded", function () {
  const profileBtn = document.querySelector(".notif-btn");
  const dropdownContainer = document.querySelector(
    ".dropdown-container-notification"
  );
  profileBtn.addEventListener("click", function (e) {
    e.preventDefault();
    dropdownContainer.classList.toggle("hide");
  });
});

// body transparent when sign up form open
document.addEventListener("DOMContentLoaded", function () {
  const createAccountBtn = document.querySelector(".create-account-btn");
  const bodyWrapper = document.querySelector(".body-wrapper");

  const closeRegistrationBtn = document.querySelector(
    ".close-registration-form"
  );
  createAccountBtn.addEventListener("click", function (e) {
    bodyWrapper.style.display = "block";
  });

  closeRegistrationBtn.addEventListener("click", function () {
    bodyWrapper.style.display = "none";
  });
});

// body transparent for post upload form
document.addEventListener("DOMContentLoaded", function () {
  const fileUploadBtn = document.querySelector("#whats-on-mind");
  const page = fileUploadBtn.dataset.page;

  const bodyWrapper = document.querySelector(".body-wrapper-two");
  const postUploadContainer = document.querySelector(".post-upload-container");

  const closeFileUploadBtn = document.querySelector(".close-post-upload");
  fileUploadBtn.addEventListener("click", function (e) {
    var scrollY = window.scrollY || window.pageYOffset;
    var scrollX = window.scrollX || window.pageXOffset;
    // bodyWrapper.style.top = scrollY - 20 + "px";

    let bodyHeight = document.body.scrollHeight;
    console.log("Body height:", bodyHeight);
    bodyWrapper.style.height = bodyHeight + "px";
    bodyWrapper.style.left = scrollX + "px";
    bodyWrapper.style.display = "block";
    bodyWrapper.style.zIndex = "10000";

    if (page == "profile") {
      // document.body.style.overflow = 'hidden';
      postUploadContainer.style.top = scrollY + 350 + "px";
    } else {
      // document.body.style.overflow = 'hidden';
      postUploadContainer.style.top = scrollY + 250 + "px";
    }

    // disableScroll();
  });

  closeFileUploadBtn.addEventListener("click", function () {
    bodyWrapper.style.display = "none";

    // enableScroll();
  });
});

// video/image/feeling upload form pop up
document.addEventListener("DOMContentLoaded", function () {
  const videoUploadPopBtn = document.querySelectorAll(".video-upload-pop");
  let page;
  try {
    const videobtn = document.querySelector(".video-upload-pop-profile");
    videobtn.addEventListener("click", function () {
      page = videobtn.dataset.page;
    });
  } catch {
    page = null;
  }

  const imageUploadPopBtn = document.querySelectorAll(".image-upload-pop");
  let page2;
  try {
    const imgbtn = document.querySelector(".image-upload-pop-profile");
    imgbtn.addEventListener("click", function () {
      page2 = imgbtn.dataset.page;
    });
  } catch {
    page2 = null;
  }
  console.log("page-", page, page2);
  const feelingUploadPopBtn = document.querySelector(".feeling-upload-pop");
  const bodyWrapper = document.querySelector(".body-wrapper-two");
  const fileInputImage = document.querySelector(".file-upload-inp-image");
  const fileInputVideo = document.querySelector(".file-upload-inp-video");
  const postUploadContainer = document.querySelector(".post-upload-container");
  videoUploadPopBtn.forEach((elem) => {
    elem.addEventListener("click", function (e) {
      console.log("clicked");

      var scrollY = window.scrollY || window.pageYOffset;
      var scrollX = window.scrollX || window.pageXOffset;

      let bodyHeight = document.body.scrollHeight;
      console.log("Body height:", bodyHeight);
      bodyWrapper.style.height = bodyHeight + "px";
      bodyWrapper.style.left = scrollX + "px";
      bodyWrapper.style.display = "block";
      bodyWrapper.style.zIndex = "10000";

      if ((page == "profile") | (page2 == "profile")) {
        postUploadContainer.style.top = scrollY + 385 + "px";
      } else {
        postUploadContainer.style.top = scrollY + 250 + "px";
      }

      // disableScroll();

      if (fileInputImage.classList.contains("file-upload-inp-show")) {
        fileInputImage.classList.remove("file-upload-inp-show");
      }
      fileInputVideo.classList.toggle("file-upload-inp-show");
    });
  });

  imageUploadPopBtn.forEach((elem) => {
    elem.addEventListener("click", function (e) {
      var scrollY = window.scrollY || window.pageYOffset;
      var scrollX = window.scrollX || window.pageXOffset;
      // bodyWrapper.style.top = scrollY - 20 + "px";

      let bodyHeight = document.body.scrollHeight;
      console.log("Body height:", bodyHeight);
      bodyWrapper.style.height = bodyHeight + "px";
      bodyWrapper.style.left = scrollX + "px";
      bodyWrapper.style.display = "block";
      bodyWrapper.style.zIndex = "10000";

      if ((page == "profile") | (page2 == "profile")) {
        postUploadContainer.style.top = scrollY + 385 + "px";
      } else {
        postUploadContainer.style.top = scrollY + 250 + "px";
      }

      // disableScroll();

      if (fileInputVideo.classList.contains("file-upload-inp-show")) {
        fileInputVideo.classList.remove("file-upload-inp-show");
      }
      fileInputImage.classList.toggle("file-upload-inp-show");
    });
  });
});

// opening file upload input on clicking image or video in post upload pop up
document.addEventListener("DOMContentLoaded", function () {
  const imageBtn = document.querySelector(".upload-icon-image");
  const videoBtn = document.querySelector(".upload-icon-video");
  const fileInputImage = document.querySelector(".file-upload-inp-image");
  const fileInputVideo = document.querySelector(".file-upload-inp-video");
  imageBtn.addEventListener("click", function () {
    if (fileInputVideo.classList.contains("file-upload-inp-show")) {
      fileInputVideo.classList.remove("file-upload-inp-show");
    }
    fileInputImage.classList.toggle("file-upload-inp-show");
  });
  videoBtn.addEventListener("click", function () {
    if (fileInputImage.classList.contains("file-upload-inp-show")) {
      fileInputImage.classList.remove("file-upload-inp-show");
    }
    fileInputVideo.classList.toggle("file-upload-inp-show");
  });
});

// deleting post from UI
document.addEventListener("DOMContentLoaded", function () {
  const postContainer = document.querySelectorAll(".middle-content-two-child");

  postContainer.forEach((elem) => {
    elem.addEventListener("click", function (e) {
      if (e.target.classList.contains("post-close-btn")) {
        // Apply fade out transition
        e.currentTarget.style.transition = "display 2s";
        e.currentTarget.style.display = "none";
      }
    });
  });
});

// Liking and Disliking a post

document.addEventListener("DOMContentLoaded", function () {
  const likeBtn = document.querySelectorAll(".post-like-btn");

  likeBtn.forEach((element) => {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      const elemTarget = e.target;
      const elem = e.currentTarget;
      if (elem.classList.contains("not-liked")) {
        const postId = elem.dataset.postId;
        const userId = elem.dataset.userId;
        console.log("post-id", postId, "userid", userId);

        const requestData = {
          post_id: postId,
          user_id: userId,
        };
        const csrftoken = csrf_token;

        fetch("/social/like-post/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);
            if (data.Response == "Success") {
              let likeIcon = elem.firstElementChild;
              let likeText = elem.lastElementChild;
              likeIcon.style.color = "blue";
              likeText.textContent = "Like";
              likeText.style.color = "blue";

              let likesCountElement = elem
                .closest(".middle-content-two-child")
                .querySelector(".likes-count").firstElementChild;
              console.log("likesCountElem-", likesCountElement);
              let likeCount = likesCountElement.textContent;
              elem
                .closest(".middle-content-two-child")
                .querySelector(".likes-count").firstElementChild.textContent =
                parseInt(likeCount) + 1;

              elem.classList.remove("not-liked");
              elem.classList.add("post-liked");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (elem.classList.contains("post-liked")) {
        const postId = elem.dataset.postId;
        const userId = elem.dataset.userId;
        console.log("post-id", postId, "userid", userId);

        const requestData = {
          post_id: postId,
          user_id: userId,
        };
        const csrftoken = csrf_token;

        fetch("/social/dislike-post/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);
            if (data.Response == "Success") {
              let likeIcon = elem.firstElementChild;
              let likeText = elem.lastElementChild;
              likeIcon.style.color = "inherit";
              likeText.style.color = "inherit";

              let likesCountElement = elem
                .closest(".middle-content-two-child")
                .querySelector(".likes-count").firstElementChild;
              console.log("likesCountElem-", likesCountElement);
              let likeCount = likesCountElement.textContent;
              elem
                .closest(".middle-content-two-child")
                .querySelector(".likes-count").firstElementChild.textContent =
                parseInt(likeCount) - 1;

              elem.classList.add("not-liked");
              elem.classList.remove("post-liked");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
});

// # about section

document.addEventListener("DOMContentLoaded", function () {
  const firstElem = document.querySelector(".about-link-1");
  firstElem.style.backgroundColor = "#ebf5ff";
  firstElem.style.color = "#2375fb";

  const aboutLink = document.querySelector(".about-links");

  aboutLink.addEventListener("click", function (e) {
    e.preventDefault();
    const aboutUl = document.querySelector(".about-ul");
    const listLi = aboutUl.querySelectorAll("li");
    listLi.forEach(function (elem) {
      if (elem == e.target) {
        for (let i = 1; i <= 6; i++) {
          if (elem.classList.contains(`about-link-${i}`)) {
            const detail = document.querySelector(`.about-details-link-${i}`);
            detail.classList.remove("about-display-none");
            detail.classList.add("about-display-block");

            const clickedElem = document.querySelector(`.about-link-${i}`);
            clickedElem.style.backgroundColor = "#ebf5ff";
            clickedElem.style.color = "#2375fb";
          } else {
            const detail = document.querySelector(`.about-details-link-${i}`);
            detail.classList.remove("about-display-block");
            detail.classList.add("about-display-none");
            const clickedElem = document.querySelector(`.about-link-${i}`);
            clickedElem.style.backgroundColor = "#fff";
            clickedElem.style.color = "#444";
          }
        }
      }
    });
  });
});

// Dynamically populate the year select options
document.addEventListener("DOMContentLoaded", function () {
  const yearSelect = document.getElementById("yearSelect");
  const currentYear = new Date().getFullYear();
  const startYear = 1900;

  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  // Dynamically populate the month select options
  const monthSelect = document.getElementById("monthSelect");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index + 1;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  // Dynamically populate the day select options
  const daySelect = document.getElementById("daySelect");
  for (let day = 1; day <= 31; day++) {
    const option = document.createElement("option");
    option.value = day;
    option.textContent = day;
    daySelect.appendChild(option);
  }
});

// video/image/feeling upload form pop up
document.addEventListener("DOMContentLoaded", function () {
  const bodyWrapper = document.querySelector(".body-wrapper-two-edit-profile");
  const editBtn = document.querySelector(".edit-profile-btn");
  const closeBtn = document.querySelector(".close-post-upload-edit");
  const postUploadContainer = document.querySelector(
    ".post-upload-container-edit-profile"
  );
  editBtn.addEventListener("click", function (e) {
    var scrollY = window.scrollY || window.pageYOffset;
    var scrollX = window.scrollX || window.pageXOffset;
    // bodyWrapper.style.top = scrollY - 20 + "px";

    let bodyHeight = document.body.scrollHeight;

    bodyWrapper.style.height = bodyHeight + "px";
    bodyWrapper.style.left = scrollX + "px";
    bodyWrapper.style.display = "block";
    bodyWrapper.style.zIndex = "10000";

    postUploadContainer.style.top = scrollY + 700 + "px";

    // disableScroll();
  });
  closeBtn.addEventListener("click", function (e) {
    // Set the position of the pop-up

    bodyWrapper.style.display = "none";

    // enableScroll();
  });
});

// opening and closing of save post button

// Saving and Unsaving a post

document.addEventListener("DOMContentLoaded", function () {
  const saveBtn = document.querySelectorAll(".save-post-btn");

  saveBtn.forEach((element) => {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      const elemTarget = e.target;
      const elem = e.currentTarget;
      if (elem.classList.contains("not-saved")) {
        const postId = elem.dataset.postId;
        const userId = elem.dataset.userId;
        console.log("post-id", postId, "userid", userId);

        const requestData = {
          post_id: postId,
          user_id: userId,
        };
        const csrftoken = csrf_token;

        fetch("/social/save-post/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);
            if (data.Response == "Success") {
              let saveIcon = elem.firstElementChild;
              let saveText = elem.lastElementChild;
              saveIcon.style.color = "blue";
              saveText.textContent = "Save";
              saveText.style.color = "blue";

              elem.classList.remove("not-saved");
              elem.classList.add("post-saved");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (elem.classList.contains("post-saved")) {
        const postId = elem.dataset.postId;
        const userId = elem.dataset.userId;
        console.log("post-id", postId, "userid", userId);

        const requestData = {
          post_id: postId,
          user_id: userId,
        };
        const csrftoken = csrf_token;

        fetch("/social/unsave-post/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);
            if (data.Response == "Success") {
              let saveIcon = elem.firstElementChild;
              let saveText = elem.lastElementChild;
              saveIcon.style.color = "inherit";
              saveText.style.color = "inherit";

              elem.classList.add("not-saved");
              elem.classList.remove("post-saved");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
});

const formatDate = function (data) {
  const timestamp = data;
  const date = new Date(timestamp);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  try {
    return date.toLocaleString("en-US", options);
  } catch {
    return null;
  }
};

const getPost = function (postId) {
  const requestData = {
    post_id: postId,
  };
  const csrftoken = csrf_token;
  fetch("/social/get-post/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      if (data.Response == "Success") {
        console.log("post data", data.Details);
        let postDetails = data.Details;
        let currentUserId = postDetails["current_user"]["id"];
        let currentUserName = postDetails["current_user"]["name"];
        let currentUserImage = postDetails["current_user"]["image"];
        let postUserId = postDetails["posted_user"]["id"];
        let postUserName = postDetails["posted_user"]["name"];
        let postUserImage = postDetails["posted_user"]["image"];
        let postDate = postDetails["post_details"]["post_date"];
        let postId = postDetails["post_details"]["id"];
        let postType = postDetails["post_details"]["post_type"];
        let postImage = postDetails["post_details"]["post_image"];
        let postText = postDetails["post_details"]["post_text"];
        let postVideo = postDetails["post_details"]["post_video"];
        let postLikeCount = postDetails["post_details"]["post_likes_count"];
        let postCommentCount = postDetails["post_details"]["comment_count"];
        document.querySelector(".profile-pic-round-small").src =
          currentUserImage;

        postDate = formatDate(postDate);
        const commentAll = postDetails["post_details"]["comments"];
        let postData = null;
        if (postType === "Image") {
          postData = `


          <div
            class="post-image-container"
            id="image-container"
          >
            <img class="post-image" src="${postImage}" alt="" />
          </div>
        
         `;
        } else if (postType === "Video") {
          postData = `
      
        
          <div class="post-video-container post-video">
          
            <video
            width="100%"
              class="player"
              playsinline
              controls
              data-poster="/path/to/poster.jpg"
            >
              <source src="${postVideo}" type="video/mp4" />
      
              <track
                kind="captions"
                label="English captions"
                src="/path/to/captions.vtt"
                srclang="en"
                default
              />
            </video>
          </div>
        `;
        } else {
          postData = "";
        }

        let comments = "";

        if (commentAll) {
          commentAll.forEach((elem) => {
            let commentdata = `
            <div class="comments d-flex gap-2 mb-2">
    
            <div class=comment-user-img>
            <a class="text-decoration-none" href='/social/profile/${elem.user_id}/'>
    <img class="post-image" src="${elem.user_picture}" alt="" />
    </a>
            </div>
            <div >
            <div>
            <a class="text-decoration-none text-secondary" href='/social/profile/${elem.user_id}/'>
            <p class='m-0 p-0 pb-1 fw-bold'>${elem.user_name}</p>
            </a>
            </div>
            <div class='comment-section-text p-2 rounded'>
            ${elem.comment_text}
            </div>

            <div class="d-flex gap-2 align-items-center" >
            <p class='m-0 comment-date-text' >${formatDate(
              elem.commented_date
            )}</p>

            <a  href="#" class=' text-decoration-none ${elem.verified == true ? 'text-success' : 'text-blue'}'  > <i class="fa-solid fa-thumbs-up  ${elem.verified == true ? 'text-success' : 'text-blue'} verifycomment cursor-pointer"  data-postid=${postId} data-commentid=${elem.comment_id}></i> ${elem.verified == true ? "<span class='p-0 m-0 text-decoration-none'  >Verified</span>" : ''} </a>
            </div>
            </div>
            
            </div>`;

            comments += commentdata;
          });
        }

        htmlContent = `
        <div class="rounded bg-white p-0">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <div class="d-flex gap-2">
                  <div>
                    <a href="">
                      <img
                        class="nav-link-custom border profile-pic-round prof-pic rounded-circle d-flex align-items-center justify-content-center"
                        src="${postUserImage}"
                        alt="profie image"
                      />
                    </a>
                  </div>
                  <div class="d-flex align-items-center justify-content-center">
                    <div>
                      <p class="m-0 mb-1 fw-bold" style="color: #444">${postUserName}</p>
                      <p class="m-0 time">${postDate}</p>
                    </div>
                  </div>
                </div>

                <div class="d-flex gap-3">
                  <div class="save-post-container">
                    <i class="fa-solid fa-ellipsis fs-4 post-three-dot"></i>
                    <div
                      class="save-container shadow rounded ps-1 pe-2 pt-2 pb-2 save-container-display-none"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="post-description">
                <p class="post-description-font">
                  ${postText}
                </p>
              </div>

              ${postData}

              <div class="px-2 pt-3">
                <div
                  class="like-comment-container d-flex justify-content-between align-items-center"
                >
                  <div
                    class="like-count d-flex align-items-center gap-2 px-0 py-2 rounded"
                  >
                    <i class="fa-solid fa-thumbs-up text-blue"></i>
                    <p class="align-items-center likes-count m-0">
                      <span class="like-count-integer">${postLikeCount}</span>
                      Likes
                    </p>
                  </div>

                  <div
                    class="comment-count d-flex align-items-center gap-2 px-0 py-2 rounded"
                  >
                    <i class="fa-solid fa-comment"></i>
                    <p class="align-items-center m-0">${postCommentCount} Comments</p>
                  </div>
                </div>
              </div>
              <hr />
            </div>
            
`;

        const postDetailsContainer = document.querySelector(
          ".post-details-container"
        );
        const commentSection = document.querySelector(".comment-section");

        commentSection.insertAdjacentHTML("afterbegin", comments);

        postDetailsContainer.insertAdjacentHTML("afterbegin", htmlContent);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

document.addEventListener("DOMContentLoaded", function () {
  const commentBtn = document.querySelectorAll(".post-comment-btn");
  let page;

  const bodyWrapper = document.querySelector(".body-wrapper-comment");

  const postUploadContainer = document.querySelector(".post-comment-container");

  commentBtn.forEach((elem) => {
    elem.addEventListener("click", function (e) {
      
      try {
        page = elem.dataset.page;
        console.log("page-", page);
      } catch {
        page = null;
      }
      var scrollY = window.scrollY || window.pageYOffset;
      var scrollX = window.scrollX || window.pageXOffset;
      // bodyWrapper.style.top = scrollY - 20 + "px";

      let bodyHeight = document.body.scrollHeight;
      console.log("Body height:", bodyHeight);
      bodyWrapper.style.height = bodyHeight + "px";
      bodyWrapper.style.left = scrollX + "px";
      bodyWrapper.style.display = "block";
      bodyWrapper.style.zIndex = "10000";

      if (page == "profile") {
        postUploadContainer.style.top = scrollY + 350 + "px";
      } else if (page == "saved") {
        postUploadContainer.style.top = scrollY + 350 + "px";
      } else {
        postUploadContainer.style.top = scrollY + 250 + "px";
      }
      // disableScroll();

      const postId = elem.dataset.postId;
      document.querySelector("#getpostid").value = postId;
      getPost(postId);





// ################################### verify comment after liking ################################
     
console.log("verify comment", document.getElementsByClassName("verifycomment"));

const likeBtns = document.getElementsByClassName("verifycomment");
console.log("verify comment 2", likeBtns);


const commentWrapper = document.querySelector(".comment-section");
commentWrapper,addEventListener("click",function(e){
  
  if(e.target.classList.contains("verifycomment")){
    e.preventDefault()
    console.log(e.target)

    
    const post_Id = e.target.dataset.postid;
    const commentId = e.target.dataset.commentid;

    console.log("post id", post_Id, "comment id", commentId);


    
    fetch('/social/verifycomment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrf_token,  // Make sure csrf_token is defined
      },
      body: JSON.stringify({
        post_id: post_Id,
        comment_id: commentId
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      console.log("Success:", data);
      if (data.Response == "Success") {
        console.log(data.Details);
        let commentAll = data.Details;
        let comments = "";

        if (commentAll) {
          commentAll.forEach((elem) => {
            let commentdata = `
          <div class="comments d-flex gap-2 mb-2">
  
          <div class=comment-user-img>
          <a class="text-decoration-none" href='/social/profile/${elem.user_id}/'>
  <img class="post-image" src="${elem.user_picture}" alt="" />
  </a>
          </div>
          <div >
          <div>
          <a class="text-decoration-none text-secondary" href='/social/profile/${elem.user_id}/'>
          <p class='m-0 p-0 pb-1 fw-bold'>${elem.user_name}</p>
          </a>
          </div>
          <div class='comment-section-text p-2 rounded'>
          ${elem.comment_text}
          </div>
          <div class="d-flex gap-2 align-items-center" >
          <p class='m-0 comment-date-text' >${formatDate(
            elem.commented_date
          )}</p>

          <a  href="#" class=' text-decoration-none ${elem.verified == true ? 'text-success' : 'text-blue'}'  > <i class="fa-solid fa-thumbs-up  ${elem.verified == true ? 'text-success' : 'text-blue'} verifycomment cursor-pointer"  data-postid=${postId} data-commentid=${elem.comment_id}></i> ${elem.verified == true ? "<span class='p-0 m-0 text-decoration-none'  >Verified</span>" : ''} </a>
          </div>
          </div>
          
          </div>`;

            comments += commentdata;
          });
        }
        const commentSection = document.querySelector(".comment-section");
        commentSection.innerHTML = "";
        commentSection.insertAdjacentHTML("afterbegin", comments);
        document.querySelector("#replytext").value = "";
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
   


  }
  
})


 

     
      
// ################################### verify comment after liking ################################










    });
  });
  const close = document.querySelector(".close-post-comment");
  close.addEventListener("click", function () {
    bodyWrapper.style.display = "none";

    const postDetailsContainer = document.querySelector(
      ".post-details-container"
    );

    postDetailsContainer.innerHTML = "";

    const commentSection = document.querySelector(".comment-section");

    commentSection.innerHTML = "";
    // document.documentElement.style.overflowY = "scroll";
    enableScroll();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const replyBtn = document.querySelector(".givereply");
  replyBtn.addEventListener("click", function (e) {
    const postid = document.querySelector("#getpostid").value;
    const posttext = document.querySelector("#replytext").value;
    console.log("clicked");
    console.log(postid, posttext);

    const requestData = {
      post_id: postid,
      post_text: posttext,
    };
    const csrftoken = csrf_token;

    fetch("/social/add-comment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        if (data.Response == "Success") {
          console.log(data.Details);
          let commentAll = data.Details;
          let comments = "";

          if (commentAll) {
            commentAll.forEach((elem) => {
              let commentdata = `
            <div class="comments d-flex gap-2 mb-2">
    
            <div class=comment-user-img>
    
    <img class="post-image" src="${elem.user_picture}" alt="" />
    </a>
            </div>
            <div >
            <div>
            <a class="text-decoration-none text-secondary" href='/social/profile/${elem.user_id}/'>
            <p class='m-0 p-0 pb-1 fw-bold'>${elem.user_name}</p>
            </a>
            </div>
            <div class='comment-section-text p-2 rounded'>
            ${elem.comment_text}
            </div>
            <div class="d-flex gap-2 align-items-center" >
            <p class='m-0 comment-date-text' >${formatDate(
              elem.commented_date
            )}</p>

            <a  href="#" class=' text-decoration-none ${elem.verified == true ? 'text-success' : 'text-blue'}'  > <i class="fa-solid fa-thumbs-up  ${elem.verified == true ? 'text-success' : 'text-blue'} verifycomment cursor-pointer"  data-postid=${postid} data-commentid=${elem.comment_id}></i> ${elem.verified == true ? "<span class='p-0 m-0 text-decoration-none'  >Verified</span>" : ''} </a>
            </div>
            </div>
            
            </div>`;

              comments += commentdata;
            });
          }
          const commentSection = document.querySelector(".comment-section");
          commentSection.innerHTML = "";
          commentSection.insertAdjacentHTML("afterbegin", comments);
          document.querySelector("#replytext").value = "";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const threeDot = document.querySelectorAll(".post-three-dot");

  threeDot.forEach((elem) => {
    elem.addEventListener("click", function () {
      const parentContainer = elem.closest(".save-post-container"); // Get the common parent
      if (!parentContainer) return; // Early exit if not found

      const postViewBtn = parentContainer.querySelector(".post-view-btn"); // Find .post-view-btn within the parent
      if (!postViewBtn) return; // Early exit if .post-view-btn not found within parent

      postViewBtn.classList.toggle("hide");

      postViewBtn.addEventListener("mouseenter", function () {
        const postView = postViewBtn.querySelector(".postview");
        postView.style.color = "#fff";
      });

      postViewBtn.addEventListener("mouseleave", function () {
        const postView = postViewBtn.querySelector(".postview"); // Make sure to re-query the postView inside this function
        postView.style.color = "#444";
      });
    });
  });
});

// document.addEventListener("DOMContentLoaded", function () {
//   let roomName = roomname;
//   const chatSocket = new WebSocket(
//     "ws://" + window.location.host + "/ws/notification/" + roomName + "/"
//   );

//   chatSocket.onmessage = function (e) {
//     const data = JSON.parse(e.data);

//     if (data.type === "notification") {
//       const notificationCount = document.querySelector(".notif-count");
//       const count = parseInt(notificationCount.textContent) + 1;
//       document.querySelector(".notif-count").textContent = count;
//     }
//   };
// });

// get notifications

document.addEventListener("DOMContentLoaded", function () {
  const profileBtn = document.querySelector(".notif-btn");
  const dropdownContainer = document.querySelector(".notification-insert");
  profileBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const requestData = {};
    const csrftoken = csrf_token;

    fetch("/social/get-notifications/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        data = data.data;
        dropdownContainer.innerHTML = "";
        notifications = "";
        data.forEach((elem) => {
          let link;
          if (
            (elem.type == "like") |
            (elem.type == "comment") |
            (elem.type == "save")
          ) {
            link = `/social/postdetails/${elem.id}/`;
          } else if (elem.type == "message") {
            link = `/social/chatroom/${elem.id}/`;
            1;
          } else if (elem.type == "friendrequest") {
            link = "/social/friendrequest/";
          } else if (elem.type == "acceptrequest") {
            link = `/social/profile/${elem.id}/`;
          } else {
            link = "#";
          }
          console.log(link, "link");
          let li = `
          <li class="p-2 notification-li" data-id="${elem.notification_id}">
          <a href=${link} class='d-flex gap-2 notification-li' data-id="${elem.notification_id}">

          <img class="notification-prof-pic" src="${elem.user_image}" >
          ${elem.message}
          </a>
          </li>`;
          dropdownContainer.insertAdjacentHTML("afterbegin", li);
        });
        console.log(notifications);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  let insertNotifBtn = document.querySelector(".notification-insert");

  insertNotifBtn.addEventListener("click", function (event) {
    if (event.target.classList.contains("notification-li")) {
      event.preventDefault();

      let notificationId = event.target.dataset.id;

      console.log("notif id", notificationId);

      var csrftoken = csrf_token;

      const requestData = { id: notificationId };

      fetch("/social/update_notifications_seen/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      let href = event.target.href;

      window.location.href = href;
    }
  });
});




// document.addEventListener('DOMContentLoaded',function(){
//   showNotificationBtn = document.querySelector('.notif-nav-item')
//   notification=document.querySelector('.dropdown-container-notification')
//   document.addEventListener('click',function(e){
//     if (!notification.contains(e.target) && e.target !== showNotificationBtn) {
//       notification.style.display = 'none';
//     }
//   })
// })




// document.addEventListener("DOMContentLoaded", function() {

// });
