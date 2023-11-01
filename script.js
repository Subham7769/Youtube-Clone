const API_KEY = 'AIzaSyAkZxDRVAQs12xNHqzVQEzwz9pSlvzhSwg';

const BASE_URL = "https://www.googleapis.com/youtube/v3";
let searchBtn = document.getElementById("searchBtn");
let searchQuery = document.getElementById("Search");
let videoContainer = document.getElementById("videoContainer");
let maxResults = 2;

searchBtn.addEventListener("click",async (e)=>{
    e.preventDefault();
    console.log("Search Started");
    let dataItems = await fetchVideo(searchQuery.value,maxResults);
    console.log("Rendering video...");
    renderVideo(dataItems);
    searchQuery.innerText = '';
});


async function fetchVideo(searchQuery,maxResults){
    console.log("Fetching video");
    try {
        const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`);
        const data = await response.json();
        const dataItems = data.items;
        dataItems.forEach(async (element) => {
            try {
                let VideoStats = await getVideoStats(element.id.videoId);
                let contentDetails = await getContentDetails(element.id.videoId);
                let ChannelLogo = await getChannelLogo(element.snippet.channelId);
                element["VideoStats"] = VideoStats;
                element["contentDetails"] = contentDetails;
                element["ChannelLogo"] = ChannelLogo;    
            } catch (error) {
                console.log("this is the error in fetching VideoStats/ChannelLogo Data in API call-> -> "+error);
            }
        });
        console.log(dataItems);
        console.log("Fetching video Successful!");
        return dataItems; 
    } catch (error) {
        console.log("this is the error in fetching the Data in API call-> "+error);
    }
}

fetchVideo('icc',maxResults)
// snippet gives video information as well
// like title,thumbnail & other information

async function getVideoStats(videoId) {
    const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`);
    const data = await response.json();
    // console.log(data);
    return data;
}

async function getContentDetails(videoId) {
    const response = await fetch(`${BASE_URL}/videos?id=${videoId}&part=contentDetails&key=${API_KEY}`);
    const data = await response.json();
    console.log(data);
    return data;
}

async function getChannelLogo(channelId) {
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
    const data = await response.json();
    console.log(data);
    return data;
}

function renderVideo(dataItems){
    console.log("Rendering video starting...");
    videoContainer.innerHTML='';
    for (let i = 0; i < dataItems.length; i++) {
            let videoThumbnailSrc = dataItems[i].snippet.thumbnails.default.url;
            let channelThumbnailSrc = dataItems[i].ChannelLogo.items.snippet.thumbnails.default.url;//problem
            let channelName = dataItems[i].snippet.channelTitle;
            let videoTitle = dataItems[i].snippet.thumbnails.title;
            let videoViews = dataItems[i].VideoStats.items.statistics.viewCount;//problem
            let videoUploaded = dataItems[i].snippet.publishTime;
    
    
            let cardDiv = document.createElement("div"); 
            cardDiv.className="card";
            cardDiv.innerHTML = `
            <img src="${videoThumbnailSrc}" alt="videoThumbnail" class="card-img-top" onclick="videoPreview(dataItems[${i}])">
    
            <div class="card-body d-flex justify-content-center align-items-center position-relative" >
                
                <span class="position-absolute top-0 end-0 translate-top bagde text-bg-dark rounded-pill p-2 py-1" id="videoDuration">02:12</span>
                <img src="${channelThumbnailSrc}" alt="channelThumbnail" class="rounded-circle px-3 channelThumbnail">
                
                <div class="d-flex flex-column">
                    <h4 class="card-title" id="videoTitle" onclick="videoPreview(dataItems[${i}])">${videoTitle}</h4>
                    <p class="card-subtitle" id="channelName" onclick="channelPreview(dataItems[${i}])>${channelName}</p>
                    <p class="card-subtitle" id="channelStats"><span>${videoViewsFormator(videoViews)} views</span> . <span>${timeAgo(videoUploaded)} week ago</span></p>
                </div>
    
            </div>
            `;
            videoContainer.appendChild(cardDiv);
    }
}
function videoViewsFormator(videoViews){
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
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  }
  
function videoPreview(element){

    window.location.href = "video.html";
}

function channelPreview(element){
    
    window.location.href = "channel.html";
}



