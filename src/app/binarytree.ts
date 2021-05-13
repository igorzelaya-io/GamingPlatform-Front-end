import { TreeNode } from "./models/treenode";

export class BinaryTree {
    
    private _root: TreeNode;

    public get root(): TreeNode{
       return this._root; 
    }

    public set root(root: TreeNode){
        this._root = root;   
    }

    constructor(){
        this._root = null;    
    }
}