import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { UserService } from 'src/app/core/auth/services/user.service';
import { BookmarkService } from 'src/app/shared/services/bookmark.service';
import { DocumentService } from 'src/app/shared/services/document.service';

@Component({
    selector: 'app-dashboard-main',
    standalone: true,
    imports: [CommonModule, ButtonModule, DataViewModule],
    templateUrl: './dashboard-main.component.html',
    styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent implements OnInit {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private bookmarkService: BookmarkService,
        private documentService: DocumentService,
        private router: Router,
        private userService: UserService
    ) {}

    newDocuments: any;
    bookmarks: any;
    approve: any;
    currentUser;

    ngOnInit() {
        this.currentUser = this.userService.getUserData();

        this.documentService
            .getDocuments({ status: 'announce', limit: 5 })
            .subscribe(({ error, value }) => {
                if (error) return;

                this.newDocuments = value.data;
            });

        this.documentService
            .getDocuments({ status: 'bookmark', limit: 5 })
            .subscribe(({ error, value }) => {
                if (error) return;

                this.bookmarks = value.data;
            });

        if (this.currentUser?.permissions.includes('approve-document')) {
            this.documentService
                .getDocuments({ status: 'approver', limit: 5 })
                .subscribe(({ error, value }) => {
                    if (error) return;

                    this.approve = value.data;
                });
        }

        // this.documentService
        //     .getDocuments({ status: 'approver', limit: 5 })
        //     .subscribe(({ error, value }) => {
        //         if (error) return;

        //         this.approve = value.data;
        //     });
    }

    getToken() {
        this.oidcSecurityService
            .checkAuth()
            .subscribe(
                ({
                    isAuthenticated,
                    userData,
                    accessToken,
                    idToken,
                    configId,
                }) => {
                    console.log(userData);
                }
            );
    }

    goToDocument(id) {
        this.router.navigateByUrl(`/library/document/${id}`);
    }
}
