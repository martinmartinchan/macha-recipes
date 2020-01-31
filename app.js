const hH = new httpHandler;
const uH = new uiHandler;

const testRecipe = {
  "description": "So good on a sunday morning",
  "ingredients": [
      {
          "amount": 1,
          "name": "Egg",
          "unit": ""
      },
      {
          "amount": 2,
          "name": "Milk",
          "unit": "dl"
      },
      {
          "amount": 1,
          "name": "Wheat",
          "unit": "dl"
      }
  ],
  "name": "Pancakes",
  "servings": 1
}



/** Make the navbar navigate to corresponding page
 */
document.getElementById("test-show-recipe").addEventListener('click', e => uH.showRecipe(e, testRecipe));
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
document.getElementById("addIngredientButton").addEventListener('click', e => uH.addIngredientRow(e));

/** Make the add recipe button submit the recipe to the cookbook
 */
document.getElementById("submit-recipe-button").addEventListener('click', e => uH.submitRecipe(e, hH, "https://martinchan.pythonanywhere.com/addrecipe"));