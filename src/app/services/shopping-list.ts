import { Injectable, signal, computed } from '@angular/core';

export interface ShoppingItem {
  ingredientId: number;
  name: string;
  amount: number;
  unit: string;
  recipeTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {


  private items = signal<ShoppingItem[]>([]);


  readonly shoppingItems = computed(() => this.items());


  readonly itemCount = computed(() => this.items().length);

  addItems(newItems: ShoppingItem[]) {
    this.items.update(current => [...current, ...newItems]);
  }

  removeItem(ingredientId: number) {
    this.items.update(current =>
      current.filter(item => item.ingredientId !== ingredientId)
    );
  }

  clearAll() {
    this.items.set([]);
  }
}