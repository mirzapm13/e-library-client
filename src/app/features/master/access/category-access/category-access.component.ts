import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { UserService } from 'src/app/core/auth/services/user.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { RolesService } from 'src/app/shared/services/role.service';
import { groupByParent } from 'src/app/shared/utils/group-by-parent';

@Component({
    selector: 'app-category-access',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        InputTextModule,
        DropdownModule,
        DividerModule,
        TreeSelectModule,
        TreeTableModule,
        TreeModule,
        CheckboxModule,
    ],
    templateUrl: './category-access.component.html',
    styleUrl: './category-access.component.scss',
})
export class CategoryAccessComponent implements OnInit {
    categoryAccessForm: FormGroup;
    categoryOptions = [];
    cols = [
        { field: 'label', header: 'Category' },
        { field: 'access', header: 'Access' },
    ];
    categories: [];

    selectedNodes = [];
    id;
    partiallySelectedIds = []; // Holds IDs of partially selected nodes
    roleName;

    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private roleService: RolesService,
        private notify: NotifyService
    ) {
        this.categoryAccessForm = this.fb.group({
            selectedCategory: [[]],
        });
    }
    loading = false;

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');

        this.categoryService
            .getCategoryByRoleId(this.id)
            .subscribe(({ error, value }) => {
                this.categories = value.data.map((item) => ({
                    ...item,
                    key: item.id,
                    data: item,
                }));

                this.categoryOptions = groupByParent(
                    this.categories,
                    'children'
                );

                this.selectedNodes = value.data
                    .filter((item) => item.active)
                    .map((item) => ({
                        ...item,
                        key: item.id,
                        data: item,
                    }));

                this.roleService
                    .getRoleById(this.id)
                    .subscribe(({ isLoading, error, value }) => {
                        if (error) return;
                        this.roleName = value.data.name;
                        this.loading = false;
                    });
            });
    }

    clickBack() {
        this.router.navigateByUrl('/master-data/access');
    }

    showNodes() {
        let mappedNodes = this.selectedNodes.map((item) => item.id);
        this.partiallySelectedIds = this.getPartialSelectedIds(
            this.categoryOptions
        );

        mappedNodes = [...mappedNodes, ...this.partiallySelectedIds];
        // console.log(mappedNodes);
    }

    onSubmit() {
        let mappedNodes = this.selectedNodes.map((item) => item.id);
        this.partiallySelectedIds = this.getPartialSelectedIds(
            this.categoryOptions
        );

        mappedNodes = [...mappedNodes, ...this.partiallySelectedIds];

        mappedNodes = [...new Set(mappedNodes)];

        let payload = {
            role_id: this.id,
            category_ids: mappedNodes,
        };

        this.roleService
            .assignRoleCategory(payload)
            .subscribe(({ error, value }) => {
                if (error) {
                    this.notify.alert('error', error.message);
                    this.loading = false;
                    return;
                }

                this.notify.alert('success', value.message);
                this.loading = false;
            });
    }

    nodeSelect(event) {
        const selectedNode = event.node;

        // Traverse up the tree and select all parent nodes
        this.selectParentNodes(selectedNode);
    }

    selectParentNodes(node: any) {
        if (node.parent) {
            const parent = node.parent;

            // Add the parent to selection if not already selected
            if (!this.selectedNodes.includes(parent)) {
                this.selectedNodes.push(parent);
            }

            // Recursively process the parent of the current parent
            this.selectParentNodes(parent);
        }
    }

    getPartialSelectedIds(nodes: any[]): number[] {
        const partialIds: number[] = [];

        // Recursive helper function
        function collectPartials(node: any) {
            if (node.partialSelected) {
                partialIds.push(node.data.id); // Add node ID if partially selected
            }

            // Traverse children if present
            if (node.children && node.children.length) {
                node.children.forEach(collectPartials);
            }
        }

        // Traverse all root nodes
        nodes.forEach(collectPartials);

        return partialIds;
    }
}
