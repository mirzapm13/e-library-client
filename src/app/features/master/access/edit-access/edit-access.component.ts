import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { RolesService } from 'src/app/shared/services/role.service';

@Component({
    selector: 'app-edit-access',
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
    templateUrl: './edit-access.component.html',
    styleUrl: './edit-access.component.scss',
})
export class EditAccessComponent implements OnInit {
    editRoleForm: FormGroup;
    id;

    constructor(
        private fb: FormBuilder,
        private location: Location,
        private roleService: RolesService,
        private route: ActivatedRoute
    ) {
        this.editRoleForm = this.fb.group({
            name: [null, Validators.required],
            description: [null, Validators.required],
        });
    }

    loading;

    ngOnInit(): void {
        this.loading = true;
        this.id = this.route.snapshot.paramMap.get('id');
        this.roleService
            .getRoleById(this.id)
            .subscribe(({ isLoading, error, value }) => {
                if (error) return;
                this.editRoleForm.patchValue(value.data);
                this.loading = false;
            });
    }

    clickBack() {
        this.location.back();
    }

    onSubmit() {
        this.loading = true;
        if (!this.editRoleForm.valid) {
            console.log('This is not valid');
            return;
        }
        // return;
        this.roleService
            .editRole(this.id, this.editRoleForm.value)
            .subscribe(({ isLoading, error, value }) => {
                this.loading = false;
                console.log(value.data);
            });
    }
}
