import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSearchHighlight]'
})
export class SearchHighlightDirective implements OnChanges {
  @Input() searchedPhrase!: string;
  @Input() content!: string;
  @Input() classToApply!: string;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    // Do not do anything if no content is provided
    if (!this.content) {
      return;
    }

    // If search phrase is empty or class to apply not specified, simply insert the content into the element.
    if (!this.searchedPhrase || !this.searchedPhrase.length || !this.classToApply) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.content);
      return;
    }

    // If previous steps work, create the inner html with a highlighting section by creating a span around the found searched phrase
    this.renderer.setProperty(
      this.el.nativeElement,
      'innerHTML',
      this.getFormattedText()
    );
  }

  // Format the provided text, use regex to replace found text with a highlighted span if it exists.
  private getFormattedText() {
    const regex = new RegExp(`(${this.searchedPhrase})`, 'gi');
    return this.content.replace(regex, `<span class=${this.classToApply}>$1</span>`);
  }
}
