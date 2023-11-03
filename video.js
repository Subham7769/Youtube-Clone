let urlParams = new URLSearchParams(window.location.search);
let SearchVideoId = urlParams.get("q") ? urlParams.get("q") : "";
let searchKey = urlParams.get("searchKey") ? urlParams.get("searchKey") : "";

const API_KEY = "AIzaSyDiC0pGwJsoa-3pqafFpsAo61ZvbicbMOI";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
let maxResults = 5;

let searchBtn = document.getElementById("searchBtn");
let searchQuery = document.getElementById("Search");
let suggestedSection = document.getElementById("suggestedSection");
let videoChannelDetails = document.getElementById("video_channelDetails");
let customLoader = document.getElementById("custom-loader");


window.addEventListener("load", () => {
  let urlParams = new URLSearchParams(window.location.search);
  let SearchVideoId = urlParams.get("q") ? urlParams.get("q") : "";
  let searchKey = urlParams.get("searchKey") ? urlParams.get("searchKey") : "";

  console.log("searched video id- " + SearchVideoId);

  // we need to write logic for rendering video player
  // iframe
    initialRender();
});



searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("Search Started");
  customLoader.style.display = "block";
  let dataItems = await fetchVideo(searchQuery.value, maxResults);
  // console.log(dataItems);
  console.log("Rendering video...");
  renderVideo(dataItems);
  customLoader.style.display = "none";
  searchQuery.innerText = "";
});

async function initialRender() {
  console.log("Search Started");
  customLoader.style.display = "block";
  if (searchKey != "") {
    searchQuery.value = searchKey;
  }
  let dataItems = await fetchVideo(searchQuery.value, maxResults);
  console.log(dataItems);
  console.log("Rendering video...");
  renderVideo(dataItems);
  customLoader.style.display = "none";
  searchQuery.innerText = "";
}

