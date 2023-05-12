import {
    Component,
    Renderer2,
} from '@angular/core';

@Component({
    selector: 'app-userattendancelog',
    templateUrl: './userattendancelog.component.html',
    styleUrls: ['./userattendancelog.component.scss'],
})
export class UserattendancelogComponent {
    // constructor(private calendarUtils: CalendarUtils) { }

    addorganization = [];

    oldlogindatadata = [];
    progressValue = 50; // The progress value, should be a number between 0 and 100.

    // progressValue(): any {
    //   // Calculate the progress value based on your application's logic
    // }

    progressBarColor(): any {
        // Return the background color of the progress bar based on your application's logic
    }

    progressLabels(): number[] {
        return Array.from({ length: 31 }, (_, i) => i + 1);
    }

    // dateClass = (d: Date) => {
    //   const date = d.getDay();
    //   // Highlight saturday and sunday.
    //   console.log( (date === 0 || date === 6))
    //   return (date === 0 || date === 6) ? ' apply' : undefined;

    // }

    constructor(private renderer: Renderer2) {}

    Today = [{ date: this.dateToString(new Date()), text: 'Today' }];

    dates = [
        { date: '2023-05-05', text: 'A' },
        { date: '2023-05-07', text: 'A' },
    ];

    sundays = [
        { date: '2023-05-06', text: 'S' },
        { date: '2023-05-13', text: 'S' },
        { date: '2023-05-20', text: 'S' },
    ];

    Leave = [{ date: '2023-05-14', text: 'Leave' }];

    Presentdates = [
        { date: '2023-05-02', text: 'P' },
        { date: '2023-05-03', text: 'P' },
        { date: '2023-05-04', text: 'P' },
       
        { date: '2023-05-09', text: 'P' },
        { date: '2023-05-10', text: 'P' },
        { date: '2023-05-11', text: 'P' },
        { date: '2023-05-12', text: 'P' },
        { date: '2023-05-01', text: 'P' },
        { date: '2023-05-16', text: 'P' },
        { date: '2023-05-17', text: 'P' },
        { date: '2023-05-18', text: 'P' },
        { date: '2023-05-19', text: 'P' },
        { date: '2023-05-08', text: 'P' },
        { date: '2023-05-21', text: 'P' },
        { date: '2023-05-15', text: 'P' },
    ];


    // disabledDates = [
    //     { date: '2023-05-23' },
      
    // ];
    disabledDates = new Date('2023-05-21');

    // dateFilter = (date: Date): boolean => {
    //     const dateString = `${date.getFullYear()}-${
    //         date.getMonth() + 1
    //     }-${date.getDate()}`;
    //     return !this.disabledDates.includes(dateString);
    // };

    //     //   const date = d.getDay();

    dateClass = (d: Date) => {
        //   const date = d.getDay();

        if (d.getDate() == 1) this.displayMonth();
        const dateSearch = this.dateToString(d);


        if (this.Presentdates.find((f) => f.date == dateSearch)) {
            // Present days
            return this.Presentdates.find((f) => f.date == dateSearch)
                ? 'PresentDays'
                : 'normal';
        }

        if (this.Leave.find((f) => f.date == dateSearch)) {
            // Leave
            return this.Leave.find((f) => f.date == dateSearch)
                ? 'Leavess'
                : 'normal';
        }

        if (this.dates.find((f) => f.date == dateSearch)) {
            // absent
            return this.dates.find((f) => f.date == dateSearch)
                ? 'absent'
                : 'normal';
        }

        if (this.sundays.find((f) => f.date == dateSearch)) {
            // absent
            return this.sundays.find((f) => f.date == dateSearch)
                ? 'sundays'
                : 'normal';
        }


        if (this.disabledDates) {
            // disable
            return d > this.disabledDates ? 'disabled-date' : '';
            
        }


        // //  to show all Sundays
        // const date = d.getDay();
        // //  and sunday.
        // console.log(date === 6);
        // return date === 6 ? ' sundays' : undefined;

       
      
      
    };

    displayMonth() {
        setTimeout(() => {
            let elements = document.querySelectorAll('.endDate');
            console.log('*', elements.length);
            let x = document.querySelectorAll('.mat-calendar-body-cell');
            x.forEach((y) => {
                const dateSearch = this.dateToString(
                    new Date(y.getAttribute('aria-label'))
                );
                const data = this.dates.find((f) => f.date == dateSearch);
                const data_today = this.Today.find((f) => f.date == dateSearch);
                if (data) y.setAttribute('aria-label', data.text);
                if (data_today) y.setAttribute('aria-label', data_today.text);
            });
        });
    }
    streamOpened(event) {
        setTimeout(() => {
            let buttons = document.querySelectorAll(
                'mat-calendar .mat-icon-button'
            );

            buttons.forEach((btn) =>
                this.renderer.listen(btn, 'click', () => {
                    setTimeout(() => {
                        //debugger
                        this.displayMonth();
                    });
                })
            );
            this.displayMonth();
        });
    }
    dateToString(date: any) {
        return (
            date.getFullYear() +
            '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + date.getDate()).slice(-2)
        );
    }
}
