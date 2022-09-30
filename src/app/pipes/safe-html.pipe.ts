import { Component, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) { }
  transform(value) {
    // value.split('&lt;').join('<').split('&gt;').join('>');
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}
