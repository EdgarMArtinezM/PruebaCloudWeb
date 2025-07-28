import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status',
  standalone: false
})
export class StatusPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    let status: any = {
      available: "ACTIVO",
      unavailable: "INACTIVO"
    }
    let statusResult = status[value];
    return statusResult
  }

}
