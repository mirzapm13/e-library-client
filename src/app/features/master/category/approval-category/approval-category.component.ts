import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TreeSelectModule } from 'primeng/treeselect';
import { Subject } from 'rxjs';
import { CategoryService } from 'src/app/shared/services/category.service';
import { NotifyService } from 'src/app/shared/services/notify.service';
import { UserListService } from 'src/app/shared/services/user-list.service';

@Component({
    selector: 'app-approval-category',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputSwitchModule,
        InputTextModule,
        TreeSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MultiSelectModule,
        TableModule,
        AutoCompleteModule,
    ],

    templateUrl: './approval-category.component.html',
    styleUrl: './approval-category.component.scss',
})
export class ApprovalCategoryComponent implements OnInit {
    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private categoryService: CategoryService,
        private userListService: UserListService,
        private notify: NotifyService
    ) {}
    id;
    category;
    userList = [];

    selectedUser: any;
    results = [];
    searchSub = new Subject<string>();

    userOptions = [];
    categoryName = '';

    loading = false;

    ngOnInit(): void {
        this.loading = true;
        this.id = this.route.snapshot.paramMap.get('id');

        this.categoryService
            .getCategoryById(this.id)
            .subscribe(({ isLoading, error, value }) => {
                if (error) return;

                this.category = value.data;
                this.categoryName = value.data.name;
                this.userList = value.data.users;
            });

        this.userListService
            .getUserList()
            .subscribe(({ error, isLoading, value }) => {
                this.userOptions = value.data;
            });

        this.loading = false;
    }

    search(evt) {
        this.results = this.userOptions.filter((item) =>
            item.name.toLowerCase().includes(evt.query.toLowerCase())
        );
    }

    clickBack() {
        this.location.back();
    }

    addUser() {
        if (!this.selectedUser.id) return;
        if (this.userList.some((item) => item.id == this.selectedUser.id)) {
            this.notify.alert('error', 'Data already exist!');
            return;
        }
        console.log(this.selectedUser);
        this.userList.push(this.selectedUser);
    }

    delete(idx) {
        this.userList.splice(idx, 1);
    }

    onSubmit() {
        this.loading = true;
        let payload = {
            category_id: this.id,
            users: this.userList.map((item, idx) => ({
                id: item.id,
                order: idx + 1,
            })),
        };

        this.categoryService
            .assignCategoryUser(payload)
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
}
