
// async function getStatistic(videoId){
//   const response = await fetch(
//       ${baseURL}/videos?key=${apiKey}&part=statistics&id=${videoId}
//   )
//   const data = await response.json();

//   let views =  data.items[0].statistics.viewCount;
//   let likes = data.items[0].statistics.likeCount;
//   let comments = data.items[0].statistics.commentCount;
  
//   return [views, likes, comments];
// }

// async function getSnippet(videoId){
//   const response = await fetch(
//       ${baseURL}/videos?key=${apiKey}&part=snippet&id=${videoId}
//   )
//   const data = await response.json();

//   let publishedDate =  data.items[0].snippet.publishedAt;
//   let title = data.items[0].snippet.title;
//   let description = data.items[0].snippet.description;
//   let channelTitle = data.items[0].snippet.channelTitle;
  
//   return [dateString(new Date(publishedDate)), title, description, channelTitle];
// }
// async function getChannelStatistics(channelId){
//   const response = await fetch(
//       ${baseURL}/channels?key=${apiKey}&part=statistics&id=${channelId}
//   )
//   const data = await response.json();

//   let subscribers = data.items[0].statistics.subscriberCount;
//   let subscriberHidden = data.items[0].statistics.hiddenSubscriberCount;

//   return [subscribers, subscriberHidden];
// }
// async function getChannelSnippet(channelId){
//   const response = await fetch(
//       ${baseURL}/channels?key=${apiKey}&part=snippet&id=${channelId}
//   )
//   const data = await response.json();

//   let channelLogo = data.items[0].snippet.thumbnails.high.url;

//   return [channelLogo];
// }

// async function getReplySnippet(commentId){
//   const response = await fetch(`${BASE_URL}/comments?part=snippet&parentId=${commentId}&key=${API_KEY}&maxResults=20`)
//   const data = await response.json();
      // console.log(data);
//   return data.items;

// }
// async function getVideoDuration(videoId) {
//   const response = await fetch(
//       ${baseURL}/videos?key=${apiKey}&part=contentDetails&id=${videoId}
//   )
//   let data = await response.json();

//   let duration = data.items[0].contentDetails.duration;
//   // return new Promise((res, rej) => {
//   //     res(parseISO8601Duration(duration));
//   // });
//   return parseISO8601Duration(duration);
// }
// async function getChannelData(channelId){
//   const response = await fetch(
//       ${baseURL}/channels?key=${apiKey}&part=snippet&id=${channelId}
//   )
//   const data = await response.json();

//   // return new Promise((res, rej) => {
//   //     res([data.items[0].snippet.title, data.items[0].snippet.thumbnails.high.url]);
//   // })

//   return [data.items[0].snippet.title, data.items[0].snippet.thumbnails.high.url];
// }
// async function getViewCount(videoId){
//   const response = await fetch(
//       ${baseURL}/videos?key=${apiKey}&part=statistics&id=${videoId}
//   )
//   const data = await response.json();

//   // return new Promise((res, rej) => {
//   //     res(data.items[0].statistics.viewCount);
//   // });

//   return data.items[0].statistics.viewCount;
// }