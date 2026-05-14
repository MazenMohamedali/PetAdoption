import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RecipeService } from '../../services/recipe';
import { ShoppingListService, ShoppingItem } from '../../services/shopping-list';
import { GramsToOuncesPipe } from '../../pipes/grams-to-ounces-pipe';

@Component({
  selector: 'app-recipe-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    GramsToOuncesPipe
  ],
  templateUrl: './recipe-detail-modal.html',
  styleUrl: './recipe-detail-modal.css'
})
export class RecipeDetailModalComponent implements OnInit {

  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<RecipeDetailModalComponent>);

  private recipeService = inject(RecipeService);
  private shoppingListService = inject(ShoppingListService);

  recipeDetail = signal<any>(null);
  isLoading = signal<boolean>(true);
  alreadyAdded = signal<boolean>(false);

 
  showInOunces = signal<boolean>(false);

  toggleUnit() {
    this.showInOunces.update(current => !current);
  }

  ngOnInit() {
    this.recipeService.getRecipeById(this.data.recipeId)
      .subscribe(detail => {
        this.recipeDetail.set(detail);
        this.isLoading.set(false);
      });
  }

  addToShoppingList() {
    const detail = this.recipeDetail();
    if (!detail) return;

    const items: ShoppingItem[] = detail.extendedIngredients.map(
      (ing: any) => ({
        ingredientId: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        recipeTitle: this.data.recipeTitle
      })
    );

    this.shoppingListService.addItems(items);
    this.alreadyAdded.set(true);
  }

  closeModal() {
    this.dialogRef.close();
  }
}