import { NgModule } from "@angular/core";
import { DropdownDirective } from "../directives/dropdown.directive";
import { HotelDropdownDirective } from "./hoteldropdown.directive";
import { ToggleDetailDirective } from "./toggle-detail.directive";

@NgModule({
  declarations: [
    DropdownDirective,
    ToggleDetailDirective,
    HotelDropdownDirective
  ],
  imports: [
  ],
  exports:[
    DropdownDirective,
    ToggleDetailDirective,
    HotelDropdownDirective
  ]
})
export class DirectiveModule { }
