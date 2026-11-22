import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

@Component({
  selector: 'app-daycare-sidebar',
  templateUrl: './daycare-sidebar.component.html',
  styleUrls: ['./daycare-sidebar.component.css']
})
export class DaycareSidebarComponent {
  @Input() collapsed = false;
  @Output() navigate = new EventEmitter<void>();

  @HostBinding('class.collapsed')
  get isCollapsed(): boolean {
    return this.collapsed;
  }
}
