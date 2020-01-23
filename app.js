const hH = new httpHandler;
const uH = new uiHandler;

hH.get("https://martinchan.pythonanywhere.com/recipes")
  .then(data => uH.showRecipes(data))
  .catch(err => console.log(err));