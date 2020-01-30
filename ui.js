class uiHandler {
  goToRecipesPage() {
    document.getElementById('search-recipes').style.display = "block";
    document.getElementById('recipes').style.display = "block";
    document.getElementById('add-recipes').style.display = "none";
    document.getElementById('login-container').style.display = "none";
  }
  
  goToAddRecipePage() {
    document.getElementById('search-recipes').style.display = "none";
    document.getElementById('recipes').style.display = "none";
    document.getElementById('add-recipes').style.display = "block";
    document.getElementById('login-container').style.display = "none";
  }

  goToLoginPage() {// TODO
  }

  showRecipes(data) {
    const recipes = data.result.recipes;
    let recipeCard;
    let header;
    let cardBody;
    let descriptionText;
    recipes.forEach(recipe => {
      recipeCard = document.createElement('div');
      recipeCard.classList.add('card');
      recipeCard.classList.add('w-75');
      recipeCard.classList.add('mt-3');

      header = document.createElement('h5');
      header.classList.add('card-header');
      header.appendChild(document.createTextNode(recipe.name));
      header.style.textAlign = "left";

      cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      cardBody.style.textAlign = "left";

      descriptionText = document.createElement('p');
      descriptionText.classList.add('card-text');
      descriptionText.appendChild(document.createTextNode(recipe.description));

      cardBody.appendChild(descriptionText);

      recipeCard.appendChild(header);
      recipeCard.appendChild(cardBody);

      document.getElementById('recipes').appendChild(recipeCard);

    });
  }

  addIngredientRow(e) {
    const ingredientDiv = document.createElement('div');
    const unitDiv = document.createElement('div');
    const amountDiv = document.createElement('div');
    
    ingredientDiv.classList.add('form-group');
    ingredientDiv.classList.add('col-md-7');

    amountDiv.classList.add('form-group');
    amountDiv.classList.add('col-md-2');

    unitDiv.classList.add('form-group');
    unitDiv.classList.add('col-md-2');

    const ingredientInput = document.createElement('input');
    const amountInput = document.createElement('input');
    const unitInput = document.createElement('input');

    ingredientInput.classList.add('form-control');
    ingredientInput.id = "ingredients-input";

    amountInput.classList.add('form-control');
    amountInput.id = "amount-input";
    amountInput.setAttribute("type", "number");

    unitInput.classList.add('form-control');
    unitInput.id = "units-input";
    unitInput.setAttribute("list", "unitList");

    ingredientDiv.appendChild(ingredientInput);
    amountDiv.appendChild(amountInput);
    unitDiv.appendChild(unitInput);

    const ingredientList = document.getElementById("IngredientList");
    let childrenNumber = ingredientList.children.length;
    ingredientList.insertBefore(ingredientDiv, ingredientList.childNodes[childrenNumber]);
    ingredientList.insertBefore(amountDiv, ingredientList.childNodes[childrenNumber + 1]);
    ingredientList.insertBefore(unitDiv, ingredientList.childNodes[childrenNumber + 2]);
    e.preventDefault();
  }

  submitRecipe(e, hH, url) {
    let recipe = {};
    const recipeName = document.getElementById("recipe-name-input").value;
    const description = document.getElementById("recipe-description-input").value;
    const servings = document.getElementById("servings-input").value;

    const ingredients = document.querySelectorAll("#ingredients-input");
    const amounts = document.querySelectorAll("#amount-input");
    const units = document.querySelectorAll("#units-input");

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
    recipe['password'] = 'Troglodon5986';

    hH.post(url, recipe)
      .then(data => console.log(data))
      .catch(err => console.log(err));

    e.preventDefault();
  }
}