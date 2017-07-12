import { Injectable, OnInit } from '@angular/core';

@Injectable()
export class SemanticAnalizerService {

  private operations : string;
  private result : string;
  private valid_keys : RegExp;
  private valid_operators : RegExp;

  constructor() { 

    this.operations = '';
    this.result = '';
    this.valid_keys =  /[\d\.]/;
    this.valid_operators = /[\(\)\+\-\*\^\%\/]/;

  }

  getOperations = () : string => this.operations;

  getResult = () : string => this.result;

  deleteResult = () : void => {
    this.result = '';
  }

  deleteOperations = () : void => {
    this.operations = '';
  }

  getOperationsCount = () : number => this.operations.match(new RegExp(this.valid_operators, 'g')).length;

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

  deleteKey = () : void => {

    if (this.result.length > 1) {
      console.log('hir2');
      this.result = this.result.slice(0, -1);
    } else 
      this.result = '0';
  }

  validateKey = (key: string) : boolean => {

    if (this.valid_keys.test(key)) {
      this.result += key;
      return true;
    }

    return false;
  }

  validateOperators = (operator: string) : boolean => this.valid_operators.test(operator);

  clear = () : void => {
    this.result = '';
    this.operations = '';
  }

  getLastOperator = () : string => this.operations.match(new RegExp(this.valid_operators, 'g')).slice(-1)[0];

  getLastKey = () : string => this.operations.match(new RegExp(/[\d\.]+/, 'g')).slice(-1)[0]; 
    
  encodeHtmlEntity = (str : any) : string => {
    let buf = [];
    for (let i = str.length - 1; i >= 0; i--) {
        buf.unshift(["&#", str[i].charCodeAt(), ";"].join(""));
    }
    return buf.join("");
  } 


}
