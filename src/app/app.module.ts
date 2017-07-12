import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { SemanticAnalizerService } from './services/semantic-analizer.service';
import { MathService } from './services/math.service';

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [SemanticAnalizerService, MathService],
  bootstrap: [AppComponent]
})
export class AppModule { }
