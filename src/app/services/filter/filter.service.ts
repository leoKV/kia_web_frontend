import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  
  private selectedTags: Set<number> = new Set<number>();

  getSelectedTags():number[]{
    return Array.from(this.selectedTags);
  }

  setSelectedTags(tags: number[]): void {
    this.selectedTags = new Set(tags);
  }

  clearSelectedTags(): void {
    this.selectedTags.clear();
  }
}
