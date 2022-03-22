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
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
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
    // let respNewStory = await newStory.addStory(currentUser, storyData);
    let respNewStory = await storyList.addStory(currentUser, {title, author, url});
    
    $addStoryForm.trigger("reset");
    $("#add-story-form").hide();
    start();
  }else{
    alert('The URL is not valid. Please try again');
  }
}