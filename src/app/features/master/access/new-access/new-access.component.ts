import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-new-role',
    standalone: true,
    imports: [
        ButtonModule,
        InputSwitchModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        TableModule,
        CheckboxModule,
    ],
    templateUrl: './new-access.component.html',
    styleUrl: './new-access.component.scss',
})
export class NewAccessComponent {
    newRoleForm: FormGroup;
    access = {
        view: true,
        upload: true,
        approve: true,
        edit: true,
    };

    constructor(private fb: FormBuilder, private location: Location) {
        this.newRoleForm = this.fb.group({
            // parent: [],
            // name: [''],
            // email: [''],
            // password: [''],
            // description: [''],
            // path: [''],
            // icon: [''],
            // order: [''],
            // status: [true],
            // role: [[]],
            name: [''],
            description: [''],
            status: [false],
            view: [true],
            upload: [false],
            approve: [false],
            edit: [false],
        });
    }

    clickBack() {
        this.location.back();
    }

    onSubmit() {}
}
