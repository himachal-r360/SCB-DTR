import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ngbCarouselTransitionOut } from '@ng-bootstrap/ng-bootstrap/carousel/carousel-transition';
import { applyStyles } from '@popperjs/core';
@Component({
  selector: 'css-loader',
  template: `<link *ngIf="cssPath" rel="stylesheet" type="text/css" [href]="path">`,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CssLoaderComponent  {
  cssPath: any;

  constructor(public sanitizer: DomSanitizer,private location:Location,
    private cd: ChangeDetectorRef) {
    
    	let urlToSplit =this.location.path();
	let unification =urlToSplit.split("/");


	// switch (unification[1]) {
		// localStorage.setItem('theme-dark','true');

	 switch (localStorage.getItem('theme-dark')) {

	case ('true'):
         this.cssPath = `scb-dtr-theme.css`;
	break;
	case ('false'):
	 this.cssPath = `scb-dtr.css`;
	break;
	// case ('regalia'):
	//  this.cssPath = `smartbuy.css`;
	// break;
    // case ('regalia_gold'):
	//  this.cssPath = `regalia_gold.css`;
	// break;
	// case ('corporate'):
	//  this.cssPath = `corporate.css`;
	// break;
	// case ('business'):
	//  this.cssPath = `business.css`;
	// break;
	default:
	this.cssPath = '';
	break;
	}  
      this.cd.markForCheck();
  }

  set path(path) {
    this.cssPath = path;
  }

  get path() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.cssPath);
  }

  getCss(){
	let urlToSplit =this.location.path();
	let unification =urlToSplit.split("/");


	// switch (unification[1]) {
		// localStorage.setItem('theme-dark','true');

	 switch (localStorage.getItem('theme-dark')) {

	case ('true'):
         this.cssPath = `scb-dtr-theme.css`;
	break;
	case ('false'):
	 this.cssPath = `scb-dtr.css`;
	break;
	// case ('regalia'):
	//  this.cssPath = `smartbuy.css`;
	// break;
    // case ('regalia_gold'):
	//  this.cssPath = `regalia_gold.css`;
	// break;
	// case ('corporate'):
	//  this.cssPath = `corporate.css`;
	// break;
	// case ('business'):
	//  this.cssPath = `business.css`;
	// break;
	default:
	this.cssPath = '';
	break;
	}  
      this.cd.markForCheck();

  }
}
