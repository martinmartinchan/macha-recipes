class CookbookHandler {
  constructor() {
    this.baseURL = "https://martinchan.pythonanywhere.com";
    this.dummyPassword = "Troglodon5986";
  }

  get() {
    return new Promise((resolve, reject) => {
      fetch(this.baseURL)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
    })
  }

  addRecipe(recipe) {
    recipe['password'] = this.dummyPassword;
    return new Promise((resolve, reject) => {
      fetch(this.baseURL + "/addrecipe", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(recipe)
      })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    })
  }

  deleteRecipe(data) {
    data['password'] = this.dummyPassword;
    return new Promise ((resolve, reject) => {
      fetch(this.baseURL + "/removerecipe", {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    })
  }

  editRecipe(oldRecipeName, editedRecipe){
    let data = {};
    data['password'] = this.dummyPassword;
    data['name'] = oldRecipeName;
    data['recipe'] = editedRecipe;
    return new Promise ((resolve, reject) => {
      fetch(this.baseURL + "/editrecipe", {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    })
  }
}

cH = new CookbookHandler();