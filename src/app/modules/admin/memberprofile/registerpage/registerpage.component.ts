import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss']
})
export class RegisterpageComponent {
  @Input()  DATA=[]
  @Input() drawerClose: Function;
  isScreenSmall: boolean;
  Save(){}

  constructor(private _changeDetectorRef: ChangeDetectorRef,) {

  }

  closeDrawer(): void {
    this.drawerClose();
    this._changeDetectorRef.markForCheck();
  }
}
