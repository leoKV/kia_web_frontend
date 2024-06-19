import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() sideNavToggled = new EventEmitter<boolean>();
  @Output() search = new EventEmitter<string>(); 
  @Input() showElements: string[] = [];
  @Input() headerClass: string = '';
  menuStatus: boolean = false;
  searchTerm: string = '';  // Término de búsqueda
  
  SideNavToggle(){
    this.menuStatus = !this.menuStatus;
    this.sideNavToggled.emit(this.menuStatus);
  }

  onSearch(){
   console.log(this.searchTerm);
   this.search.emit(this.searchTerm);  // Emitir el término de búsqueda
  }

  onSearchInput() {
    if (!this.searchTerm.trim()) {
      this.search.emit('');
    }
    this.searchTerm = this.searchTerm.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 50);
  }
}
