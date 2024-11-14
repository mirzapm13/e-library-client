import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RolesService } from 'src/app/shared/services/role.service';

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

    constructor(
        private fb: FormBuilder,
        private location: Location,
        private roleService: RolesService
    ) {
        this.newRoleForm = this.fb.group({
            name: [null, Validators.required],
            description: [null, Validators.required],
        });
    }
    loading = false;

    clickBack() {
        this.location.back();
    }

    onSubmit() {
        this.loading = true;
        if (!this.newRoleForm.valid) {
            console.log('This is not valid');
            return;
        }
        this.roleService
            .addRole(this.newRoleForm.value)
            .subscribe(({ isLoading, error, value }) => {
                this.loading = false;
                console.log(value.data);
            });
    }
}
