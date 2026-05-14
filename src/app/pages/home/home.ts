import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar';
import { RecipeGridComponent } from '../../components/recipe-grid/recipe-grid';
import { ShoppingDrawerComponent } from '../../components/shopping-drawer/shopping-drawer';
import { ShoppingListService } from '../../services/shopping-list';
import { Recipe } from '../../services/recipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, RecipeGridComponent, ShoppingDrawerComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  shoppingListService = inject(ShoppingListService);
  recipes = signal<Recipe[]>([]);
  isLoading = signal<boolean>(false);
  isDrawerOpen = signal<boolean>(false);

  onRecipesFound(recipes: Recipe[]) {
    this.recipes.set(recipes);
  }

  onLoadingChange(loading: boolean) {
    this.isLoading.set(loading);
  }

  toggleDrawer() {
    this.isDrawerOpen.update(current => !current);
  }
}