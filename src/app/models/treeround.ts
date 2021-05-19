import {TreeNode} from './treenode';
export class TreeRound {
    
    treeRoundNodes: TreeNode[];
    treeRoundLevel: number;

    constructor(treeRoundNodes?: TreeNode[], treeRoundLevel?: number){
        this.treeRoundLevel = treeRoundLevel;
        this.treeRoundNodes = treeRoundNodes;
    }

}