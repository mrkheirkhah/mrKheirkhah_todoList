class Card {
  node = null;
  title = null;
  description = null;
  checklist = [];
  list = null;
  label = null;
  dueDate = null;
  position = null;
  data = null;
  editingCardTitleFormVisible = false;
  dragAndDrop = new cardDragAndDrop();

  constructor(cardObject, list) {
    if (cardObject) {
      this.title = cardObject.title;

      if (cardObject.id) {
        this.id = cardObject.id;
      } else {
        this.id = generateNewId();
      }

      this.list = list;

      if (cardObject.description) this.description = cardObject.description;

      if (cardObject.dueDate) this.dueDate = cardObject.dueDate;

      if (cardObject.checklist && Array.isArray(cardObject.checklist))
        this.checklist = cardObject.checklist;

      this.data = {
        title: this.title,
        description: this.description ? this.description : null,
        dueDate: this.dueDate ? this.dueDate : null,
        position: list.cards && list.cards.length ? (list.cards.length) + 1 : null,
        id: this.id,
        label: this.label,
        node: this.node ? this.node : null,
      };
    }

    this.makeCard(this.title);
  }

  makeCard(cardName) {
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("cardContainer");

    let card = document.createElement("li");
    card.classList.add("task", "px-2", "py-2");
    card.setAttribute("draggable", "true");
    card.setAttribute("ondragend", "");
    card.setAttribute("ondragover", "");
    card.setAttribute("ondragstart", "");
    card.innerText = cardName;

    let editCardNameForm = document.createElement("form");
    editCardNameForm.style.display = "none";

    let editCardNameFormGroup = document.createElement("div");
    editCardNameFormGroup.classList.add("form-group");

    let editCardNameInput = document.createElement("input");
    editCardNameInput.setAttribute("required", true);
    editCardNameInput.setAttribute("type", "text");
    editCardNameInput.setAttribute("placeholder", "List Name");
    editCardNameInput.classList.add("form-control");

    editCardNameForm.classList.add("was-validated");
    editCardNameForm.onsubmit = (event) => {
      event.preventDefault();
      this.updateCardTitle(editCardNameInput, card);
      this.toggleCardEditTitleEditInput(card, editCardNameForm);
    };

    card.addEventListener("click", (event) => {
      this.toggleCardEditTitleEditInput(card, editCardNameForm);
    });

    let inValidFeedback = document.createElement("div");
    inValidFeedback.classList.add("invalid-feedback");
    inValidFeedback.innerText = "Type Something";

    editCardNameFormGroup.appendChild(editCardNameInput);
    editCardNameFormGroup.appendChild(inValidFeedback);
    editCardNameForm.appendChild(editCardNameFormGroup);

    cardContainer.appendChild(card);
    cardContainer.appendChild(editCardNameForm);

    let optionsButton = document.createElement("button");
    optionsButton.classList.add("btn", "cardOptionsButton");
    optionsButton.setAttribute("type", "button");
    optionsButton.innerHTML = `<svg><use xlink:href="#cardMoreSymbol"></use></svg>`;
    optionsButton.onclick = (e) => {
      this.setCardOptionsModal();
      this.toggleCardOptionsModal();
    };

    cardContainer.appendChild(optionsButton);

    this.node = cardContainer;
  }

  updateCardTitle(cardEditNameInput, card) {
    this.title = cardEditNameInput.value;
    card.innerText = cardEditNameInput.value
  }

  setCardOptionsModal() {
    alert("setCardOptionsModal");
  }

  toggleCardOptionsModal() {
    alert("toggleCardOptionsModal");
  }

  toggleCardEditTitleEditInput(cardTitle, cardEditForm) {
    if (this.editingCardTitleFormVisible) {
      cardTitle.style.display = "block";
      cardEditForm.style.display = "none";
      this.editingCardTitleFormVisible = false;
    } else {
      cardTitle.style.display = "none";
      cardEditForm.style.display = "block";
      this.editingCardTitleFormVisible = true;
    }
  }
}
