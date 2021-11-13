import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StyleType } from 'src/app/models/style-types.enum';
import { StyleService } from 'src/app/services/style.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  toggle = new FormControl(false);

  constructor(private styleService: StyleService) { }

  ngOnInit(): void {
    this.toggle.setValue(this.styleService.isDark());

    this.toggle.valueChanges.subscribe(value => {
      if (value === true) {
        this.styleService.loadStyle(StyleType.Dark);
      }
      else {
        this.styleService.loadStyle(StyleType.Light);
      }
    });
  }

}
