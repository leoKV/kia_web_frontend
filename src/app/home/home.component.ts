import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
  tiposTags: TipoTagDTO[] = [];
  selectedTags: string[] = [];
  otrosForm: FormGroup;

  @ViewChild('otrosDropdown') otrosDropdown!: ElementRef;

  constructor(
    public cancionService: CancionService,
    private tagService: TagService,
    private fb: FormBuilder
  ) {
    this.otrosForm = this.fb.group({
      tags: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadAllCanciones();
    this.loadTipoTags();

  }

  loadAllCanciones() {
    this.cancionService.getAllCanciones().subscribe((data: CancionDTO[]) => {
      this.canciones = data;
      this.isFiltered = false;
      this.noResults = false;
    });
  }

  loadTipoTags() {
    this.tagService.getTagsByTipoTag().subscribe((data: TipoTagDTO[]) => {
      this.tiposTags = data;
    });
  }

  onTagsSelected(tags: number[]): void {
    this.selectedTags = tags.map(tag => tag.toString());
    if (tags.length === 0) {
      this.loadAllCanciones();
      return;
    }

    this.cancionService.getCancionesByTags(tags).subscribe((data: CancionTagDTO[]) => {
      this.cancionesByTags = data;
      this.isFiltered = true;
      this.noResults = data.length === 0;
      this.page = data.length > 0 ? 1 : 0;
    }, (error) => {
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

  //Agrege esta funcion para los combos
  onTagCheckChange(event: Event, tagString: string) {
    const formArray: FormArray = this.otrosForm.get('tags') as FormArray;

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      formArray.push(this.fb.control(tagString));
    } else {
      let index = formArray.controls.findIndex(x => x.value == tagString);
      formArray.removeAt(index);
    }

    // Convertimos tags de string a número si es necesario para onTagsSelected
    const tagIds = formArray.value.map((tag: string) => parseInt(tag.split(':')[0], 10));
    this.onTagsSelected(tagIds);
  }
}
