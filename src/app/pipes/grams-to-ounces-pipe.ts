import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gramsToOunces',
  standalone: true
})
export class GramsToOuncesPipe implements PipeTransform {

  transform(value: number, unit: string): string {
    if (unit === 'g' || unit === 'grams') {
      const ounces = (value * 0.035274).toFixed(1);
      return `${ounces} oz`;
    }
    return `${value} ${unit}`;
  }

}