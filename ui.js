class UIHandler {
  constructor (data) {
    this.editingRecipe = false;
    if (data.success) {
      this.recipes = data.result.recipes;
    } else {
      this.recipes = [];
    }

    document.getElementById('recipes-nav').addEventListener('click', () => {
      if (this.editingRecipe) {
        if (confirm("Quit editing recipe?")) {
          this.editingRecipe = false;
          this.clearAddRecipePage();
          history.pushState(null, "Macha Recipes", "/");
          this.goToRecipesPage();
        }
      } else {
        history.pushState(null, "Macha Recipes", "/");
        this.goToRecipesPage();
      }
    });
    document.getElementById('add-recipe-nav').addEventListener('click', () => {
      if (this.editingRecipe) {
        if (confirm("Quit editing recipe?")) {
          this.editingRecipe = false;
          this.clearAddRecipePage();
          history.pushState(null, "Add recipe", "/addrecipe");
          this.goToAddRecipePage();
        }
      } else {
        history.pushState(null, "Add recipe", "/addrecipe");
        this.goToAddRecipePage();
      }
    });

    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keydown', e => {
      if (e.keyCode == 13) {
        const matchedList = this.recipes.filter(recipe => {
          return recipe.name.toLowerCase().includes(e.target.value.toLowerCase());
        });
        if (matchedList.length === 1) {
          this.showRecipe(matchedList[0]);
        }
        e.preventDefault();
      }
    });
    searchBar.addEventListener('keyup', e => {
      if (e.keyCode == 13) {
        return;
      }
      const matchedList = this.recipes.filter(recipe => {
        return recipe.name.toLowerCase().includes(e.target.value.toLowerCase());
      });
      this.populateRecipesPage(matchedList);
      e.preventDefault();
    });

    this.populateRecipesPage(this.recipes);
    document.getElementById('addIngredientButton').addEventListener('click', e => {
      this.addIngredientRow();
      e.preventDefault();
    });
    document.getElementById('addInstructionButton').addEventListener('click', e => {
      this.addInstructionRow();
      e.preventDefault();
    });

    window.addEventListener('popstate', e => {
      if (this.editingRecipe) {
        if (confirm("Quit editing recipe?")) {
          this.editingRecipe = false;
          this.clearAddRecipePage();
          this.deroute();
        }
      } else {
        this.deroute();
      }
      e.preventDefault();
    });
    this.deroute();
  }

  loading() {
    document.getElementById('spin').style.display = 'block';
    document.getElementById('front-page').style.display = 'none';
    document.getElementById('single-recipe').style.display = 'none';
    document.getElementById('add-or-edit-recipe').style.display = 'none';
  }

  deroute() {
    let subPath = location.pathname;
    subPath = subPath.slice(1).replace("%20", " ");
    let recipeFound = false;
    if (this.recipes.length != 0) {
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
    document.getElementById('spin').style.display = 'none';
    document.getElementById('front-page').style.display = 'block';
    document.getElementById('single-recipe').style.display = 'none';
    document.getElementById('add-or-edit-recipe').style.display = 'none';
  }
  
  goToAddRecipePage() {
    document.getElementById('spin').style.display = 'none';
    document.getElementById('front-page').style.display = 'none';
    document.getElementById('single-recipe').style.display = 'none';
    document.getElementById('add-or-edit-recipe').style.display = 'block';

    const buttonDiv = document.getElementById('submit-recipe-button-div');
    while (buttonDiv.lastChild) {
      buttonDiv.removeChild(buttonDiv.lastChild);
    }

    const submitButton = document.createElement('button');
    submitButton.classList.add('btn');
    submitButton.classList.add('btn-primary');
    submitButton.type = 'submit';
    submitButton.innerHTML = "Add Recipe";
    submitButton.addEventListener('click', e => {
      const recipe = this.parseRecipeToSubmit();
      this.loading();
      cH.addRecipe(recipe)
        .then(data => {
          this.showStatus(data.success, data.message);
          if (data.success) {
            this.clearAddRecipePage();
            this.refresh()
            .then(this.showRecipe(recipe))
            .catch(err => console.log(err));
          }
        })
        .catch(err => {
          console.log(err);
        });
      e.preventDefault();
    });
    buttonDiv.appendChild(submitButton);
  }

  goToEditRecipePage(recipe) {
    document.getElementById('spin').style.display = 'none';
    document.getElementById('front-page').style.display = 'none';
    document.getElementById('single-recipe').style.display = 'none';
    document.getElementById('add-or-edit-recipe').style.display = 'block';
    this.editingRecipe = true;

    document.getElementById('recipe-name-input').value = recipe.name;
    document.getElementById('recipe-description-input').value = recipe.description;
    document.getElementById('servings-input').value = recipe.servings;
    
    let ingredientList = document.getElementById('ingredient-list');
    for (let i = 0; i < recipe.ingredients.length - 1; i++) {
      this.addIngredientRow();
    }
    for (let i = 0; i < recipe.ingredients.length; i++) {
      ingredientList.getElementsByClassName('ingredients-input')[i].value = recipe.ingredients[i].name;
      ingredientList.getElementsByClassName('amount-input')[i].value = recipe.ingredients[i].amount;
      ingredientList.getElementsByClassName('units-input')[i].value = recipe.ingredients[i].unit;
    }

    let instructionList = document.getElementById('instruction-list');
    for (let i = 0; i < recipe.instructions.length - 1; i++) {
      this.addInstructionRow();
    }
    for (let i = 0; i < recipe.instructions.length; i++) {
      let step = parseInt(recipe.instructions[i].step);
      instructionList.getElementsByClassName('instruction-input')[step - 1].value = recipe.instructions[i].instruction;
    }

    const buttonDiv = document.getElementById('submit-recipe-button-div');
    while (buttonDiv.lastChild) {
      buttonDiv.removeChild(buttonDiv.lastChild);
    }
    const submitButton = document.createElement('button');
    submitButton.classList.add('btn');
    submitButton.classList.add('btn-primary');
    submitButton.type = 'submit';
    submitButton.innerHTML = "Submit Changes";
    submitButton.addEventListener('click', e => {
      const editedRecipe = this.parseRecipeToSubmit();
      this.loading();
      cH.editRecipe(recipe.name, editedRecipe)
        .then(data => {
          this.showStatus(data.success, data.message);
          if (data.success) {
            this.editingRecipe = false;
            this.clearAddRecipePage();
            this.refresh()
            .then(this.showRecipe(editedRecipe))
            .catch(err => console.log(err));
          }
        })
        .catch(err => {
          console.log(err);
        });
      e.preventDefault();
    });
    buttonDiv.appendChild(submitButton);
  }

  refresh() {
    this.loading();
    return new Promise ((resolve, reject) => {
      cH.get()
      .then(data => {
        if (data.success) {
          this.recipes = data.result.recipes;
        } else {
          this.recipes = [];
        }
        this.populateRecipesPage(this.recipes);
        resolve();
      })
      .catch(err => reject(err))
    })
  }

  showRecipe(recipe) {
    document.getElementById('spin').style.display = 'none';
    document.getElementById('front-page').style.display = 'none';
    document.getElementById('single-recipe').style.display = 'block';
    document.getElementById('add-or-edit-recipe').style.display = 'none';

    document.getElementById('recipe-name-show').innerHTML = recipe.name;
    document.getElementById('servings-show').innerHTML = "Servings: " + recipe.servings;
    document.getElementById('description-show').innerHTML = recipe.description;

    const ingredientsList = document.getElementById('ingredients-list-show');
    while (ingredientsList.lastChild) {
      ingredientsList.removeChild(ingredientsList.lastChild);
    }

    let ingItem;
    let ingName;
    let ingAmount;
    let counter = 0;
    recipe.ingredients.forEach(ing => {
      ingItem = document.createElement('tr');
      if (counter % 2) {
        ingItem.classList.add('tr-primary');
      } else {
        ingItem.classList.add('tr-nothing');
      }

      ingName = document.createElement('td');
      ingAmount = document.createElement('td');
      if (counter === 0) {
        ingName.classList.add('ingredient-col');
        ingAmount.classList.add('amount-col');
      }
      ingName.innerHTML = ing.name;
      ingAmount.innerHTML = ing.amount + " " + ing.unit;

      ingItem.appendChild(ingName);
      ingItem.appendChild(ingAmount);
      document.getElementById('ingredients-list-show').appendChild(ingItem);
      counter++;
    });

    const instructionList = document.getElementById('instructions-list-show');
    while (instructionList.lastChild) {
      instructionList.removeChild(instructionList.lastChild);
    }

    let instItem;
    let stepItem;
    let instructionText;
    recipe.instructions.forEach(inst => {
      instItem = document.createElement('div');
      instItem.classList.add('row');
      instItem.classList.add('mb-3');
      instItem.classList.add('ml-3');

      stepItem = document.createElement('div');
      stepItem.classList.add('col-1');
      stepItem.classList.add('align-self-center');
      stepItem.style.textAlign = 'center';
      stepItem.innerHTML = inst.step + ".";

      instructionText = document.createElement('div');
      instructionText.classList.add('col-11');
      instructionText.innerHTML = inst.instruction;

      instItem.appendChild(stepItem);
      instItem.appendChild(instructionText);
      document.getElementById('instructions-list-show').appendChild(instItem);
    });

    const editRecipeDiv = document.getElementById('edit-recipe-button');
    while (editRecipeDiv.lastChild) {
      editRecipeDiv.removeChild(editRecipeDiv.lastChild);
    }

    const editButton = document.createElement('button');
    editButton.classList.add('btn');
    editButton.classList.add('btn-primary');
    editButton.classList.add('mr-3');
    editButton.innerHTML = "Edit Recipe";
    editButton.addEventListener('click', e => {
      this.goToEditRecipePage(recipe);
      e.preventDefault()
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger');
    deleteButton.innerHTML = "Delete Recipe";
    deleteButton.addEventListener('click', e => {
      let data = {name: recipe.name}
      this.loading();
      cH.deleteRecipe(data)
        .then(data => {
          this.showStatus(data.success, data.message);
          if (data.success) {
            this.refresh()
            .then(this.goToRecipesPage())
            .catch(err => console.log(err));
          }
        })
        .catch(err => {
          console.log(err);
        });
      e.preventDefault()
    });

    editRecipeDiv.append(editButton);
    editRecipeDiv.append(deleteButton);
  }

  populateRecipesPage(recipeList) {
    const mainRecipeDiv = document.getElementById('recipes');
    while (mainRecipeDiv.children.length > 0) {
      mainRecipeDiv.removeChild(mainRecipeDiv.children[0]);
    }
    if (recipeList.length === 0) {
      let emptyCard;
      let header;
      emptyCard = document.createElement('div');
      emptyCard.classList.add('card');
      emptyCard.classList.add('w-75');
      emptyCard.classList.add('mt-3');

      header = document.createElement('h5');
      header.classList.add('card-header');
      header.appendChild(document.createTextNode("No recipes"));

      emptyCard.appendChild(header);
      mainRecipeDiv.appendChild(emptyCard);
    } else {
      let recipeCard;
      let header;
      let cardBody;
      let descriptionText;
      recipeList.forEach(recipe => {
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

  addIngredientRow() {
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
    ingredientInput.classList.add('ingredients-input');

    amountInput.classList.add('form-control');
    amountInput.classList.add('amount-input');
    amountInput.setAttribute('type', 'number');

    unitInput.classList.add('form-control');
    unitInput.classList.add('units-input');
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
  }

  addInstructionRow() {
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
    stepNumber.classList.add('instruction-step');
    stepNumber.innerHTML = (document.getElementById('instruction-list').childElementCount - 1) + ".";

    const inputDiv = document.createElement('div');
    inputDiv.classList.add('form-group');
    inputDiv.classList.add('col-md-9');

    const inputTextArea = document.createElement('textarea');
    inputTextArea.classList.add('form-control');
    inputTextArea.classList.add('instruction-input');
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
  }

  removeIngredientRow(e, rowDiv) {
    document.getElementById('ingredient-list').removeChild(rowDiv);
    e.preventDefault();
  }

  removeInstructionRow(e, rowDiv) {
    document.getElementById('instruction-list').removeChild(rowDiv);
    this.updateInstructionSteps();
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
        name: ingredientList.children[i].querySelectorAll('.ingredients-input')[0].value,
        amount: ingredientList.children[i].querySelectorAll('.amount-input')[0].value,
        unit: ingredientList.children[i].querySelectorAll('.units-input')[0].value,
      }
      ingObjects.push(ing);
    }

    let instObjects = [];
    let inst;

    for (let i = 1; i < instructionList.childElementCount - 1; i++) {
      let stringStep = instructionList.children[i].querySelectorAll('.instruction-step')[0].innerText;
      let intStep = parseInt(/\d+/g.exec(stringStep)[0]);
      inst = {
        step: intStep,
        instruction: instructionList.children[i].querySelectorAll('.instruction-input')[0].value,
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
    document.querySelector('.ingredients-input').value = "";
    document.querySelector('.amount-input').value = "";
    document.querySelector('.units-input').value = "";

    let instructionList = document.getElementById('instruction-list');
    while (instructionList.children.length > 3) {
      instructionList.removeChild(instructionList.children[2]);
    }
    document.querySelector('.instruction-input').value = "";
    this.updateInstructionSteps();
  }
}