class List {
    constructor(title, description, id, cards) { 
        this.id = id;

        if(title && title !== "")
            this.title = title;
        
        if (description && description !== "")
            this.description = description;
        
        if (cards && Array.isArray(cards)) { 
            this.cards = cards;

            for (let card of cards) {
                addCard(card);
            }
        }
    }

    addCard() {
        //add card implementation
    }
}