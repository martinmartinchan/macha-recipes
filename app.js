

/** Get the data from the database and show it.
 */
cH.get("/recipes")
  .then(data => {
    const uH = new UIHandler(data);
    uH.showRecipes();
  })
  .catch(err => console.log(err));



