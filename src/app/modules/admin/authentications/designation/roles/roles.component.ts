import {
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    Input,
    EventEmitter,
    Output,
    Injectable,
    AfterViewInit,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    FormControl,
    NgForm,
    Validators,
    FormGroup,
    FormBuilder,
    AbstractControl,
} from '@angular/forms';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { detailView } from '../detailview/detailview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatAccordion } from '@angular/material/expansion';
import { ThemePalette } from '@angular/material/core';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { FuseAlertModule } from '@fuse/components/alert';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import {
    MatTreeFlatDataSource,
    MatTreeFlattener,
    MatTreeNestedDataSource,
} from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { values } from 'lodash';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher/media-watcher.service';

import { designationMaster } from '../adddetails/adddetails';

export interface Task {
    name: string;
    completed: boolean;
    color: ThemePalette;
    subtasks?: Task[];
}

/**
 * Node for to-do item
 */

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

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
    Roles: {
        'Role 1': null,
        'Role 2': null,
        'Role 3': null,
        'Roles 4': {
            'Role 4.1': null,
            'Role 4.2': ['Role 4.2.1', 'Role 4.2.2'],
        },
    },
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */

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
        // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
        //     file node as children.
        const data = this.buildFileTree(TREE_DATA, 0);

        // Notify the change.
        this.dataChange.next(data);
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `TodoItemNode`.
     */
    buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
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
}
@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
    providers: [ChecklistDatabase],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RolesComponent implements OnInit {
    panelOpenState = false;

    @ViewChild(MatAccordion) accordion: MatAccordion;
    selectedProduct: detailView | null = null;
    @Input() data: designationMaster;
    // dataSource = new MatTableDataSource<detailView>(ELEMENT_DATA);
    @Input() drawerClose: Function;
    @Input() show: any;

    productForm: UntypedFormGroup;
    showAlert: boolean = false;
    dialog: any;
    selection: any;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private notifier: FuseAlertService,
        private database: ChecklistDatabase,
        private _snackBar: MatSnackBar,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {
        // this.initForm();
        // this.dataSource.data = TREE_DATA;
        this.treeFlattener = new MatTreeFlattener(
            this.transformer,
            this.getLevel,
            this.isExpandable,
            this.getChildren
        );
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
            this.getLevel,
            this.isExpandable
        );

        this.dataSource = new MatTreeFlatDataSource(
            this.treeControl,
            this.treeFlattener
        );

        database.dataChange.subscribe((data) => {
            this.dataSource.data = data;
        });
    }
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isdisable = true;
    isScreenSmall: boolean;
    ngOnInit(): void {
        for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
            if (this.treeControl.dataNodes[i].item == 'Roles 4') {
                // this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
                this.treeControl.expand(this.treeControl.dataNodes[i]);
            }
            if (this.treeControl.dataNodes[i].item == 'Roles') {
                this.treeControl.expand(this.treeControl.dataNodes[i]);
            }
        }

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    trackByFn(index: number, item: any): any {
        return item.ID || index;
    }

    toggleDetails(productId: string): void {
        // If the product is already selected...
        if (this.selectedProduct && this.selectedProduct.ID === productId) {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        // this._inventoryService.getProductById(productId)
        //     .subscribe((product) => {

        //         // Set the selected product
        //         this.selectedProduct = product;

        //         // Fill the form
        //         this.selectedProductForm.patchValue(product);

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
    }

    /****Drawer Close ****/
    close() {
        this.drawerClose();
    }

    /****Message Service *****/
    openSnackBar(msg: string, type) {
        this._snackBar.open(msg, '', {
            horizontalPosition: 'right',

            verticalPosition: 'top',

            duration: 3000,

            panelClass: type == 'E' ? 'style-error' : 'style-success',
        });
    }

    @Output() DataDetails = new EventEmitter<any>();

    allComplete: boolean = false;

    mathFormGroup: FormGroup;
    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

    /** A selected parent node to be inserted */
    selectedParent: TodoItemFlatNode | null = null;

    /** The new item's name */
    newItemName = '';

    treeControl: FlatTreeControl<TodoItemFlatNode>;

    treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

    dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<TodoItemFlatNode>(
        true /* multiple */
    );

    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) =>
        _nodeData.item === '';

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: TodoItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode =
            existingNode && existingNode.item === node.item
                ? existingNode
                : new TodoItemFlatNode();
        flatNode.item = node.item;
        flatNode.level = level;
        flatNode.expandable = !!node.children;
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    };

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every((child) =>
            this.checklistSelection.isSelected(child)
        );
        return descAllSelected;
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some((child) =>
            this.checklistSelection.isSelected(child)
        );
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: TodoItemFlatNode): void {
        console.log(this.treeControl);
        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every((child) => this.checklistSelection.isSelected(child));
        this.checkAllParentsSelection(node);
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
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
        const descAllSelected = descendants.every((child) =>
            this.checklistSelection.isSelected(child)
        );
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

    /****reset the selection in the tree */
    resettree() {
        this.checklistSelection = new SelectionModel<TodoItemFlatNode>(
            true /* multiple */
        );
    }

    //create the tree
    createtree() {
        this.resettree();
        this.close();
        // if(this.checklistSelection.selected==null||this.checklistSelection.selected==undefined){
        //   this.openSnackBar("Please select the Role..", 'E');

        // }
        // console.log(this.checklistSelection.deselect(node))
        // console.log(this.checklistSelection.selected.length)
        // console.log(this.checklistSelection.isSelected(node))
        // console.log(this.todoItemSelectionToggle)
        this.openSnackBar('Roles applied Successfully..', '');
    }
}
