class UI {
	/* The constructor of this class basically works as a initiator for the whole page
    It adds event listeners to the navigation bars, routes us to the correct page and shows the recipes
  */
 	constructor (cb, recipes) {
		this.cb = cb;
    this.recipes = recipes;
    this.editingRecipe = false;

    this.fillAddRecipePage();
    this.resetFrontPage();

    /* Add event handlers to the nav-bar items */
    document.getElementById('logo-nav').addEventListener('click', () => {
      if (this.editingRecipe) {
        if (confirm("Quit editing recipe?")) {
          this.editingRecipe = false;
          this.fillAddRecipePage();
          history.pushState(null, "Macha Recipes", "/");
          this.resetFrontPage();
          this.goToFrontPage();
        }
      } else {
        history.pushState(null, "Macha Recipes", "/");
        this.resetFrontPage();
        this.goToFrontPage();
      }
    });
    document.getElementById('recipes-nav').addEventListener('click', () => {
      if (this.editingRecipe) {
        if (confirm("Quit editing recipe?")) {
          this.editingRecipe = false;
          this.fillAddRecipePage();
          history.pushState(null, "Macha Recipes", "/");
          this.resetFrontPage();
          this.goToFrontPage();
        }
      } else {
        history.pushState(null, "Macha Recipes", "/");
        this.resetFrontPage();
        this.goToFrontPage();
      }
    });
    document.getElementById('add-recipe-nav').addEventListener('click', () => {
      if (this.editingRecipe) {
        if (confirm("Quit editing recipe?")) {
          this.editingRecipe = false;
          history.pushState(null, "Add recipe", "/addrecipe");
          this.fillAddRecipePage();
          this.goToAddOrEditRecipePage();
        }
      } else {
        history.pushState(null, "Add recipe", "/addrecipe");
        this.goToAddOrEditRecipePage();
      }
    });

    /* Add functionality to the search bar */
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keydown', e => {
      if (e.keyCode == 13) {
        const matchedList = this.recipes.filter(recipe => {
          return recipe.name.toLowerCase().includes(e.target.value.toLowerCase());
        });
        if (matchedList.length === 1) {
          const recipeToShow = matchedList[0];
          this.fillSingleRecipePage(recipeToShow);
          history.pushState(null, recipeToShow.name, "/" + encodeURI(recipeToShow.name));
          this.goToSingleRecipePage();
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
      this.populateRecipes(matchedList);
      e.preventDefault();
    });

    /* Add functionality to the add ingredients/instructions row buttons in add/edit recipe */
    document.getElementById('addIngredientButton').addEventListener('click', e => {
      this.addIngredientRow();
      e.preventDefault();
    });
    document.getElementById('addInstructionButton').addEventListener('click', e => {
      this.addInstructionRow();
      e.preventDefault();
    });

    /* Add eventlistener to popstate */
    window.addEventListener('popstate', e => {
      if (this.editingRecipe) {
        if (confirm("Quit editing recipe?")) {
          this.editingRecipe = false;
          this.fillAddRecipePage();
          this.route();
        }
      } else {
        this.route();
      }
      e.preventDefault();
    });

    /* Routes to the correct page */
    this.route();
	}

	/* Function route to the correct page */
  route() {
    let url = new URL(location.href);
    /* First check if we are in edit recipe */
    if (url.pathname === '/editrecipe') {
      /* Check if there are name given as param (i.e. not undefined) */
      let recipeName = decodeURI(url.searchParams.get("name"));
      if (recipeName) {
        /* Search through the recipes and look for a match */
        this.recipes.forEach(recipe => {
          if (recipe.name === recipeName) {
            this.fillEditRecipePage(recipe);
            this.goToAddOrEditRecipePage();
          }
        });
      }
    /* Check if we are in add recipe */
    } else if (url.pathname === '/addrecipe') {
      this.fillAddRecipePage();
      this.goToAddOrEditRecipePage();
    /* Check if we are in the front page */
    } else if (url.pathname === '/') {
      this.resetFrontPage();
      this.goToFrontPage();
    /* Check if we are viewing a recipe */
    } else {
      let recipeFound = false;
      let recipeName = decodeURI(url.pathname.slice(1)); //Slice 1 to remove the slash
      this.recipes.forEach(recipe => {
        if (recipe.name === recipeName) {
          recipeFound = true;
          this.fillSingleRecipePage(recipe);
          this.goToSingleRecipePage();
        }
      });
      /* Recipe not matching anythig means nothing is found. Show 404 */
      if (!recipeFound) {
        this.pageNotFound();
      }
    }
  }

	/* Shows a status with information on how the communication with the cookbook went */
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

 	/* Shows the loading spinner */
 	loading() {
    document.getElementById('spin').style.display = 'block';
    document.getElementById('page404').style.display = 'none';
		document.getElementById('front-page').style.display = 'none';
		document.getElementById('add-or-edit-recipe').style.display = 'none';
		document.getElementById('single-recipe').style.display = 'none';
	}

  /* Shows 404 page not found */
  pageNotFound() {
    document.getElementById('spin').style.display = 'none';
    document.getElementById('page404').style.display = 'block';
		document.getElementById('front-page').style.display = 'none';
		document.getElementById('add-or-edit-recipe').style.display = 'none';
		document.getElementById('single-recipe').style.display = 'none';
  }

