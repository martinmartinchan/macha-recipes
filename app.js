const hH = new httpHandler;
const uH = new uiHandler;

/** Get the data from the database and show it.
 */
hH.get("https://martinchan.pythonanywhere.com/recipes")
  .then(data => uH.showRecipes(data))
  .catch(err => console.log(err));

/** Make the add button for the add-recipe-page
 *  add a new row when clicked.
 */
document.getElementById("addIngredientButton").addEventListener('click', uH.addIngredientRow);