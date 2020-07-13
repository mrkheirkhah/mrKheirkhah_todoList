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
  optionsModalIsVisible = false;
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
        position:
          list.cards && list.cards.length ? list.cards.length + 1 : null,
        id: this.id,
        label: this.label,
        node: this.node ? this.node : null,
      };
    }

    this.makeCard(this.title);

    $("#cardOptionsModal").on("hidden.bs.modal", () => {
      this.optionsModalIsVisible = false;
          let optionsModal = document.getElementById("cardOptionsModal");
          let modalContent = optionsModal.getElementsByClassName(
            "modal-content"
          )[0];
          modalContent.innerHTML = "";
    });
  }

  makeCard(cardName) {
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("cardContainer");
    cardContainer.id = this.id;
    let card = document.createElement("li");
    card.classList.add("task", "px-2", "py-2");
    card.setAttribute("draggable", "true");
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
    let closeEditCardButton = document.createElement("button");
    closeEditCardButton.classList.add("close");
    closeEditCardButton.setAttribute("type", "button");
    closeEditCardButton.style.display = "none";
    closeEditCardButton.innerHTML = "&times;";
    closeEditCardButton.classList.add("closeEditCardButton");
    closeEditCardButton.addEventListener("click", (e) => {
      this.toggleCardEditTitleEditInput(card, editCardNameForm);
      optionsButton.style.display = "block";
      closeEditCardButton.style.display = "none";
    });
    editCardNameForm.appendChild(closeEditCardButton);
    editCardNameForm.onsubmit = (event) => {
      event.preventDefault();
      this.updateCardTitle(editCardNameInput, card);
      this.toggleCardEditTitleEditInput(card, editCardNameForm);
      closeEditCardButton.style.display =
        closeEditCardButton.style.display === "block" ? "none" : "block";
      editCardNameInput.value = "";
    };
    cardContainer.ondragend = (e) => {
      cardDragAndDrop.dragEnd(e, this.list);
    };
    cardContainer.ondragover = (e) => {
      cardDragAndDrop.dragOver(e, this.list);
    };
    cardContainer.ondragstart = (e) => {
      cardDragAndDrop.dragStart(e, this.list);
    };

    cardContainer.addEventListener(
      "contextmenu",
      (e) => {
        // alert("you tried to open context menu");
        e.preventDefault();
      },
      false
    );
    card.addEventListener("click", (event) => {
      this.toggleCardEditTitleEditInput(card, editCardNameForm);
      optionsButton.style.display = "none";
      closeEditCardButton.style.display = "block";
    });

    cardContainer.appendChild(optionsButton);

    this.node = cardContainer;
  }

  updateCardTitle(cardEditNameInput, card) {
    this.title = cardEditNameInput.value;
    card.innerText = cardEditNameInput.value;
    this.updateData();
    cardEditNameInput.value = "";
  }

  setCardOptionsModal() {
    let optionsModal = document.getElementById("cardOptionsModal");
    let modalContent = optionsModal.getElementsByClassName("modal-content")[0];

    modalContent.innerHTML = "";

    let modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    modalHeader.innerHTML = `<h4 class="modal-title">${this.list.title}</h4>
    <blockquote class="blockquote-footer">${this.list.thisListBoard.title}</blockquote>
            <button type="button" class="close" data-dismiss="modal">
              &times;
            </button>`;

    modalContent.appendChild(modalHeader);
    
    let modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    let cardOptionForm = document.createElement("form");
    cardOptionForm.classList.add("was-validated");

    //end

    let titleFormGroup = document.createElement("div");
    titleFormGroup.classList.add("form-group");

    let titleLabel = document.createElement("label");
    titleLabel.innerText = "Title:";

    let titleInput = document.createElement("input");
    titleInput.setAttribute("type", "text");
    titleInput.classList.add("form-control");
    titleInput.setAttribute("placeholder", "Title");
    titleInput.value = this.title;

    let titleInvalidFeedback = document.createElement("div");
    titleInvalidFeedback.classList.add("invalid-feedback");
    titleInvalidFeedback.innerText = "Type Something";


    titleFormGroup.appendChild(titleLabel);
    titleFormGroup.appendChild(titleInput);
    titleFormGroup.appendChild(titleInvalidFeedback);
    cardOptionForm.appendChild(titleFormGroup);
    //end

    let descriptionFormGroup = document.createElement("div");
    descriptionFormGroup.classList.add("form-group");

    let descriptionLabel = document.createElement("label");
    descriptionLabel.innerText = "Description:";

    let descriptionInput = document.createElement("textarea");
    descriptionInput.classList.add("form-control");
    descriptionInput.setAttribute("placeholder", "Description");
    descriptionInput.value =
      this.description && this.description !== "" ? this.description : "";

    let descriptionInValidFeedback = document.createElement("div");
    descriptionInValidFeedback.classList.add("invalid-feedback");
    descriptionInValidFeedback.innerText = "Type Something";
    

    descriptionFormGroup.appendChild(descriptionLabel);
    descriptionFormGroup.appendChild(descriptionInput);
    descriptionFormGroup.appendChild(descriptionInValidFeedback);
    cardOptionForm.appendChild(descriptionFormGroup);
    //end

    let dueDateFormGroup = document.createElement("div");
    dueDateFormGroup.classList.add("form-group");

    let dueDateLabel = document.createElement("label");
    dueDateLabel.innerText = "Due Date:";

    let dueDateInput = document.createElement("input");
    dueDateInput.classList.add("form-control");
    dueDateInput.setAttribute("type", "date");
    dueDateInput.value =
      this.dueDate && this.dueDate !== "" ? this.dueDate : null;
    
    dueDateFormGroup.appendChild(dueDateLabel);
    dueDateFormGroup.appendChild(dueDateInput);
    cardOptionForm.appendChild(dueDateFormGroup);
    
    //end

    let optionsModalSaveButton = document.createElement("button");
    optionsModalSaveButton.setAttribute("type", "submit");
    optionsModalSaveButton.classList.add("btn", "btn-primary");
    optionsModalSaveButton.innerText = "Save Options";

    optionsModalSaveButton.onclick = (e) => {
      e.preventDefault();
      this.title = titleInput.value;
      this.description = descriptionInput.value;
      this.dueDate = dueDateInput.value;
      this.updateData();
      this.toggleCardOptionsModal();
    };
    cardOptionForm.appendChild(optionsModalSaveButton);
    //todo checkList
    // let addCheckListButton = document.createElement("button");
    // addCheckListButton.innerText = "Add CheckList";
    // addCheckListButton.classList.add("addCheckListButton");
    // let addCheckListForm = document.createElement("form");
    // addCheckListButton.classList.add("was-validated");
    // addCheckListButton.addEventListener("click", () => {
    //   let checklist = document.createElement("div");
    //   checklist.classList.add("checklist");
    //});
    modalBody.appendChild(cardOptionForm);
    modalContent.appendChild(modalBody);
  }

  toggleCardOptionsModal() {
    if (this.optionsModalIsVisible) {
      $("#cardOptionsModal").modal("hide");
      this.optionsModalIsVisible = false;
    } else {
      $("#cardOptionsModal").modal("show");
      this.optionsModalIsVisible = true;
    }
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

  updateData() {
    this.data.title = this.title;
    this.data.description = this.description ? this.description : null;
    this.data.dueDate = this.dueDate ? this.dueDate : null;
    // this.data.position =
    //   this.position ? this.position : this.data.list.cards && this.list.cards.length ? this.list.cards.length + 1 : null;
    this.data.id = this.id;
    this.data.label = this.label;
    this.data.node = this.node ? this.node : null;
  }
}
