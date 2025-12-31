import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UserClaims } from './user-claims/user-claims';
import { UserRoles } from './user-roles/user-roles';

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
];
