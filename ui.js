class UIHandler {
  constructor (data) {
    this.recipes = data.result.recipes;
    document.getElementById('recipes-nav').addEventListener('click', () => {
      history.pushState(null, "Macha Recipes", "/");
      this.goToRecipesPage();
    });
    document.getElementById('add-recipe-nav').addEventListener('click', () => {
      history.pushState(null, "Add recipe", "/addrecipe");
      this.goToAddRecipePage();
    });

    this.populateRecipesPage();
    this.populateAddRecipePage();

    window.addEventListener('popstate', e => this.goToCorrectPage(e));
    this.deroute();
  }

  goToCorrectPage(e) {
    this.deroute();
    e.preventDefault();
  }

  deroute() {
    let subPath = location.pathname;
    subPath = subPath.slice(1).replace("%20", " ");
    let recipeFound = false;
    this.recipes.forEach(recipe => {
      if (recipe.name === subPath) {
        this.showRecipe(recipe);
        recipeFound = true;
        return;
      }
    });
    if (!recipeFound) {
      if (subPath === "addrecipe") {
        this.goToAddRecipePage();
      } else {
        this.goToRecipesPage();
      }
    }
  }

  goToRecipesPage() {
    document.getElementById('search-recipes').style.display = 'block';
    document.getElementById('recipes').style.display = 'block';
    document.getElementById('single-recipe').style.display = 'none';
    document.getElementById('add-recipe').style.display = 'none';
  }
  
  goToAddRecipePage() {
    document.getElementById('search-recipes').style.display = 'none';
    document.getElementById('recipes').style.display = 'none';
    document.getElementById('single-recipe').style.display = 'none';
    document.getElementById('add-recipe').style.display = 'block';
  }

  refresh(callback) {
    cH.get()
      .then(data => {
        this.recipes = data.result.recipes;
        this.populateRecipesPage();
        callback;
      })
      .catch(err => console.log(err));
  }

  showRecipe(recipe) {
    document.getElementById('search-recipes').style.display = 'none';
    document.getElementById('recipes').style.display = 'none';
    document.getElementById('single-recipe').style.display = 'block';
    document.getElementById('add-recipe').style.display = 'none';
    document.getElementById('recipe-name-show').innerHTML = recipe.name;
    document.getElementById('servings-show').innerHTML = "Servings: " + recipe.servings;
    document.getElementById('description-show').innerHTML = recipe.description;

    const ingredientsList = document.getElementById('ingredients-list-show');
    while (ingredientsList.lastChild) {
      ingredientsList.removeChild(ingredientsList.lastChild);
    }

    let ingItem ;
    recipe.ingredients.forEach(ing => {
      ingItem = document.createElement('li');
      ingItem.innerHTML = ing.name + ", " + ing.amount + " " + ing.unit;
      document.getElementById('ingredients-list-show').appendChild(ingItem);
    });

    const deleteRecipeDiv = document.getElementById('delete-recipe-button');
    while (deleteRecipeDiv.lastChild) {
      deleteRecipeDiv.removeChild(deleteRecipeDiv.lastChild);
    }

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger');
    deleteButton.innerHTML = "Delete Recipe";

    deleteButton.addEventListener('click', e => {
      let data = {name: recipe.name}
      cH.deleteRecipe(data)
        .then(data => {
          this.showStatus(data.success, data.message);
          if (data.success) {
            this.refresh(this.goToRecipesPage());
          }
        })
        .catch(err => console.log(err));
      e.preventDefault()
    });
    deleteRecipeDiv.append(deleteButton);
  }

  populateRecipesPage() {
    const mainRecipeDiv = document.getElementById('recipes');
    while (mainRecipeDiv.children.length > 0) {
      mainRecipeDiv.removeChild(mainRecipeDiv.children[0]);
    }

    let recipeCard;
    let header;
    let cardBody;
    let descriptionText;
    this.recipes.forEach(recipe => {
      recipeCard = document.createElement('div');
      recipeCard.classList.add('card');
      recipeCard.classList.add('w-75');
      recipeCard.classList.add('mt-3');

      header = document.createElement('h5');
      header.classList.add('card-header');
      header.appendChild(document.createTextNode(recipe.name));
      header.style.textAlign = 'left';

      cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      cardBody.style.textAlign = 'left';

      descriptionText = document.createElement('p');
      descriptionText.classList.add('card-text');
      descriptionText.appendChild(document.createTextNode(recipe.description));

      cardBody.appendChild(descriptionText);

      recipeCard.appendChild(header);
      recipeCard.appendChild(cardBody);

      recipeCard.style.cursor = 'pointer';
      recipeCard.addEventListener('click', e => {
        history.pushState(null, recipe.name, "/" + recipe.name);
        this.showRecipe(recipe)
        e.preventDefault();
      });
      mainRecipeDiv.appendChild(recipeCard);
    });
  }

  populateAddRecipePage() {
    document.getElementById('addIngredientButton').addEventListener('click', e => this.addIngredientRow(e));

    document.getElementById('submit-recipe-button').addEventListener('click', e => {
      const recipe = this.parseRecipeToSubmit();
      cH.addRecipe(recipe)
        .then(data => {
          this.showStatus(data.success, data.message);
          if (data.success) {
            this.clearAddRecipePage();
            this.refresh(this.showRecipe(recipe));
          }
        })
        .catch(err => console.log(err));
      e.preventDefault();
    });
  }

  addIngredientRow(e) {
    e.preventDefault();
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('form-row');
    rowDiv.classList.add('flex-nowrap');

    const ingredientDiv = document.createElement('div');
    const unitDiv = document.createElement('div');
    const amountDiv = document.createElement('div');
    const minusDiv = document.createElement('div');
    
    ingredientDiv.classList.add('form-group');
    ingredientDiv.classList.add('col-md-7');

    amountDiv.classList.add('form-group');
    amountDiv.classList.add('col-md-2');

    unitDiv.classList.add('form-group');
    unitDiv.classList.add('col-md-2');

    minusDiv.classList.add('form-group');
    minusDiv.classList.add('col-md-1');

    const ingredientInput = document.createElement('input');
    const amountInput = document.createElement('input');
    const unitInput = document.createElement('input');
    const minusButton = document.createElement('button');

    ingredientInput.classList.add('form-control');
    ingredientInput.id = 'ingredients-input';

    amountInput.classList.add('form-control');
    amountInput.id = 'amount-input';
    amountInput.setAttribute('type', 'number');

    unitInput.classList.add('form-control');
    unitInput.id = 'units-input';
    unitInput.setAttribute('list', 'unitList');

    minusButton.classList.add('btn');
    minusButton.classList.add('btn-danger');
    minusButton.classList.add('w-100');
    minusButton.setAttribute('type', 'submit');
    minusButton.innerHTML = '-';

    ingredientDiv.appendChild(ingredientInput);
    amountDiv.appendChild(amountInput);
    unitDiv.appendChild(unitInput);
    minusDiv.appendChild(minusButton);

    rowDiv.appendChild(ingredientDiv);
    rowDiv.appendChild(amountDiv);
    rowDiv.appendChild(unitDiv);
    rowDiv.append(minusDiv);

    minusButton.addEventListener('click', e => this.removeIngredientRow(e, rowDiv));

    const ingredientList = document.getElementById('ingredient-list');
    let childrenNumber = ingredientList.children.length;
    ingredientList.insertBefore(rowDiv, ingredientList.children[childrenNumber - 1]);
    
  }

  removeIngredientRow(e, rowDiv) {
    document.getElementById('ingredient-list').removeChild(rowDiv);
    e.preventDefault();
  }

  parseRecipeToSubmit() {
    let recipe = {};
    const recipeName = document.getElementById('recipe-name-input').value;
    const description = document.getElementById('recipe-description-input').value;
    const servings = document.getElementById('servings-input').value;

    const ingredients = document.querySelectorAll('#ingredients-input');
    const amounts = document.querySelectorAll('#amount-input');
    const units = document.querySelectorAll('#units-input');

    let ingObjects = [];
    let ing;
    for (let i = 0; i < ingredients.length; i++) {
      ing = {
        name: ingredients[i].value,
        amount: amounts[i].value,
        unit: units[i].value,
      }
      ingObjects.push(ing);
    }

    recipe['name'] = recipeName;
    recipe['servings'] = servings;
    recipe['description'] = description;
    recipe['ingredients'] = ingObjects;

    return recipe;
  }

  showStatus(success, message){
    let status;
    if (success) {
      status = document.getElementById('status-success');
    } else {
      status = document.getElementById('status-failed');
    }
    status.innerHTML = message;
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
    }, 5000);
  }

  clearAddRecipePage(){
    document.getElementById('recipe-name-input').value = "";
    document.getElementById('recipe-description-input').value = "";
    document.getElementById('servings-input').value = "";
    let ingredientList = document.getElementById('ingredient-list');
    while (ingredientList.children.length > 2) {
      ingredientList.removeChild(ingredientList.children[1]);
    }
    document.querySelector('#ingredients-input').value = "";
    document.querySelector('#amount-input').value = "";
    document.querySelector('#units-input').value = "";
  }
}