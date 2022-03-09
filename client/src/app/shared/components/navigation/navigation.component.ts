import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StyleType } from 'src/app/models/style-types.enum';
import { StyleService } from 'src/app/services/style.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  toggle = new FormControl();
  overlaySidenav = false;

  @ViewChild('sidebarnav') sidebarnavRef!: ElementRef;
  @ViewChild('togglebutton') togglebuttonRef!: ElementRef;

  constructor(
    private styleService: StyleService,
    private renderer: Renderer2,) { }
  

  ngOnInit(): void {
    this.toggle.setValue(this.styleService.isDark());

    this.toggle.valueChanges.subscribe(value => {
      if (value) {
        this.styleService.loadStyle(StyleType.Dark);
      }
      else {
        this.styleService.loadStyle(StyleType.Light);
      }
    });
  }

  toggleSidenav() {
    this.overlaySidenav = !this.overlaySidenav;
  }
}