function renderVideo(dataItems) {
  console.log("Rendering video starting...");
  suggestedSection.innerHTML = ``;
  videoChannelDetails.innerHTML = ``;
  let start = 0;
  for (let i = start; i < dataItems.length; i++) {
    try {
      let videoId = dataItems[i].id.videoId;
      let videoThumbnailSrc = dataItems[i].snippet.thumbnails.default.url;
      let channelName = dataItems[i].snippet.channelTitle;
      let videoTitle = dataItems[i].snippet.title;
      let videoUploaded = dataItems[i].snippet.publishTime;
      let channelThumbnailSrc = dataItems[i].ChannelLogo.items[0].snippet.thumbnails.default.url;
      let channelDescription = dataItems[i].ChannelLogo.items[0].snippet.description;
      let videoViews = dataItems[i].VideoStats.items[0].statistics.viewCount;
      let likeCount = dataItems[i].VideoStats.items[0].statistics.likeCount;
      let dislikeCount = dataItems[i].VideoStats.items[0].statistics.dislikeCount;
      let duration = dataItems[i].contentDetails.items[0].contentDetails.duration;

      if (SearchVideoId == videoId) {
        console.log("video found");
        
      }
      //check for SearchVideoId, start, & new search by user here is the game

      if ((SearchVideoId === "" && start == 0 )|| (SearchVideoId == videoId) ||  searchQuery.value != "") {
        //first video should be in video_channelDetails section
        start = 1;
        searchQuery.value = "";
        //render first element in video_channelDetails
        if (YT) {
          new YT.Player("videoContainer", {
            height: "500",
            width: "1000",
            videoId,
          });
        }
        videoChannelDetails.innerHTML=`
        <h4 class="mx-2 p-2 my-1" id="videoTitle">${videoTitle}</h4>
        <div class="d-flex justify-content-between mx-2 my-1 p-2">
            <span class="d-flex gap-3 justify-content-center align-items-center">
            <span id="viewsCount">${countFormator(videoViews)} views</span>
             . <span id="videoDate">${timeAgo(videoUploaded)}</span></span>
            <span class="d-flex gap-3 justify-content-center align-items-center">
                <span id="likes"><img src="./Assets/liked.png" alt="">${countFormator(likeCount)}</span>
                <span id="dislikes"><img src="./Assets/DisLiked.png" alt="">${countFormator(dislikeCount)}</span>
                <span id="share"><img src="./Assets/share.png" alt="">SHARE</span>
                <span id="save"><img src="./Assets/save.png" alt="">SAVE</span>
                <span id="more"><img src="./Assets/More.png" alt=""></span>
            </span>
        </div>
        <hr class="border border-secondary border-2">
        <div class="row p-2">
            <div class="col-2">
                <img src="${channelThumbnailSrc}" alt="channelThumbnail" class="rounded-circle " id="channelThumbnail">
            </div>
            <div class="col-10">
                <div class="d-flex justify-content-between">
                    <div>
                        <h4 id="channelName">${channelName}</h4>
                        <p id="channelStats"><span>1.2 M subscriber</span></p>
                    </div>
                    <button class="btn btn-danger px-5">Subscribe</button>
                </div>
                <p>${channelDescription}</p>
            </div>
        </div>
        `;

      } else if (SearchVideoId != videoId) {
        //making suggestedSection video list rendering
        let cardDiv = document.createElement("div");
        cardDiv.className = "card1 d-flex row";
        cardDiv.innerHTML = `
                    <img src="${videoThumbnailSrc}" alt="videoThumbnail" class="img-fluid rounded-start col-5">
            
                    <div class="card-body d-flex justify-content-center align-items-center position-relative col-7" >
                    <span class="position-absolute bottom-0 start-0 translate-left bagde text-bg-dark rounded-pill p-2 py-1" id="videoDuration">${durationConverter(
                      duration
                    )}</span>
                        
                        <div class="d-flex flex-column justify-content-between  h-100 p-2">
                            <h5 class="card-title" id="videoTitle">${videoTitle}</h5>
                            <p class="card-subtitle" id="channelName" onclick="channelPreview(${dataItems[i]})>${channelName}</p>
                            <p class="card-subtitle text-white" id="channelStats">
                            <span>${countFormator(videoViews)} views</span>
                             . <span>${timeAgo(videoUploaded)}</span></p>
                        </div>
            
                    </div>
                    `;
        cardDiv.addEventListener("click", () => {
          videoPreview(videoId);
        });
        suggestedSection.appendChild(cardDiv);
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log("Rendering Video Done Successfully");
}

async function fetchVideo(searchQuery, maxResults) {
  console.log("Fetching video");
  try {
    const response = await fetch(
      `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
    );
    const data = await response.json();
    const dataItems = data.items;
    for (let i = 0; i < dataItems.length; i++) {
      try {
        let VideoStats = await getVideoStats(dataItems[i].id.videoId);
        let contentDetails = await getContentDetails(dataItems[i].id.videoId);
        let ChannelLogo = await getChannelLogo(dataItems[i].snippet.channelId);
        dataItems[i].VideoStats = VideoStats;
        dataItems[i].contentDetails = contentDetails;
        dataItems[i].ChannelLogo = ChannelLogo;
      } catch (error) {
        console.log(
          "this is the error in fetching VideoStats/ChannelLogo Data in API call-> -> " +
            error
        );
      }
    }
    // console.log(dataItems);
    console.log("Fetching video Successful!");
    return dataItems;
  } catch (error) {
    console.log(
      "this is the error in fetching the Data in API call-> " + error
    );
  }
}

async function getVideoStats(videoId) {
  const response = await fetch(
    `${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

async function getContentDetails(videoId) {
  const response = await fetch(
    `${BASE_URL}/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

async function getChannelLogo(channelId) {
  const response = await fetch(
    `${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`
  );
  const data = await response.json();
  // console.log(data);
  return data;
}

function countFormator(count) {
  if (count == undefined || count == null) {
    return 0;
  }
  const num = parseFloat(count);
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "k";
  }
  return num;
}

function timeAgo(videoUploaded) {
  const currentTime = new Date();
  const publishDate = new Date(videoUploaded);
  const timeDifference = currentTime - publishDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(weeks / 4);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}

function durationConverter(duration) {
  if (duration === "P0D") {
    return "Live"; // Return 'Live' for the specific case of 'P0D'.
  }
  // Define a regular expression pattern to match hours, minutes, and seconds.
  const pattern = /PT(\d+H)?(\d+M)?(\d+S)?/;

  // Use regular expressions to extract hours, minutes, and seconds from the input string.
  const matches = duration.match(pattern);

  if (!matches) {
    return null; // Return null for invalid input.
  }

  // Extract hours, minutes, and seconds from the matches.
  const hours = matches[1] ? parseInt(matches[1].slice(0, -1)) : 0;
  const minutes = matches[2] ? parseInt(matches[2].slice(0, -1)) : 0;
  const seconds = matches[3] ? parseInt(matches[3].slice(0, -1)) : 0;

  if (hours < 1 && minutes < 1 && seconds < 1) {
    return "Live"; // If no time components are present, return 'Live'.
  }

  let formattedTime = "";

  if (hours > 0) {
    formattedTime += hours.toString().padStart(2, "0") + ":";
  }

  formattedTime +=
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  return formattedTime;
}

function videoPreview(videoId) {
  let link = document.createElement("a");
  link.href = `video.html?q=${videoId}`;
  link.click();
}

function channelPreview(element) {
  window.location.href = "channel.html";
}
