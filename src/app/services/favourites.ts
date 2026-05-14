import { Injectable, signal, computed } from '@angular/core';
import { Recipe } from './recipe';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {


  // starts empty, updates when user clicks the heart icon
  private favourites = signal<Recipe[]>([]);


  readonly favouriteRecipes = computed(() => this.favourites());


  readonly favouriteCount = computed(() => this.favourites().length);


  isFavourited(recipeId: number): boolean {
    return this.favourites().some(r => r.id === recipeId);
  }


  toggleFavourite(recipe: Recipe) {
    const alreadyFavourited = this.isFavourited(recipe.id);

    if (alreadyFavourited) {

      this.favourites.update(current =>
        current.filter(r => r.id !== recipe.id)
      );
    } else {

      this.favourites.update(current => [...current, recipe]);
    }
  }


  removeFromFavourites(recipeId: number) {
    this.favourites.update(current =>
      current.filter(r => r.id !== recipeId)
    );
  }
}