import { TreeRound } from './treeround';

export class BinaryTree {
    
    binaryTreeRounds: TreeRound[];
    binaryTreeNumberOfRounds: number;

    constructor(binaryTreeRounds?: TreeRound[], binaryTreeNumberOfRounds?: number){
        this.binaryTreeRounds = binaryTreeRounds;
        this.binaryTreeNumberOfRounds = binaryTreeNumberOfRounds;
    }

}