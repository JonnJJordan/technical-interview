import { Injectable } from '@angular/core';

@Injectable()
export class MathService {

  // Servicio encargado de las operaciones matematicas.

  add = (a: number, b: number) : number => a + b;

  subtract = (a: number, b: number) : number => a - b;

  multiply = (a: number, b: number) : number => a * b;

  divide = (a: number, b: number) : number => a / b;

  squareRoot = (a: number) : number => Math.sqrt(a);

  potency = (a: number, e: number) : number => Math.pow(a, e);

}