	/* Go to the front page with the search bar and the recipes in a list */
	goToFrontPage() {
    document.getElementById('spin').style.display = 'none';
    document.getElementById('page404').style.display = 'none';
    document.getElementById('front-page').style.display = 'block';
    document.getElementById('add-or-edit-recipe').style.display = 'none';
    document.getElementById('single-recipe').style.display = 'none';
	}
	
	/* Go to the add or edit recipe page which is a form page with a submit button */
	goToAddOrEditRecipePage() {
    document.getElementById('spin').style.display = 'none';
    document.getElementById('page404').style.display = 'none';
    document.getElementById('front-page').style.display = 'none';
    document.getElementById('add-or-edit-recipe').style.display = 'block';
    document.getElementById('single-recipe').style.display = 'none';
	}
	
	/* Go to the a single recipe page showing only a single recipe */
	goToSingleRecipePage() {
    document.getElementById('spin').style.display = 'none';
    document.getElementById('page404').style.display = 'none';
    document.getElementById('front-page').style.display = 'none';
    document.getElementById('add-or-edit-recipe').style.display = 'none';
    document.getElementById('single-recipe').style.display = 'block';
	}
	
	/* Clears the serchbar and fills the page with current recipe list */
	resetFrontPage() {
    document.getElementById('search-bar').value = '';
    this.populateRecipes(this.recipes);
	}

	/* Clears the recipes and refills with the recipe list provided */
	populateRecipes(recipeList) {
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
      emptyCard.classList.add('mx-auto');

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
        recipeCard.classList.add('mx-auto');
  
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
          history.pushState(null, recipe.name, "/" + encodeURI(recipe.name));
					this.fillSingleRecipePage(recipe);
					this.goToSingleRecipePage();
          e.preventDefault();
        });
        mainRecipeDiv.appendChild(recipeCard);
      });
    }
	}

	/* Prepares the add recipe page for a recipe to be added. Creates appropriate button */
	fillAddRecipePage() {
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
      if (this.checkParsedRecipe(recipe)) {
        this.loading();
        this.cb.addRecipe(recipe)
          .then(data => {
            if (data.success) {
              this.fillAddRecipePage();
              this.recipes = data.result;
              this.populateRecipes(this.recipes);
              this.fillSingleRecipePage(recipe);
              history.pushState(null, recipe.name, "/" + encodeURI(recipe.name));
              this.goToSingleRecipePage();
            } else {
              this.goToAddOrEditRecipePage();
            }
            this.showStatus(data.success, data.message);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.showStatus(false, "Recipe must contain name, number of servings, at least one ingredient and at least one instruction.")
      }
      e.preventDefault();
    });
    buttonDiv.appendChild(submitButton);
  }

	/* Prepares the edit recipe page for a recipe to be edited. Creates appropriate button */
	fillEditRecipePage(recipe) {
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
      if (this.checkParsedRecipe(editedRecipe)) {
        this.loading();
        this.cb.editRecipe(recipe.name, editedRecipe)
          .then(data => {
            if (data.success) {
              this.editingRecipe = false;
              this.fillAddRecipePage();
              this.recipes = data.result;
              this.populateRecipes(this.recipes);
              this.fillSingleRecipePage(editedRecipe);
              history.pushState(null, editedRecipe.name, "/" + encodeURI(editedRecipe.name));
              this.goToSingleRecipePage();
            } else {
              this.goToAddOrEditRecipePage();
            }
            this.showStatus(data.success, data.message);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.showStatus(false, "Recipe must contain name, number of servings, at least one ingredient and at least one instruction.")
      }
      e.preventDefault();
    });
    buttonDiv.appendChild(submitButton);
  }

	/* Fills the single recipe page with a new recipe */
	fillSingleRecipePage(recipe) {  
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
      this.fillEditRecipePage(recipe);
      history.pushState(null, "recipe.name", "editrecipe?name=" + encodeURI(recipe.name));
      this.goToAddOrEditRecipePage();
      e.preventDefault()
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn');
    deleteButton.classList.add('btn-danger');
    deleteButton.innerHTML = "Delete Recipe";
    deleteButton.addEventListener('click', e => {
      let data = {name: recipe.name}
      this.loading();
      this.cb.deleteRecipe(data)
        .then(data => {
          if (data.success) {
            this.recipes = data.result;
            this.resetFrontPage();
            history.pushState(null, "Macha Recipes", "/");
            this.goToFrontPage()
          } else {
            this.goToAddOrEditRecipePage();
          }
          this.showStatus(data.success, data.message);
        })
        .catch(err => {
          console.log(err);
        });
      e.preventDefault()
    });

    editRecipeDiv.append(editButton);
    editRecipeDiv.append(deleteButton);
  }

  /* --------------------------Help functions--------------------------- */
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

	checkParsedRecipe(recipe) {
    let success = true;
    if (!recipe.name) {
      success = false;
    }
    if (!recipe.servings) {
      success = false;
    }
    recipe.ingredients.forEach(ing => {
      if (!ing.name) {
        success = false;
      }
      if (!ing.amount) {
        success = false;
      }
    });
    recipe.instructions.forEach(inst => {
      if (!inst.instruction) {
        success = false;
      }
    });
    return success
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

}