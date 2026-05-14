import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListService } from '../../services/shopping-list';
import { GramsToOuncesPipe } from '../../pipes/grams-to-ounces-pipe';

@Component({
  selector: 'app-shopping-drawer',
  standalone: true,
  imports: [CommonModule, GramsToOuncesPipe],
  templateUrl: './shopping-drawer.html',
  styleUrl: './shopping-drawer.css'
})
export class ShoppingDrawerComponent {


  @Input() isOpen: boolean = false;



  @Output() closeDrawer = new EventEmitter<void>();

  shoppingListService = inject(ShoppingListService);

 
  showInOunces = signal<boolean>(false);


  toggleUnit() {
    this.showInOunces.update(current => !current);
  }


  get groupedItems() {
    const items = this.shoppingListService.shoppingItems();

    // reduce builds an object where each key is a recipe title
    // and the value is an array of ingredients from that recipe
    return items.reduce((groups: any, item) => {
      if (!groups[item.recipeTitle]) {
        groups[item.recipeTitle] = [];
      }
      groups[item.recipeTitle].push(item);
      return groups;
    }, {});
  }

  // returns the recipe titles as an array so we can loop over them in html
  get recipeGroups(): string[] {
    return Object.keys(this.groupedItems);
  }

  onClose() {
    this.closeDrawer.emit();
  }

  clearAll() {
    this.shoppingListService.clearAll();
  }

  removeItem(ingredientId: number) {
    this.shoppingListService.removeItem(ingredientId);
  }
}