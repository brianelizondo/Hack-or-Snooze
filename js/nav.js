"use strict";

/******************************************************************************
* Handling navbar clicks and updating navbar
*/

/*
* Show main list of all stories when click site name 
*/
function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}
$body.on("click", "#nav-all", navAllStories);

/*
* Show login/signup on click on "login" 
*/
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
$navLogin.on("click", navLoginClick);

/*
* When a user first logins in, update the navbar to reflect that. 
*/
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navSubmit.show();
  $navFavorites.show();
  $navMyStories.show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/*
* Show New Story Form/Add New Story on click on "submit" 
*/
function navSubmitClick() {
  console.debug("navSubmitClick");
  $("#add-story-author").val(`${currentUser.name}`);
  $("#add-story-form").show();
  $('form#add-story-form button').on('click', function(evt){
    console.debug("add story", evt);
    evt.preventDefault();
    submitNewStoryData();
  });
}
$navSubmit.on("click", navSubmitClick);

/*
* Show favorite stories list 
*/
function navFavoriteStories() {
  console.debug("navFavoriteStories");
  getAndShowFavoritedStoriesOnStart(currentUser);
}
$navFavorites.on("click", navFavoriteStories);

/*
* Show story list by username 
*/
function navMyStoriesList() {
  console.debug("navMyStoriesList");
  getAndShowOwnStoriesOnStart(currentUser);
}
$navMyStories.on("click", navMyStoriesList);