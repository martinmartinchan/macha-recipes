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
    if (typeof this.recipes != 'undefined') {
      this.recipes.forEach(recipe => {
        if (recipe.name === subPath) {
          this.showRecipe(recipe);
          recipeFound = true;
          return;
        }
      });
    }
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

    let ingItem;
    recipe.ingredients.forEach(ing => {
      ingItem = document.createElement('li');
      ingItem.innerHTML = ing.name + ", " + ing.amount + " " + ing.unit;
      document.getElementById('ingredients-list-show').appendChild(ingItem);
    });

    const instructionList = document.getElementById('instructions-list-show');
    while (instructionList.lastChild) {
      instructionList.removeChild(instructionList.lastChild);
    }

    let instItem;
    recipe.instructions.forEach(inst => {
      instItem = document.createElement('li');
      instItem.innerHTML = inst.step + ". " + inst.instruction;
      document.getElementById('instructions-list-show').appendChild(instItem);
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
    if (typeof this.recipes === 'undefined') {
      let emptyCard;
      let header;
      emptyCard = document.createElement('div');
      emptyCard.classList.add('card');
      emptyCard.classList.add('w-75');
      emptyCard.classList.add('mt-3');

      header = document.createElement('h5');
      header.classList.add('card-header');
      header.appendChild(document.createTextNode("Cookbook is empty"));

      emptyCard.appendChild(header);
      mainRecipeDiv.appendChild(emptyCard);
    } else {
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
  }

  populateAddRecipePage() {
    document.getElementById('addIngredientButton').addEventListener('click', e => this.addIngredientRow(e));
    document.getElementById('addInstructionButton').addEventListener('click', e => this.addInstructionRow(e));

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
    let childrenNumber = ingredientList.childElementCount;
    ingredientList.insertBefore(rowDiv, ingredientList.children[childrenNumber - 1]);

    e.preventDefault();
  }

  addInstructionRow(e) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('form-row');
    rowDiv.classList.add('align-items-end');
    rowDiv.classList.add('flex-nowrap');

    const stepDiv = document.createElement('div');
    stepDiv.classList.add('form-group');
    stepDiv.classList.add('col-md-1');
    stepDiv.classList.add('align-self-center');
    stepDiv.style.textAlign = 'center';

    const stepNumber = document.createElement('span');
    stepNumber.id = 'instruction-step';
    stepNumber.innerHTML = (document.getElementById('instruction-list').childElementCount - 1) + ".";

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('form-group');
    inputDiv.classList.add('col-md-9');

    const inputTextArea = document.createElement('textarea');
    inputTextArea.classList.add('form-control');
    inputTextArea.id = 'instruction-input';
    inputTextArea.style.rows = 2;

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('form-group');
    buttonDiv.classList.add('col-md-1');

    const minusButton = document.createElement('button');
    minusButton.classList.add('btn');
    minusButton.classList.add('btn-danger');
    minusButton.classList.add('w-100');
    minusButton.setAttribute('type', 'submit');
    minusButton.innerHTML = '-';

    minusButton.addEventListener('click', e => this.removeInstructionRow(e, rowDiv));

    buttonDiv.appendChild(minusButton);
    inputDiv.appendChild(inputTextArea);
    stepDiv.appendChild(stepNumber);

    rowDiv.append(stepDiv);
    rowDiv.append(inputDiv);
    rowDiv.append(buttonDiv);

    const instructionList = document.getElementById('instruction-list');
    let childrenNumber = instructionList.children.length;
    instructionList.insertBefore(rowDiv, instructionList.children[childrenNumber - 1]);
    document.getElementById('read-only-instruction-number').innerHTML = childrenNumber;

    e.preventDefault();
  }

  removeIngredientRow(e, rowDiv) {
    document.getElementById('ingredient-list').removeChild(rowDiv);
    e.preventDefault();
  }

  removeInstructionRow(e, rowDiv) {
    document.getElementById('instruction-list').removeChild(rowDiv);
    this.updateInstructionSteps()
    e.preventDefault();
  }

  updateInstructionSteps() {
    const instructionList = document.getElementById('instruction-list')
    for (let i = 1; i < instructionList.childElementCount; i++) {
      instructionList.children[i].children[0].children[0].innerHTML = i + '.'
    }
  }

  parseRecipeToSubmit() {
    let recipe = {};
    const recipeName = document.getElementById('recipe-name-input').value;
    const description = document.getElementById('recipe-description-input').value;
    const servings = document.getElementById('servings-input').value;

    const ingredientList = document.getElementById('ingredient-list');
    const instructionList = document.getElementById('instruction-list');

    let ingObjects = [];
    let ing;
    for (let i = 0; i < ingredientList.childElementCount - 1; i++) {
      ing = {
        name: ingredientList.children[i].querySelectorAll('#ingredients-input')[0].value,
        amount: ingredientList.children[i].querySelectorAll('#amount-input')[0].value,
        unit: ingredientList.children[i].querySelectorAll('#units-input')[0].value,
      }
      ingObjects.push(ing);
    }

    let instObjects = [];
    let inst;

    for (let i = 1; i < instructionList.childElementCount - 1; i++) {
      let stringStep = instructionList.children[i].querySelectorAll('#instruction-step')[0].innerText;
      let intStep = parseInt(/\d+/g.exec(stringStep)[0]);
      inst = {
        step: intStep,
        instruction: instructionList.children[i].querySelectorAll('#instruction-input')[0].value,
      }
      instObjects.push(inst);
    }

    recipe['name'] = recipeName;
    recipe['servings'] = servings;
    recipe['description'] = description;
    recipe['ingredients'] = ingObjects;
    recipe['instructions'] = instObjects;

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