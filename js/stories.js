"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/** 
 * Allow logged in users to see a separate list of favorited stories 
 **/
function getAndShowFavoritedStoriesOnStart(user) {
  const userFavArr = user.favorites;
  // turn plain old story objects from API into instances of Story class
  const stories = userFavArr.map(story => new Story(story));
  // build an instance of our own class using the new array of stories
  storyList = new StoryList(stories);
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const userFavArr = currentUser.favorites;
  const userFavFind = userFavArr.some(value => value.storyId == story.storyId);
  const storyFavStatusClass = !userFavFind ? "far" : "fas";
  
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="trash_icon">
          <img src="trash_icon.png" alt="">
        </span>  
        <span class="star">
          <i class="fa-star ${storyFavStatusClass}"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  // add event listener for click star to marking/unmarking a story as a favorite
  $('span.star').on('click', async function(evt){
    const storyID = evt.currentTarget.parentElement.getAttribute('id');
    currentUser = await User.favoriteStories(currentUser, storyID);

    // show start mark/unmark
    let iStarContainer = evt.currentTarget.children[0];
    if(iStarContainer.classList.contains('far')){
      iStarContainer.classList.remove('far');
      iStarContainer.classList.add('fas');
    }else{
      iStarContainer.classList.remove('fas');
      iStarContainer.classList.add('far');
    }
  });

  // add event listener for click trash icon and delete a story
  $('span.trash_icon img').on('click', async function(evt){
    const storyID = evt.currentTarget.parentElement.parentElement.getAttribute('id');
    const response = await storyList.delStory(currentUser, storyID);
    getAndShowStoriesOnStart();
  });

  $allStoriesList.show();
}


/* Function called when users submit the form to Add New Story */
function isValidUrl(url) {   
  var regExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regExp.test(url);
}
async function submitNewStoryData() {
  // grab the title, author and url
  const title = $("#add-story-title").val();
  const author = $("#add-story-author").val();
  const url = $("#add-story-url").val();

  // check if the URl is correct
  if(isValidUrl(url)){
    // StoryList.addStory adds a new story by sending the right data to API and returns an instance of Story
    const storyData = {
      title, 
      author, 
      url
    }
    let respNewStory = await storyList.addStory(currentUser, storyData);
    
    $addStoryForm.trigger("reset");
    $("#add-story-form").hide();
    start();
  }else{
    alert('The URL is not valid. Please try again');
  }
}