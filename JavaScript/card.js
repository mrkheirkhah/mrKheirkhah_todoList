class Card {
    constructor(cardObject) { 
        if (cardObject) { 
            this.task = cardObject.task;

            this.id = cardObject.id;

            if (cardObject.description)
                this.description = cardObject.description;
            
            if (cardObject.dueDate)
                this.dueDate = cardObject.dueDate;
            
            if (cardObject.checklist && Array.isArray(cardObject.checklist))
                this.checklist = cardObject.checklist;
            
            
                
                
        }
    }
}