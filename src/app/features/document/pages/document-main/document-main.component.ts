import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CategoryService } from 'src/app/shared/services/category.service';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule, Location } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { MenuItem, TreeNode } from 'primeng/api';
import { DocumentService } from 'src/app/shared/services/document.service';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { groupByParentHierarchy } from 'src/app/shared/utils/group-by-parent-hierarchy';
import { TabMenuModule } from 'primeng/tabmenu';
import { debounceTime, Subscription } from 'rxjs';
import { UserService } from 'src/app/core/auth/services/user.service';
import { PaginatorModule } from 'primeng/paginator';

@Component({
    selector: 'app-document-main',
    templateUrl: './document-main.component.html',
    styleUrl: './document-main.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        TabViewModule,
        DataViewModule,
        InputTextModule,
        TreeSelectModule,
        MenubarModule,
        TabMenuModule,
        PaginatorModule,
    ],
})
export class DocumentMainComponent implements OnInit {
    constructor(
        private categoryService: CategoryService,
        private documentService: DocumentService,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService
    ) {}

    categories = [];

    docSrc: string;
    selectedCategory: TreeNode[];

    documents = [];

    selectedChild;

    tabItems: MenuItem[] | undefined = [
        { label: 'All', icon: 'pi pi-list', value: 'all' },
        { label: 'Release', icon: 'pi pi-file', value: 'release' },
        { label: 'Bookmark', icon: 'pi pi-bookmark', value: 'bookmark' },
        {
            label: 'Waiting for approval',
            icon: 'pi pi-clock',
            value: 'waiting',
        },
        { label: 'Archive', icon: 'pi pi-history', value: 'archive' },
    ];

    activeTab: MenuItem | undefined;

    filters: any = {
        status: '',
        category: '',
        page: 1,
        keyword: '',
        // limit: 2,
    };

    private subscriptions: Subscription = new Subscription();

    docLoading = false;

    currentUser;

    first = 0;
    rows = 0;
    totalRecords = 0;

    expandedId: number | null = null; // Holds the ID of the expanded document, or null if none is expanded.

    ngOnInit(): void {
        this.currentUser = this.userService.getUserData();

        const paramsSubscription = this.route.queryParams
            .pipe(debounceTime(300)) // Optional: debounce for performance
            .subscribe((params: Params) => {
                this.activeTab =
                    this.tabItems.filter(
                        (item) => item['value'] == params['status']
                    )[0] || this.tabItems[0];
                this.updateFiltersFromParams(params);
                this.fetchData();
            });

        this.subscriptions.add(paramsSubscription);

        this.categoryService
            .getCategoryByCurrentRole()
            .subscribe(({ error, value }) => {
                const mapped = value.data.map((item) => {
                    return {
                        ...item,
                        label: item.name,
                        id: item.id,
                    };
                });
                const grouped = groupByParentHierarchy(
                    mapped,
                    'items',
                    'parent_id',
                    'name',
                    (obj) => {
                        if (!obj.deepest) return;
                        this.selectedChild = obj;
                        this.filters.category = obj.id;
                        this.filters.keyword = '';
                        this.applyFilter();
                    }
                );
                this.categories = grouped;
            });
    }

    toggleShowMore(docId: number): void {
        this.expandedId = this.expandedId === docId ? null : docId; // Collapse if the same, expand otherwise.
    }

    goToDocument(id) {
        this.router.navigateByUrl(`/library/document/${id}`);
    }

    goToUpload() {
        this.router.navigateByUrl(`/library/upload`);
    }

    onActiveItemChange(event: MenuItem) {
        this.clearFilters();
        this.activeTab = event;
        this.filters.status = event['value'];
        // this.filters.category = '';
        // this.selectedChild = undefined;
        this.applyFilter();
    }

    onPageChange(evt) {
        console.log(evt);
        this.docLoading = true;
        this.filters.page = evt.page + 1;
        this.applyFilter();
    }

    fetchData(): void {
        this.docLoading = true;
        this.documentService
            .getDocuments(this.filters)
            .subscribe(({ error, value }) => {
                if (error) {
                    this.docLoading = false;
                    return;
                }
                this.documents = value.data;
                const meta = value.meta;

                this.totalRecords = meta['total'];
                this.first = (meta['currentPage'] - 1) * meta['perPage'];

                this.rows = meta['perPage'];

                this.docLoading = false;
            });
    }

    updateFiltersFromParams(params: Params): void {
        this.filters = {
            category: params['category'] || '',
            status: params['status'] || '',
            page: params['page'] || 1,
            keyword: params['keyword'] || '',
            // limit: params['limit'] || 2,
        };
    }

    applyFilter(): void {
        const queryParams: Params = {};

        if (this.filters.status) queryParams['status'] = this.filters.status;
        else queryParams['status'] = undefined;

        if (this.filters.category)
            queryParams['category'] = this.filters.category;
        else queryParams['category'] = undefined;

        if (this.filters.page) queryParams['page'] = this.filters.page;
        else queryParams['page'] = 1;

        if (this.filters.keyword) queryParams['keyword'] = this.filters.keyword;
        else queryParams['keyword'] = undefined;

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: queryParams,
            queryParamsHandling: 'merge',
        });
    }

    clearFilters(): void {
        this.filters = {
            status: '',
            category: '',
            page: 1,
            keyword: '',
        };

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            queryParamsHandling: 'merge',
        });
    }

    categoryIndicator() {
        let indicator = [
            ...(this.selectedChild?.hierarchy
                ? this.selectedChild.hierarchy
                : []),
        ];

        if (this.selectedChild?.name) indicator.push(this.selectedChild.name);

        if (indicator.length) {
            return indicator.join(' > ');
        } else {
            return 'All Category';
        }
    }
}
