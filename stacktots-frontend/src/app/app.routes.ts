import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ParentalDashboardComponent } from './components/parental-dashboard/parental-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';

export const routes: Routes = [
    { path: '', component: LandingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'parental-dashboard', component: ParentalDashboardComponent },
    { path: 'admin-dashboard', component: AdminDashboardComponent },
    { path: 'rewards', component: RewardsComponent },
    { path: 'subscription', component: SubscriptionComponent }
];
