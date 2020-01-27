class uiHandler {
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
    
    ingredientDiv.classList.add('form-group');
    ingredientDiv.classList.add('col-md-8');

    unitDiv.classList.add('form-group');
    unitDiv.classList.add('col-md-3');

    const ingredientInput = document.createElement('input');
    const unitInput = document.createElement('input');

    ingredientInput.classList.add('form-control');
    unitInput.classList.add('form-control');
    unitInput.setAttribute("list", "unitList");

    ingredientDiv.appendChild(ingredientInput);
    unitDiv.appendChild(unitInput);

    const ingredientList = document.getElementById("IngredientList");
    let childrenNumber = ingredientList.children.length;
    ingredientList.insertBefore(ingredientDiv, ingredientList.childNodes[childrenNumber]);
    ingredientList.insertBefore(unitDiv, ingredientList.childNodes[childrenNumber + 1]);
    e.preventDefault()
  }
}