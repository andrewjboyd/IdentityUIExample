import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UserClaims } from './user-claims/user-claims';
import { UserRoles } from './user-roles/user-roles';
import { RolesComponent } from './roles/roles.component';
import { RoleFormComponent } from './role-form/role-form.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/:userId/claims',
    component: UserClaims,
  },
  {
    path: 'users/:userId/roles',
    component: UserRoles,
  },
  {
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'roles/new',
    component: RoleFormComponent,
  },
  {
    path: 'roles/:roleId/edit',
    component: RoleFormComponent,
  },
];
