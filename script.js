// const API_KEY = 'AIzaSyAkZxDRVAQs12xNHqzVQEzwz9pSlvzhSwg';

const BASE_URL = "https://www.googleapis.com/youtube/v3";

async function fetchVideo(searchQuery,maxResults){
    const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`);
    const data = await response.json();
    console.log(data.items);
}

fetchVideo('icc',5);
// snippet gives video information as well
// like title,thumbnail & other information

async function getVideoStats(videoId) {
    const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`);
    const data = await response.json();
    console.log(data);
    
}
getVideoStats('qIlk1KIsyY');


async function getChannelLogo(channelId) {
    const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
    const data = await response.json();
    console.log(data);
    
}
getChannelLogo('UCnrCcE_0MJ_i7bBrHM93Wxg');