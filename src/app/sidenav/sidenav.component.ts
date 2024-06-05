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
  constructor(
    public tagService: TagService
  ){}
  ngOnInit(): void {
    this.loadTags();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['sideNavStatus'] && !changes['sideNavStatus'].currentValue){
      this.closeAllSubmenus();
    }
  }

  loadTags():void{
    this.tagService.getTagsByTipoTag().subscribe((data: TipoTagDTO[]) => {
      this.list = data.map(tag => ({
        number: tag.tipo_tag_id.toString(),
        name: tag.tipo_tag,
        icon: this.getIconForTag(tag.tipo_tag),
        open: false,
        subItems: tag.tags.map(tagString => {
          const [id, name] = tagString.split(':');
          return { id,name };
        })
      }));
    });
  }

  getCancionesByTags(id: number){
    console.log(id);
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
    }
  }

  closeAllSubmenus(): void {
    this.list.forEach(item => item.open = false);
  }

  onTagChange(event: any, tagId: number): void {
    if (event.target.checked) {
      this.selectedTags.add(tagId);
    } else {
      this.selectedTags.delete(tagId);
    }
    this.tagsSelected.emit(Array.from(this.selectedTags));
  }
}
