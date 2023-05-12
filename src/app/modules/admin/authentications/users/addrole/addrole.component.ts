import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';



export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

const TREE_DATA = {
  Roles: {
    'Roles 1': null,
    'Roles 2': null,
    'Roles 3': null,
    'Roles 4': {
      'Roles 4.1': null,
      'Roles 4.2': {
        'Roles 4.2.1' : null,
        'Roles 4.2.2' : null
      }
    },
  },
 
};



@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize() {
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  private checkboxValues: Map<string, boolean> = new Map();


  setCheckboxValue(key: string, value: boolean): void {
    this.checkboxValues.set(key, value);
  }

  getCheckboxValue(key: string): boolean {
    return this.checkboxValues.get(key) || false;
  }
  
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}




@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrls: ['./addrole.component.scss'],
  providers: [ChecklistDatabase],
})
export class AddroleComponent {
  

  RolesArr = [];
  checkboxService: any;




  ngOnInit(): void { }

  @Input() drawerClose3: Function;
 

  close() {
    this.drawerClose3();
  }



 /** Map from flat node to nested node. This helps us finding the nested node to be modified */
 flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

 /** Map from nested node to flattened node. This helps us to keep the same object for selection */
 nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
 selectedParent: TodoItemFlatNode | null = null;

 /** The new item's name */
 newItemName = '';

 treeControl: FlatTreeControl<TodoItemFlatNode>;

 treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

 dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
 checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

 constructor(private _database: ChecklistDatabase) {
   this.treeFlattener = new MatTreeFlattener(
     this.transformer,
     this.getLevel,
     this.isExpandable,
     this.getChildren,
   );
   this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
   this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

   _database.dataChange.subscribe(data => {
     this.dataSource.data = data;
   });
 }

 getLevel = (node: TodoItemFlatNode) => node.level;

 isExpandable = (node: TodoItemFlatNode) => node.expandable;

 getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

 hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

 hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

 /**
  * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
  */
 transformer = (node: TodoItemNode, level: number) => {
   const existingNode = this.nestedNodeMap.get(node);
   const flatNode =
     existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
   flatNode.item = node.item;
   flatNode.level = level;
   flatNode.expandable = !!node.children?.length;
   this.flatNodeMap.set(flatNode, node);
   this.nestedNodeMap.set(node, flatNode);
   return flatNode;
 };

 /** Whether all the descendants of the node are selected. */
 descendantsAllSelected(node: TodoItemFlatNode): boolean {
   
   const descendants = this.treeControl.getDescendants(node);
   const descAllSelected =
   descendants.length > 0 &&
   descendants.every(child => {
    //  console.log(this.checklistSelection.isSelected(child) , 'descAllSelected');
     return this.checklistSelection.isSelected(child);
    });
   return descAllSelected;
 }

 /** Whether part of the descendants are selected */
 descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
  // console.log(node);
  
   const descendants = this.treeControl.getDescendants(node);
   const result = descendants.some(child => this.checklistSelection.isSelected(child));
   return result && !this.descendantsAllSelected(node);
 }

 /** Toggle the to-do item selection. Select/deselect all the descendants node */
 todoItemSelectionToggle(node: TodoItemFlatNode): void {
  // console.log(node , 'todoItemSelectionToggle');
  // this.RolesArr.push(node.item);
  // console.log(this.RolesArr);
  
   this.checklistSelection.toggle(node);
   const descendants = this.treeControl.getDescendants(node);
   this.checklistSelection.isSelected(node)
     ? this.checklistSelection.select(...descendants)
     : this.checklistSelection.deselect(...descendants);

   // Force update for the parent
   descendants.forEach(child => this.checklistSelection.isSelected(child));
   this.checkAllParentsSelection(node);
 }

 /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
 todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
  // console.log(node, 'todoLeafItemSelectionToggle');
  // this.RolesArr.push(node.item);
  // console.log(this.RolesArr);
  
   this.checklistSelection.toggle(node);
   this.checkAllParentsSelection(node);
 }

 /* Checks all the parents when a leaf node is selected/unselected */
 checkAllParentsSelection(node: TodoItemFlatNode): void {
   let parent: TodoItemFlatNode | null = this.getParentNode(node);
   while (parent) {
     this.checkRootNodeSelection(parent);
     parent = this.getParentNode(parent);
   }
 }

 /** Check root node checked state and change it accordingly */
 checkRootNodeSelection(node: TodoItemFlatNode): void {
   const nodeSelected = this.checklistSelection.isSelected(node);
   const descendants = this.treeControl.getDescendants(node);
   const descAllSelected =
     descendants.length > 0 &&
     descendants.every(child => {
       return this.checklistSelection.isSelected(child);
     });
   if (nodeSelected && !descAllSelected) {
     this.checklistSelection.deselect(node);
   } else if (!nodeSelected && descAllSelected) {
     this.checklistSelection.select(node);
   }
 }

 /* Get the parent node of a node */
 getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
   const currentLevel = this.getLevel(node);

   if (currentLevel < 1) {
     return null;
   }

   const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

   for (let i = startIndex; i >= 0; i--) {
     const currentNode = this.treeControl.dataNodes[i];

     if (this.getLevel(currentNode) < currentLevel) {
       return currentNode;
     }
   }
   return null;
 }

 rolesArray :any;
 changeNode(checked: boolean, item: string) {
  let checkedItems = this.checklistSelection.selected.map(node => node.item);
  if (checked) {
    checkedItems.push(item);
  } else {
    checkedItems = checkedItems.filter(i => i !== item);
  }
console.log(checkedItems);
this.rolesArray = checkedItems;

  localStorage.setItem('rolesArray',JSON.stringify(checkedItems));


 }
 



}
