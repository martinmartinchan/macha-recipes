/* Create a cookbook to interact with the database
*/
const cb = new Cookbook();

/* Get the recipes from the database and initiate UI
*/
cb.get()
  .then(data => {
    const ui = new UI(cb, data.result);
  })
  .catch(err => console.log(err));



