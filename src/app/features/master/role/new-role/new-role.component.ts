import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';

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
    ],
    templateUrl: './new-role.component.html',
    styleUrl: './new-role.component.scss',
})
export class NewRoleComponent {
    newRoleForm: FormGroup;

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
            status: [true],
        });
    }

    clickBack() {
        this.location.back();
    }

    onSubmit() {}
}
