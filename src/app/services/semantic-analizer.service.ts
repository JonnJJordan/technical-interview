import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class SemanticAnalizerService {

  // Servicio encargado de todas las operaciones semanticas que se necesiten.

  // Declaracion de las propiedades del servicio

  private operations : string;
  private result : string;
  private valid_keys : RegExp;
  private valid_operators : RegExp;

  // Inicializacion de las propiedades.

  constructor() { 

    this.operations = '';
    this.result = '';
    this.valid_keys =  /[\d\.]/;
    this.valid_operators = /[\(\)\+\-\*\^\%\/]/;

  }

  // Metodo para obtener todas las operaciones que se estan llevando a cabo.

  getOperations = () : string => this.operations;

  // Metodo para obtener el resultado parcial de la operacion.

  getResult = () : string => this.result;

  // Metodo para eliminar el resultado parcial.

  deleteResult = () : void => {
    this.result = '';
  }

  // Metodo para eliminar las operaciones.

  deleteOperations = () : void => {
    this.operations = '';
  }

  // Numero de operaciones registradas.

  getOperationsCount = () : number => this.operations.match(new RegExp(this.valid_operators, 'g')).length;

  // Metodo para agregar el operador, solo si aun no se ha seleccionado uno o si la ultima tecla seleccionada era un operador, lo sustituye.

  addKey = (key: string) : boolean => {
    let last_key = this.operations.slice(-1).match(this.valid_keys);

    if (this.valid_operators.test(key)) {

      if (this.result !== '' && !this.valid_keys.test(this.operations)) {
        this.operations += this.result;
      }
      if (this.valid_operators.test(this.operations.slice(-2))) {
        this.operations = `${this.operations.substr(0, (this.operations.length - 2))}${key} `;
        return false;
      }
      else {
        this.operations += ` ${key} `;
      }

      this.result = '';
    }

    return true;
  }

  // Elimina la ultima tecla elegida (boton de borrar)

  deleteKey = () : void => {

    if (this.result.length > 1) {
      console.log('hir2');
      this.result = this.result.slice(0, -1);
    } else 
      this.result = '0';
  }

  // Se valida si la tecla seleccionada es un numero.

  validateKey = (key: string) : boolean => {

    if (this.valid_keys.test(key)) {
      this.result += key;
      return true;
    }

    return false;
  }

  // Se valida si la tecla seleccionada es un operador.

  validateOperators = (operator: string) : boolean => this.valid_operators.test(operator);

  // Se limpian las propiedades de la clase.

  clear = () : void => {
    this.result = '';
    this.operations = '';
  }

  // Se obtiene el ultimo operador que es el que se va a usar para la operacion.

  getLastOperator = () : string => this.operations.match(new RegExp(this.valid_operators, 'g')).slice(-1)[0];

  // Se obtiene el ultimo numero que es con el que se va a hacer la operacion.

  getLastKey = () : string => this.operations.match(new RegExp(/[\d\.]+/, 'g')).slice(-1)[0]; 

  // Metodo para transformar entidades HTML.
    
  encodeHtmlEntity = (str : any) : string => {
    let buf = [];
    for (let i = str.length - 1; i >= 0; i--) {
        buf.unshift(["&#", str[i].charCodeAt(), ";"].join(""));
    }
    return buf.join("");
  } 


}
