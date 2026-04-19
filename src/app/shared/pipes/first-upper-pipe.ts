import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstUpper',
  standalone: true,
})
export class FirstUpperPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
