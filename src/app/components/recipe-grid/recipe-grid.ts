import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeCardComponent } from '../recipe-card/recipe-card';
import { Recipe } from '../../services/recipe';

@Component({
  selector: 'app-recipe-grid',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './recipe-grid.html',
  styleUrl: './recipe-grid.css'
})
export class RecipeGridComponent {

 
  @Input() recipes: Recipe[] = [];

}
