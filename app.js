const hH = new httpHandler;
const uH = new uiHandler;
const baseURL = "https://martinchan.pythonanywhere.com";
/** Make the navbar navigate to corresponding page
 */
document.getElementById('recipes-nav').addEventListener('click', uH.goToRecipesPage);
document.getElementById('add-recipe-nav').addEventListener('click', uH.goToAddRecipePage);
document.getElementById('login-nav').addEventListener('click', uH.goToLoginPage);

/** Get the data from the database and show it.
 */
hH.get(baseURL + "/recipes")
  .then(data => uH.showRecipes(data))
  .catch(err => console.log(err));

/** Make the add button for the add-recipe-page
 *  add a new row when clicked.
 */
document.getElementById('addIngredientButton').addEventListener('click', e => uH.addIngredientRow(e));

/** Make the add recipe button submit the recipe to the cookbook
 */
document.getElementById('submit-recipe-button').addEventListener('click', e => {
  const recipe = uH.submitRecipe();
  recipe['password'] = "Troglodon5986";
  hH.post(baseURL + "/addrecipe", recipe)
    .then(data => console.log(data))
    .catch(err => console.log(err));
  e.preventDefault();
});




