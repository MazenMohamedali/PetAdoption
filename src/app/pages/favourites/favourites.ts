import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouritesService } from '../../services/favourites';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [CommonModule, RecipeCardComponent],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css'
})
export class FavouritesComponent {

 
  favouritesService = inject(FavouritesService);

}