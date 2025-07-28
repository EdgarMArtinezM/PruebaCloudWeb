import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogginComponent } from './loggin.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LogginComponent], 
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LogginComponent
  ]
})
export class LogginModule { }
