import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, ButtonModule, SidebarModule],
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {
  isSidebarOpen = false;

  handleOpenSidebar(): void {
    this.isSidebarOpen = true;
  }

  handleCloseSidebar(): void {
    this.isSidebarOpen = false;
  }
}
