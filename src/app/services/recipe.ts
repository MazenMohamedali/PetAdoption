import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}


export interface RecipeSearchResult {
  results: Recipe[];
  totalResults: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {


  private http = inject(HttpClient);

  private apiKey = environment.spoonacularApiKey;
  private baseUrl = 'https://api.spoonacular.com/recipes';

 
  searchRecipes(query: string): Observable<RecipeSearchResult> {
    const url = `${this.baseUrl}/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${this.apiKey}`;
    return this.http.get<RecipeSearchResult>(url);
  }


  getRecipeById(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/information?apiKey=${this.apiKey}`;
    return this.http.get<any>(url);
  }

}