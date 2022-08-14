# User Story
As a user, I want to 
1. search for recipes, so that I can find new ideas for meals.
2. update the number of servings, so that I can cook a meal for different number of people.
3. bookmark recipes, so that I can review them later.
4. create my own recipes, so that I have them all organized in the same app.
5. see my bookmarks and own recipes when I leave the app and come back later, so that I can close the app safely after cooking.

# Features
- Search functionality: input field to send request to API with searched keywords. [1]
- Display results with pagination [1]
- Display recipe with cooking time, servings and ingredients. [1]
- Change servings functionality: update all ingredients according to current number of servings. [2]
- Bookmarking functionality: display a list of all bookmarked recipes. [3]
- User can upload own recipes. [4]
- User recipes will automatically be bookmarked. [4]
- User can only see their own recipes, not recipes from other users. [4]
- Store bookmark data in the browser using local storage. [5]
- On page load, read saved bookmarks from local storage and display. [5]


# Components of any architecture
- Business logic: sending messages, storing transactions, calculating taxes etc.
- State
- HTTP library
- Application logic (router)
- Presentation logic (UI layer)

Model: Business logic, State, HTTP library
View: Presentation logic
Controller: Application logic

User interactions are handled by the *controller* layer. Controller orchestrates the whole application by integrating data from the *model* layer and presenting it through the *view* layer.

## Handling Events