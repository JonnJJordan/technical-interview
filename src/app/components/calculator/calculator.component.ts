import { Component, OnInit, HostListener } from '@angular/core';
import { SemanticAnalizerService } from '../../services/semantic-analizer.service';
import $ from 'jquery';
import { MathService } from '../../services/math.service';

// Codigos de teclas especiales

export enum KEY_CODE {
  ENTER = 13,
  BACKSPACE = 8
};

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {

  // Declaracion de propiedades de la clase
  result : number;
  operation : string;
  temp_result : number;

  // Inicializacion de las propiedades privadas de la clase
  constructor(
    private semanticAnalizer: SemanticAnalizerService,
    private math: MathService
  ) { }

  // Inicializacion de las propiedades publicas de la clase
  ngOnInit() {
    
    this.result = 0;
    this.operation = '';
    this.temp_result = 0;

  }

  // Escuchar el evento global de tecla arriba para resetear la clase activa de los botones, dando la impresion de que se seleccionan cuando se usa el teclado.

  @HostListener('window:keyup', ['$event']) keyupListener (event : KeyboardEvent) {

    event.preventDefault();

    $(`.btn`).removeClass('active');

  }

  // Escuchar el evento global de tecla abajo para añadir los valores y el operador a usar.

  @HostListener('window:keydown', ['$event']) keydownListener (event: KeyboardEvent) {

    event.preventDefault();

    // Primero se verifica si es la tecla de borrar, si es asi, se elimina el ultimo digito, si solo queda un solo digito, se vuelve 0.
    if (event.keyCode === KEY_CODE.BACKSPACE) {
      $('#keyBackspace').toggleClass('active');
      this.semanticAnalizer.deleteKey();
      this.result = parseFloat(this.semanticAnalizer.getResult());
    
    // Se verifica si la tecla presionada es enter, para realizar la operacion matematica.
    } else if (event.keyCode === KEY_CODE.ENTER) {
      $('#keyEnter').toggleClass('active');
      this.operate();
    
    // Se valida si es una tecla valida, si es asi, se agrega a la pantalla y a los valores listos para la operacion, ademas de cambiar la clase del boton.
    } else if (this.semanticAnalizer.validateKey(event.key)) {
      event.key !== '.' ? $(`#key${event.key}`).toggleClass('active') : $(`#key${event.keyCode}`).toggleClass('active');
      this.result = parseFloat(this.semanticAnalizer.getResult());
      this.semanticAnalizer.addKey(event.key);
    
    // Se valida si la tecla es un operador valido, si es asi, se verifica primero sino es la primera tecla presionada, para luego añadir el operador que se va a utilizar-
    } else if (this.semanticAnalizer.validateOperators(event.key)) {
      if (this.result > 0) {
        $(`#key${event.keyCode}`).toggleClass('active');
        this.semanticAnalizer.addKey(event.key);
        this.operation = this.semanticAnalizer.getOperations();
      }
    }

  }

  // Se utiliza la misma logica para que los botones trabajen de igual forma con el teclado.

  getKey (event: MouseEvent) : void {
    
    if ($(event.target).attr('id') === 'keyC') {

      this.semanticAnalizer.clear();
      this.result = 0;
      this.operation = '';
      this.temp_result = 0;

    } else if ($(event.target).attr('id') === 'keyBackspace') {

      this.semanticAnalizer.deleteKey();
      this.result = parseFloat(this.semanticAnalizer.getResult());

    } else if ($(event.target).attr('id') === 'keyPotency') {
      this.semanticAnalizer.addKey('^');
      this.operation = this.semanticAnalizer.getOperations();
    } else {
      if (this.semanticAnalizer.validateKey($(event.target).html())) {
        this.result = parseFloat(this.semanticAnalizer.getResult());
        this.semanticAnalizer.addKey($(event.target).html());
      } else if (this.semanticAnalizer.validateOperators($(event.target).html())) {
        this.semanticAnalizer.addKey($(event.target).html());
        this.operation = this.semanticAnalizer.getOperations();
      }
    }

    // Si el boton presionado es el de raiz, se muestra en pantalla y se genera la operación de inmediato.

    if (this.semanticAnalizer.encodeHtmlEntity($(event.target).html()).includes('&#8730;') && this.operation === '') {
      this.operation = `${$(event.target).html()} (${this.result})`;
      this.operate();
    }
      
  }

  // Se selecciona la operacion a utilizar dependiendo del operador.

  selectOperation (operator: string, a: number, b: number) : number {

    let operation_result = 0;

    switch (operator) {
      case '+':
        operation_result = this.math.add(a, b);
      break;
      case '-':
        operation_result = this.math.subtract(a, b);
      break;
      case '*':
        operation_result = this.math.multiply(a, b);
      break;
      case '/':
        operation_result = this.math.divide(a, b);
      break;
      case '^':
        operation_result = this.math.potency(a, b);
      break;
      case 'square':
        operation_result = this.math.squareRoot(a);
      break;
    }

    return operation_result;
  } 

  operate () {

    // Se verifica si la operacion sera de raiz, si es asi, se elimina primero el resultado previo y se realiza la operacion.
    if (this.semanticAnalizer.encodeHtmlEntity(this.operation).includes('&#8730;')) {
      this.semanticAnalizer.deleteResult();
      if (this.semanticAnalizer.validateKey(this.selectOperation('square', this.result, null).toFixed(2))) {
        this.result = this.selectOperation('square', this.result, null);
      }
    } else {
    
    // Se sigue la misma logica para las demas operaciones, pero ademas se resetean los valores utilizados.
      this.semanticAnalizer.deleteResult();
      if (this.semanticAnalizer.validateKey(this.selectOperation(this.semanticAnalizer.getLastOperator(), parseFloat(this.semanticAnalizer.getLastKey()), this.result).toFixed(0))) {
        this.result = this.selectOperation(this.semanticAnalizer.getLastOperator(), parseFloat(this.semanticAnalizer.getLastKey()), this.result);
      }

      this.semanticAnalizer.deleteOperations();
      this.operation = '';
    }

  }

}
