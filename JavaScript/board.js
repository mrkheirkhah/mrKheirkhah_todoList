class Board {
  isNewListModalVisible = false;

  lists = [];

  addList(title, description, cardsData, event, id) {
    if (title && description && cardsData && typeof cardsData == "object") {
      let newList = new List(title, description, this, cardsData, id);
      this.lists.push(newList.data);
      this.listContainer.appendChild(newList.node);
    }

    if (
      title &&
      title !== "" &&
      description &&
      description !== "" &&
      !cardsData
    ) {
      let newList = new List(title, description, this);
      this.lists.push(newList.data);
      this.listContainer.appendChild(newList.node);
    }
    if (this.isNewListModalVisible) this.toggleNewListModal();
    //prevent submit
    if (event && typeof event == "object") event.preventDefault();
  }

  setAddListModal() {
    let modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");

    let modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    let modalHeadingText = document.createElement("h4");
    modalHeadingText.innerText = "Add New List";

    let modalCloseButton = document.createElement("button");
    modalCloseButton.setAttribute("type", "button");
    modalCloseButton.setAttribute("data-dismiss", "modal");
    modalCloseButton.classList.add("close");
    modalCloseButton.innerHTML = "&times;";

    modalHeader.appendChild(modalHeadingText);
    modalHeader.appendChild(modalCloseButton);

    let newListForm = document.createElement("form");
    newListForm.classList.add("was-validated");

    let titleFormGroup = document.createElement("div");
    titleFormGroup.classList.add("form-group");

    let titleLabel = document.createElement("label");
    titleLabel.setAttribute("for", `${this.id}-listName`);
    titleLabel.innerText = "List Name:";

    let titleInput = document.createElement("input");
    titleInput.setAttribute("required", true);
    titleInput.setAttribute("type", "text");
    titleInput.setAttribute("placeholder", "List Name");
    titleInput.id = `${this.id}-listName`;
    titleInput.classList.add("form-control");

    let descriptionFormGroup = document.createElement("div");
    descriptionFormGroup.classList.add("form-group");

    let descriptionLabel = document.createElement("label");
    descriptionLabel.setAttribute("for", `${this.id}-listDescription`);
    descriptionLabel.innerText = "List Description:";

    let descriptionInput = document.createElement("input");
    descriptionInput.setAttribute("required", true);
    descriptionInput.setAttribute("type", "text");
    descriptionInput.setAttribute("placeholder", "List Description");
    descriptionInput.id = `${this.id}-listDescription`;
    descriptionInput.classList.add("form-control");

    let inValidFeedback = document.createElement("div");
    inValidFeedback.classList.add("invalid-feedback");
    inValidFeedback.innerText = "Type Something";

    let addListButton = document.createElement("button");
    addListButton.setAttribute("type", "submit");
    addListButton.classList.add("btn", "btn-primary");
    addListButton.innerText = "add";
    addListButton.onclick = (e) => {
      this.addList(titleInput.value, descriptionInput.value, null, e);
      this.isNewListModalVisible = false;
    };

    titleFormGroup.appendChild(titleLabel);
    titleFormGroup.appendChild(titleInput);
    titleFormGroup.appendChild(inValidFeedback);

    descriptionFormGroup.appendChild(descriptionLabel);
    descriptionFormGroup.appendChild(descriptionInput);
    descriptionFormGroup.appendChild(inValidFeedback);

    newListForm.appendChild(titleFormGroup);
    newListForm.appendChild(descriptionFormGroup);
    newListForm.appendChild(addListButton);

    modalBody.appendChild(newListForm);

    newListModal.getElementsByClassName("modal-content")[0].innerHTML = "";
    newListModal
      .getElementsByClassName("modal-content")[0]
      .appendChild(modalHeader);
    newListModal
      .getElementsByClassName("modal-content")[0]
      .appendChild(modalBody);
  }

  toggleNewListModal() {
    if (this.isNewListModalVisible) {
      $("#newListModal").modal("hide");
      this.isNewListModalVisible = false;
    } else {
      $("#newListModal").modal("show");
      this.isNewListModalVisible = true;
    }
  }

  addBoardTab() {
    let boardTab = document.createElement("div");
    boardTab.id = this.id;
    boardTab.classList.add("tab-pane", "fadein", "active", "boardTab");

    let boardTitle = document.createElement("h3");
    boardTitle.classList.add("text-light", "font-weight-bolder");
    boardTitle.innerText = this.title;
    this.titleContainer = boardTitle;

    let boardDescription = document.createElement("p");
    boardDescription.classList.add("text-light", "font-weight-normal");
    boardDescription.innerText = this.description;
    this.descriptionContainer = boardDescription;

    let addBoardButton = document.createElement("button");
    addBoardButton.classList.add(
      "addList_button",
      "btn",
      "btn-success",
      "font-weight-bold",
      "text-white"
    );
    addBoardButton.innerText = "add new list";
    addBoardButton.onclick = () => {
      this.setAddListModal();
      this.toggleNewListModal();
    };

    let listContainer = document.createElement("div");
    listContainer.classList.add("lists_container");
    this.listContainer = listContainer;

    boardTab.appendChild(boardTitle);
    boardTab.appendChild(boardDescription);
    boardTab.appendChild(listContainer);
    boardTab.appendChild(addBoardButton);
    this.boardContainer.appendChild(boardTab);
  }

  listDroped(e) {
    e.preventDefault();
    console.log(e);
  }

  saveToLocalStorage() {
    localStorage.setItem("boardListsData", JSON.stringify(this.lists));
    this.showSaveBoardToast();
  }

  showSaveBoardToast() {
    let toast = document.getElementById("saveBoard_toast");
    toast.innerHTML = `<div class="toast-header">
        <strong class="mr-auto text-primary">Save Board</strong>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
      </div>
      <div class="toast-body">
        <mark class="text-info">${this.title}</mark> boards Data Saved
      </div>`;
    $(".toast").toast("show");
    setTimeout(() => {
      $(".toast").toast("hide");
    }, 3000);
  }

  getSavedData() {
    let listsData = localStorage.getItem("boardListsData");
    if (listsData && typeof JSON.parse(listsData) == "object") {
      this.load(JSON.parse(listsData));
    }
  }

  load(data) {
    for (let list of data) {
      this.addList(list.title, list.description, list.cards, null, list.id);
    }
  }

  constructor(title, description, boardContainer, id, lists) {
    if (title && title !== "") this.title = title;

    if (description && description !== "") this.description = description;

    this.boardContainer = boardContainer;

    if (document.getElementById(boardContainer))
      this.boardContainer = document.getElementById(boardContainer);

    if (id) {
      this.id = id;
    } else {
      this.id = generateNewId();
    }

    $("#newListModal").on("hidden.bs.modal", () => {
      this.isNewListModalVisible = false;
    });

    document.getElementById("saveBoardButton").addEventListener("click", () => {
      this.saveToLocalStorage();
    });

    this.addBoardTab();

    this.getSavedData();
  }
}
