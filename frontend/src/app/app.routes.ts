import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { userResolver } from '@core/resolvers/user.resolver';
import { AppLayoutComponent } from '@shared/components/app-layout/app-layout.component';
import { adminGuard } from './features/admin/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    resolve: {
      user: userResolver,
    },
    children: [
      {
        path: '',
        redirectTo: 'workouts',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        title: 'Perfil - Unifit',
        loadChildren: () =>
          import('./features/profile/profile.module').then(
            m => m.ProfileModule
          ),
      },
      {
        path: 'workouts',
        title: 'Treinos - Unifit',
        loadChildren: () =>
          import('./features/workouts/workouts.module').then(
            m => m.WorkoutsModule
          ),
      },
      {
        path: 'admin',
        title: 'Admin - Unifit',
        loadChildren: () =>
          import('./features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [adminGuard],
      },
    ],
  },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
