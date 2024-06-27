import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CancionDTO } from '../models/cancion.dto';
import { CancionTagDTO } from '../models/cancion-tag.dto';
import { CancionService } from '../services/cancion/cancion.service';
import { TagService } from '../services/tag/tag.service';
import { TipoTagDTO } from '../models/tipo-tag.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  sideNavStatus: boolean = false;
  canciones: CancionDTO[] = [];
  cancionesByTags: CancionTagDTO[] = [];
  page!: number;
  isFiltered: boolean = false;
  noResults: boolean = false;

  @Output() tagsSelected = new EventEmitter<number[]>();
  list: any[] = [];
  selectedTags: Set<number> = new Set<number>();

  constructor(
    public cancionService: CancionService,
    private tagService: TagService
  ) {}

  ngOnInit(): void {
    this.loadAllCanciones();
    this.loadTags();
  }

  loadAllCanciones() {
    this.cancionService.getAllCanciones().subscribe((data: CancionDTO[]) => {
      this.canciones = data;
      this.isFiltered = false;
      this.noResults = false;
    });
  }

  loadTags(): void {
    this.tagService.getTagsByTipoTag().subscribe((data: TipoTagDTO[]) => {
      this.list = data.map(tag => ({
        number: tag.tipo_tag_id.toString(),
        name: tag.tipo_tag,
        open: false,
        subItems: tag.tags.map(tagString => {
          const [id, name] = tagString.split(':');
          return { id: +id, name, selected: false };  // Aseguramos que 'selected' esté presente
        })
      }));
    });
  }

  onTagsSelected(tags: number[]): void {
    if (tags.length === 0) {
      this.loadAllCanciones(); // Si no hay etiquetas seleccionadas, cargar todas las canciones
      return;
    }

    this.cancionService.getCancionesByTags(tags).subscribe((data: CancionTagDTO[]) => {
      //console.log("Canciones filtradas:", data);

      this.cancionesByTags = data;
      this.isFiltered = true;
      this.noResults = data.length === 0; // Si no hay resultados, mostrar el mensaje de "sin resultados"

      // Actualizar el arreglo de canciones filtradas y los estados
      if (data.length > 0) {
        this.cancionesByTags = data;
        this.noResults = false;
        this.page=1;
      } else {
        this.cancionesByTags = [];
        this.noResults = true;
      }
    }, (error) => {
      //console.error("Error al filtrar canciones:", error);
      this.cancionesByTags = [];
      this.isFiltered = true;
      this.noResults = true;
    });
  }


  onSearch(event: Event | string): void {
    let searchTerm: string;
    if (typeof event === 'string') {
      searchTerm = event;
    } else {
      const inputElement = event.target as HTMLInputElement | null;
      searchTerm = inputElement?.value.trim() || '';
    }

    if (!searchTerm) {
      this.loadAllCanciones();
      return;
    }

    this.cancionService.getCancionesByNombre(searchTerm).subscribe((data: CancionDTO[]) => {
      if (data.length > 0) {
        this.canciones = data;
        this.isFiltered = false;
        this.noResults = false;
        this.page = 1;
      } else {
        this.canciones = [];
        this.isFiltered = true;
        this.noResults = true;
      }
    }, (error) => {
      this.canciones = [];
      this.isFiltered = true;
      this.noResults = true;
    });
  }

  isAllSelected(itemName: string): boolean {
    const grupo = this.list.find(item => item.name === itemName);
    if (!grupo) return false;
  
    return grupo.subItems.every((subItem: { selected: boolean }) => !subItem.selected);
  }

  onTagChange(event: any, tagId: number, itemName: string): void {
    const inputType = event.target.type;
    const grupo = this.list.find(item => item.name === itemName);
  
    if (inputType !== 'checkbox') {
      grupo.subItems.forEach((subItem: { id: number, selected: boolean }) => {
        this.selectedTags.delete(subItem.id);
        subItem.selected = false;
      });
      this.selectedTags.add(tagId);
      const selectedItem = grupo.subItems.find((subItem: { id: number }) => subItem.id === tagId);
      if (selectedItem) {
        selectedItem.selected = true;
      }
    } else {
      const isChecked = event.target.checked;
      const selectedItem = grupo.subItems.find((subItem: { id: number }) => subItem.id === tagId);
      if (isChecked) {
        this.selectedTags.add(tagId);
        if (selectedItem) {
          selectedItem.selected = true;
        }
      } else {
        this.selectedTags.delete(tagId);
        if (selectedItem) {
          selectedItem.selected = false;
        }
      }
    }
  
    const tagsArray = Array.from(this.selectedTags);
    this.tagsSelected.emit(tagsArray);
    this.onTagsSelected(tagsArray);
  }

  clearFilters(itemName: string): void {
    const grupo = this.list.find(item => item.name === itemName);
    grupo.subItems.forEach((subItem: { id: number, name: string, selected: boolean }) => {
      this.selectedTags.delete(subItem.id);
      subItem.selected = false;
    });
    this.tagsSelected.emit(Array.from(this.selectedTags));
    this.onTagsSelected(Array.from(this.selectedTags));
  }

}


