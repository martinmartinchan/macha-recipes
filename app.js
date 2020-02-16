const uH = new UIHandler();

/** Get the data from the database and show it.
 */
cH.get("/recipes")
  .then(data => uH.showRecipes(data))
  .catch(err => console.log(err));



