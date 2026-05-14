import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Recipe } from '../../services/recipe';
import { ShoppingListService } from '../../services/shopping-list';
import { FavouritesService } from '../../services/favourites';
import { RecipeDetailModalComponent } from '../recipe-detail-modal/recipe-detail-modal';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css'
})
export class RecipeCardComponent {

  @Input() recipe!: Recipe;
  @Input() showRemoveButton: boolean = false;

  private dialog = inject(MatDialog);
  private shoppingListService = inject(ShoppingListService);
  favouritesService = inject(FavouritesService);

  openModal() {
    this.dialog.open(RecipeDetailModalComponent, {
      data: { recipeId: this.recipe.id, recipeTitle: this.recipe.title },
      width: '700px',
      maxHeight: '90vh'
    });
  }

  toggleFavourite(event: Event) {
    event.stopPropagation();
    this.favouritesService.toggleFavourite(this.recipe);
  }

  removeFavourite(event: Event) {
    event.stopPropagation();
    this.favouritesService.removeFromFavourites(this.recipe.id);
  }
}