import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-daycare-layout',
  templateUrl: './daycare-layout.component.html',
  styleUrls: ['./daycare-layout.component.css']
})
export class DaycareLayoutComponent {
  sidebarOpen = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;

  @HostListener('window:resize')
  onResize(): void {
    this.sidebarOpen = window.innerWidth >= 768;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
  }
}
