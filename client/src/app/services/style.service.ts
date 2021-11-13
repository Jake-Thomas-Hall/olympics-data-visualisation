import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StyleType } from '../models/style-types.enum';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  isDarkTheme = new BehaviorSubject(true);

  constructor(
    @Inject(DOCUMENT) private document: Document) { }

  loadStyle(theme: string) {
    const head = this.document.getElementsByTagName('head')[0];
    const html = this.document.getElementsByTagName('html')[0];

    let themeLink = this.document.getElementById('client-theme') as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = `${theme}.min.css`;
    }
    else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = "stylesheet";
      style.href = `${theme}.min.css`;

      head.appendChild(style);
    }

    let styleType = 'dark-theme'

    if (theme == 'bootstrap') {
      styleType = 'light-theme';
    }

    html.className = styleType;

    if (styleType === 'dark-theme') {
      this.isDarkTheme.next(true);
    }
    else {
      this.isDarkTheme.next(false);
    }

    localStorage.setItem('prefers-color-scheme', theme);
  }

  initStyle() {
    return new Promise<void>((resolve, reject) => {
      try {
        const currentThemeValue = localStorage.getItem('prefers-color-scheme');
        let theme: string = StyleType.Dark;

        if (currentThemeValue) {
          theme = currentThemeValue;
        }
        else {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme = StyleType.Dark;
            localStorage.setItem('prefers-color-scheme', StyleType.Dark);
          }
          else {
            theme = StyleType.Light;
            localStorage.setItem('prefers-color-scheme', StyleType.Light);
          }
        }

        this.loadStyle(theme);
        resolve();
      } catch (error) {
        reject(`Failed to load theme:${error}`);
      }
    });
  }

  isDark(): boolean {
    const style = localStorage.getItem('prefers-color-scheme');

    return style === StyleType.Dark;
  }

  static initialiseStyleService(styleService: StyleService) {
    return () => styleService.initStyle();
  }
}
