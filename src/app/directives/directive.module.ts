import { NgModule } from "@angular/core";
import { DropdownDirective } from "../directives/dropdown.directive";
import { ToggleDetailDirective } from "./toggle-detail.directive";

@NgModule({
  declarations: [
    DropdownDirective,
    ToggleDetailDirective
  ],
  imports: [
  ],
  exports:[
    DropdownDirective,
    ToggleDetailDirective
  ]
})
export class DirectiveModule { }
