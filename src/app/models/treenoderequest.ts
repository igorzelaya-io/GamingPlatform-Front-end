import { TreeNode } from './treenode';
import { Tournament } from './tournament/tournament';
export class TreeNodeRequest {
    treeNodeTree: TreeNode;
    treeNodeTournament: Tournament;

    constructor(treeNodeTree?: TreeNode, tournament?: Tournament){
        this.treeNodeTournament = tournament;
        treeNodeTree = treeNodeTree;
    }
}