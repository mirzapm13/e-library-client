import { Component, OnInit } from '@angular/core';
import { JabatanService } from '../../services/jabatan.service';
import { SelectItem } from 'primeng/api/selectitem';
import { DepartmentService } from '../../services/department.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RolesService } from '../../services/role.service';
import { UsersService } from '../../services/users.service';

@Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrl: './new-user.component.scss',
})
export class NewUserComponent implements OnInit {
    newUserForm: FormGroup;

    constructor(
        private jabatanService: JabatanService,
        private departmentService: DepartmentService,
        private roleService: RolesService,
        private userService: UsersService,
        private fb: FormBuilder
    ) {
        this.newUserForm = this.fb.group({
            nama: [''],
            email: [''],
            password: [''],
            nik: [''],
            jabatan: [''],
            department: [''],
            role: [''],
        });
    }

    jabatan: SelectItem[];
    department: SelectItem[];
    role: SelectItem[];
    selectedJabatan: SelectItem = { value: '' };
    selectedDepartment: SelectItem = { value: '' };
    selectedRole: SelectItem = { value: '' };

    ngOnInit(): void {
        this.jabatanService.getJabatans().subscribe((item) => {
            if (item.value) {
                this.jabatan = item.value.map((jabatan) => {
                    return { label: jabatan.nama, value: jabatan.id };
                });
            } else {
                this.jabatan = [];
            }
        });

        this.departmentService.getDepartments().subscribe((item) => {
            if (item.value) {
                this.department = item.value.map((department) => {
                    return { label: department.nama, value: department.id };
                });
            } else {
                this.department = [];
            }
        });

        this.roleService.getRoles().subscribe((item) => {
            if (item.value) {
                this.role = item.value.map((role) => {
                    return { label: role.nama, value: role.id };
                });
            } else {
                this.role = [];
            }
        });
    }

    onSubmit() {
        if (this.newUserForm.valid) {
            console.log('Form Submitted:', this.newUserForm.value);
            let addedStatusdata = { ...this.newUserForm.value, status: false };
            this.userService
                .addUser(addedStatusdata)
                .subscribe((item) => console.log(item.value));
        } else {
            console.log('Form is invalid');
        }
    }

    jabatanOnChange() {
        console.log(this.selectedJabatan);
    }
}
