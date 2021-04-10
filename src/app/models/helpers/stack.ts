export class Stack<T>{
    
    items: T[];
    length: number;

    constructor(){
        this.items = [];
        this.length = 0;
    }

    push(element: T){
        this.items[this.length] = element;
        this.length++;
    }

    pop(){
        if(this.isEmpty()){
            return undefined;
        }
        this.length--;
        const result = this.items[this.length];
        delete this.items[this.length]; 
        return result;
    }

    peek(){
        if(this.isEmpty()){
            return undefined;
        }        
        return this.items[this.length - 1];
    }

    size(){
        return this.length;
    }

    clear(){
        this.items = [];
        this.length = 0;
    }

    isEmpty(){
        return this.length === 0;
    }



}