const API_KEY = "AIzaSyDA0UFC-gFpphL3RRiZy26LV_h4DMI_O1g";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
let searchBtn = document.getElementById("searchBtn");
let searchQuery = document.getElementById("Search");
let videos = document.getElementById("videos");
let customLoader = document.getElementById("custom-loader");
let maxResults = 15;

async function initialRender() {
  console.log("Search Started");
  let dataItems = await fetchVideo(searchQuery.value, maxResults);
  // console.log(dataItems);
  console.log("Rendering video...");
  customLoader.style.display = "none";
  renderVideo(dataItems);
}initialRender();

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("Search Started");
  let dataItems = await fetchVideo(searchQuery.value, maxResults);
  // console.log(dataItems);
  console.log("Rendering video...");
  renderVideo(dataItems);
  customLoader.style.display = "none";
  searchQuery.innerText = "";
});


async function fetchVideo(searchQuery, maxResults) {
  customLoader.style.display = "block";

  console.log("Fetching video");
  try {
    const response = await fetch(
      `${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`
    );
    const data = await response.json();
    const dataItems = data.items;
    // const dataItems = JSON.parse(localStorage.getItem('dataItems'));

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
// snippet gives video information as well
// like title,thumbnail & other information

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

function renderVideo(dataItems) {
  console.log("Rendering video starting...");
  // console.log(dataItems[0]);

  videos.innerHTML = "";
  for (let i = 0; i < dataItems.length; i++) {
    try {
      let videoId = dataItems[i].id.videoId;
      let videoThumbnailSrc = dataItems[i].snippet.thumbnails.default.url;
      let channelThumbnailSrc =
        dataItems[i].ChannelLogo.items[0].snippet.thumbnails.default.url;
      let channelName = dataItems[i].snippet.channelTitle;
      let videoTitle = dataItems[i].snippet.title;
      let videoViews = dataItems[i].VideoStats.items[0].statistics.viewCount;
      let videoUploaded = dataItems[i].snippet.publishTime;
      let duration =
        dataItems[i].contentDetails.items[0].contentDetails.duration;

      let cardDiv = document.createElement("div");
      cardDiv.className = "card2";
      cardDiv.innerHTML = `
        <div>
          <img src="${videoThumbnailSrc}" al/t="videoThumbnail" class="card-img-top">
        </div>
        <div class="cardBody" >
        <span class="" id="videoDuration">${durationConverter(
          duration
        )}</span>
          <div class="channelImage">
            <img src="${channelThumbnailSrc}" alt="channelThumbnail" class="channelThumbnail">
          </div>
          <div class="videoDetails">
            <h5 class="card-title" id="channelTitle" >${videoTitle}</h5>
            <p class="card-subtitle text-dark" >
            <span>${videoViewsFormator(videoViews)} views</span>
             . <span>${timeAgo(videoUploaded)}</span></p>
          </div>
        </div>`;

      cardDiv.addEventListener("click", () => {
        videoPreview(videoId);
      });
      videos.appendChild(cardDiv);
    } catch (error) {
      console.log(error);
    }
  }
  console.log("Rendering Video Done Successfully");
}

function videoViewsFormator(videoViews) {
  const num = parseFloat(videoViews);
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "k";
  }
  return number;
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
    if (duration === 'P0D') {
        return 'Live'; // Return 'Live' for the specific case of 'P0D'.
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
      return 'Live'; // If no time components are present, return 'Live'.
    }
  
    let formattedTime = '';
  
    if (hours > 0) {
      formattedTime += hours.toString().padStart(2, '0') + ':';
    }
  
    formattedTime += minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
  
    return formattedTime;
  }

function videoPreview(videoId) {
    let link = document.createElement('a');
    link.href = `video.html?q=${videoId}&searchKey=${searchQuery.value}`;
    link.click();
}

function channelPreview(element) {
  window.location.href = "channel.html";
}

function showSideMenu(){
  console.log("clicked");
   let sideMenu = document.getElementById("sideMenu");
   sideMenu.classList.toggle("show");
  console.log(sideMenu);
}
