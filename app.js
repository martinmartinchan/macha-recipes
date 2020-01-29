const hH = new httpHandler;
const uH = new uiHandler;

/** Make the navbar navigate to corresponding page
 */
document.getElementById("recipes-nav").addEventListener('click', uH.goToRecipesPage);
document.getElementById("add-recipe-nav").addEventListener('click', uH.goToAddRecipePage);
document.getElementById("login-nav").addEventListener('click', uH.goToLoginPage);


/** Get the data from the database and show it.
 */
hH.get("https://martinchan.pythonanywhere.com/recipes")
  .then(data => uH.showRecipes(data))
  .catch(err => console.log(err));

/** Make the add button for the add-recipe-page
 *  add a new row when clicked.
 */
document.getElementById("addIngredientButton").addEventListener('click', uH.addIngredientRow);

/** Make the add recipe button submit the recipe to the cookbook
 */
document.getElementById("submit-recipe-button").addEventListener('click', uH.submitRecipe);