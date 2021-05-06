import { Team } from './team';
export class Node {
    
    value: Team;
    leftNode: Node;
    rightNode: Node;

    constructor(){
        this.leftNode = undefined;
        this.rightNode = undefined;
        this.value = undefined;
    }

}