import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as fromComponents from './components';

/**
 * here declare components, pipes, directives, and export them.
 * import the SharedModule into any other Feature Modules.
 * DO NOT import the SharedModule into the AppModule.
 */
@NgModule({
  declarations: [
    ...fromComponents.components,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormsModule,
    ...fromComponents.components
  ]
})
export class SharedModule { }
