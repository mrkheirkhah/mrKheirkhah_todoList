class Board {
  constructor(title, description, id, lists) {
    this.id = id;

    if (title && title !== "") this.title = title;

    if (description && description !== "") this.description = description;

    if (lists && Array.isArray(lists)) {
      this.lists.push(lists);
      for (let list of lists) {
        addList(list);
      }
    }
    }
    
    addList(list) {
        //add list implementation
    }
}
