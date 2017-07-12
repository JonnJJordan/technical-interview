import { Component, OnInit, HostListener } from '@angular/core';
import { SemanticAnalizerService } from '../../services/semantic-analizer.service';
import $ from 'jquery';
import { MathService } from '../../services/math.service';

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

  result : number;
  operation : string;
  temp_result : number;

  constructor(
    private semanticAnalizer: SemanticAnalizerService,
    private math: MathService
  ) { }

  ngOnInit() {
    
    this.result = 0;
    this.operation = '';
    this.temp_result = 0;

  }

  @HostListener('window:keyup', ['$event']) keyupListener (event : KeyboardEvent) {

    event.preventDefault();

    $(`.btn`).removeClass('active');

  }

  @HostListener('window:keydown', ['$event']) keydownListener (event: KeyboardEvent) {

    event.preventDefault();

    if (event.keyCode === KEY_CODE.BACKSPACE) {
      $('#keyBackspace').toggleClass('active');
      this.semanticAnalizer.deleteKey();
      this.result = parseFloat(this.semanticAnalizer.getResult());
    } else if (event.keyCode === KEY_CODE.ENTER) {
      $('#keyEnter').toggleClass('active');
      this.operate();
    } else if (this.semanticAnalizer.validateKey(event.key)) {
      event.key !== '.' ? $(`#key${event.key}`).toggleClass('active') : $(`#key${event.keyCode}`).toggleClass('active');
      this.result = parseFloat(this.semanticAnalizer.getResult());
      this.semanticAnalizer.addKey(event.key);
    } else if (this.semanticAnalizer.validateOperators(event.key)) {
      if (this.result > 0) {
        $(`#key${event.keyCode}`).toggleClass('active');
        this.semanticAnalizer.addKey(event.key);
        this.operation = this.semanticAnalizer.getOperations();
      }
    }

  }

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
      console.log('hir');
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

    if (this.semanticAnalizer.encodeHtmlEntity($(event.target).html()).includes('&#8730;') && this.operation === '') {
      this.operation = `${$(event.target).html()} (${this.result})`;
      this.operate();
    }
      
  }

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

    if (this.semanticAnalizer.encodeHtmlEntity(this.operation).includes('&#8730;')) {
      this.semanticAnalizer.deleteResult();
      if (this.semanticAnalizer.validateKey(this.selectOperation('square', this.result, null).toFixed(2))) {
        this.result = this.selectOperation('square', this.result, null);
      }
    } else {
      console.log(this.result);
      console.log(this.semanticAnalizer.getLastKey());
      this.semanticAnalizer.deleteResult();
      if (this.semanticAnalizer.validateKey(this.selectOperation(this.semanticAnalizer.getLastOperator(), parseFloat(this.semanticAnalizer.getLastKey()), this.result).toFixed(0))) {
        this.result = this.selectOperation(this.semanticAnalizer.getLastOperator(), parseFloat(this.semanticAnalizer.getLastKey()), this.result);
      }

      this.semanticAnalizer.deleteOperations();
      this.operation = '';
    }

  }

}
