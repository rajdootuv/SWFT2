import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { useractivityMaster,AuthenticationPagination } from './user-activity';
import { Observable, Subject ,takeUntil} from 'rxjs';
import { LoginService } from '../loginactivity.service';
@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent {
  isScreenSmall: boolean;
  useractivity$: Observable<useractivityMaster[]>;
  olduseractivity: useractivityMaster[] = [];
  @Input() pagination: AuthenticationPagination;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(    private _inventoryService: LoginService, private _changeDetectorRef: ChangeDetectorRef,){}

  ngOnInit(): void { 
    this._inventoryService.getUseractivity(undefined,undefined, 'NAME', 'asc',undefined,undefined).subscribe((data) => {

      // Update the brands
      this.olduseractivity = data.useractivity;
      // Mark for check
      this._changeDetectorRef.markForCheck();
      // console.log(this.designations)
    });

    this._inventoryService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: AuthenticationPagination) => {
        // Update the pagination
        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
}
}