import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ElementRef, 
  ViewChild, 
  Output, 
  EventEmitter,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, switchMap, map, takeUntil, filter } from 'rxjs/operators';
import { RecipeService, Recipe } from '../../services/recipe';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css'
})
export class SearchBarComponent implements OnInit, OnDestroy {


  @ViewChild('searchInput', { static: true }) 
  searchInput!: ElementRef<HTMLInputElement>;

  // @Output sends the results UP to the parent (home page)
  @Output() 
  recipesFound = new EventEmitter<Recipe[]>();

  @Output() 
  loadingChange = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();

  private recipeService = inject(RecipeService);

  ngOnInit() {
    
    fromEvent<InputEvent>(this.searchInput.nativeElement, 'input')

     
      .pipe(
        map(event => (event.target as HTMLInputElement).value.trim()),

        
        filter(query => query.length > 2),

       
        debounceTime(400),

        
        switchMap(query => {
          this.loadingChange.emit(true); // tell parent "loading started"
          return this.recipeService.searchRecipes(query);
        }),

        
        takeUntil(this.destroy$)
      )
      .subscribe(result => {
        this.loadingChange.emit(false); // tell parent "loading done"
        this.recipesFound.emit(result.results); // send recipes to parent
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}