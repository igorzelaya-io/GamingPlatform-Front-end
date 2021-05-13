
import { Match } from './match';
export class TreeNode {
    
    private _value: Match;
    
    public get value(): Match{
        return this._value;
    }

    public set value(value: Match){
        this._value = value;
    }

    private _root: TreeNode;

    public get root(): TreeNode{
        return this._root;
    }

    public set root(root: TreeNode){
        this._root = root;
    }

    private _left: TreeNode;

    public get left(): TreeNode{
        return this._left;
    }

    public set left(left: TreeNode){
        this._left = left;
    }

    private _right: TreeNode;

    public get right(): TreeNode{
        return this._right;
    }

    public set right(right: TreeNode){
        this._right = right;
    }
    
    constructor(){
        this._value = null;
        this._right = null;
        this._left = null;
        this._root = null;
    }

}