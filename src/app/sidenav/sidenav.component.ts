import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TagService } from '../services/tag/tag.service';
import { TipoTagDTO } from '../models/tipo-tag.dto';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit, OnChanges {
  @Input() sideNavStatus: boolean = false;
  @Output() tagsSelected = new EventEmitter<number[]>();

  list: any[] = []; //Inicializando lista de tags como vacía.
  selectedTags: Set<number> = new Set<number>();

  // Almacena el estado de los elementos seleccionados
  selectedStates: { [key: string]: Set<number> } = {};

  constructor(public tagService: TagService){}
  ngOnInit(): void {
    this.loadTags();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sideNavStatus']) {
      if (!changes['sideNavStatus'].currentValue) {
        this.closeAllSubmenus();
      }
    }
  }

  loadTags(): void {
    this.tagService.getTagsByTipoTag().subscribe((data: TipoTagDTO[]) => {
      this.list = data.map(tag => ({
        number: tag.tipo_tag_id.toString(),
        name: tag.tipo_tag,
        icon: this.getIconForTag(tag.tipo_tag),
        open: false,
        subItems: tag.tags.map(tagString => {
          const [id, name] = tagString.split(':');
          return { id: +id, name, selected: false };
        }),
        allSelected: false // Añadimos esta propiedad para gestionar la selección de "Todas"
      }));

      this.list.forEach(item => {
        if (!this.selectedStates[item.name]) {
          this.selectedStates[item.name] = new Set<number>();
        }
        item.subItems.forEach((subItem: { id: number, name: string, selected: boolean }) => {
          subItem.selected = this.selectedStates[item.name].has(subItem.id);
        });
        item.allSelected = this.selectedStates[item.name].size === 0; // Consideramos "Todas" seleccionada si no hay otros elementos seleccionados
      });
    });
  }

  getIconForTag(tipoTag: string): string {
    // Asigna iconos basados en el tipo de tag
    switch (tipoTag?.toLowerCase()) {
      case 'genero': return 'fa-solid fa-music';
      case 'ritmo': return 'fa-solid fa-compact-disc';
      case 'otro': return 'fa-solid fa-guitar';
      default: return 'fa-solid fa-tag';
    }
  }

  toggleSubmenu(item: any): void {
    if (this.sideNavStatus) {
      item.open = !item.open;
      // Restaurar estado de selección cuando se abre un submenú
      if (item.open) {
        this.restoreSelectedStates(item);
      }
    }
  }

  closeAllSubmenus(): void {
    this.list.forEach(item => item.open = false);
  }
  onTagChange(event: any, tagId: number, itemName: string): void {
    const grupo = this.list.find(item => item.name === itemName);

    if (event.target.checked) {
      if (event.target.type === 'radio') {
        grupo.subItems.forEach((subItem: { id: number, name: string, selected: boolean }) => {
          this.selectedTags.delete(subItem.id);
          this.selectedStates[itemName].delete(subItem.id);
          subItem.selected = false;
        });
        grupo.allSelected = false;
      }
      this.selectedTags.add(tagId);
      this.selectedStates[itemName].add(tagId);
    } else {
      this.selectedTags.delete(tagId);
      this.selectedStates[itemName].delete(tagId);
    }

    // Actualiza el estado de la opción "Todas"
    grupo.allSelected = this.selectedStates[itemName].size === 0;

    this.tagsSelected.emit(Array.from(this.selectedTags));
  }

  restoreSelectedStates(item: any): void {
    item.subItems.forEach((subItem: { id: number, selected: boolean }) => {
      subItem.selected = this.selectedStates[item.name].has(subItem.id);
    });
  }

  clearFilters(itemName: string): void {
    const grupo = this.list.find(item => item.name === itemName);
    grupo.subItems.forEach((subItem: { id: number, name: string, selected: boolean }) => {
      this.selectedTags.delete(subItem.id);
      this.selectedStates[itemName].delete(subItem.id);
      subItem.selected = false;
    });
    grupo.allSelected = true; // Marcamos "Todas" como seleccionada
    this.tagsSelected.emit(Array.from(this.selectedTags));
  }

}
