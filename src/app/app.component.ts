import { MediaService } from './services/media.service';
import { Component, OnInit } from '@angular/core';
import { BreakpointService } from './services/breakpoint.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    MediaService,
    BreakpointService
  ]
})
export class AppComponent implements OnInit {
  query = '(orientation: portrait)';
  mediaQueryList = window.matchMedia(this.query);

  isWeb$ = this.mediaService.match$;

  constructor(
    private mediaService: MediaService,
    private breakpointService: BreakpointService
  ) { }

  ngOnInit() {
    this.mediaService.trackMode('(min-width: 768px)');
    // this.mediaService.match$.subscribe(res => {
    //   console.log(res)
    // })


    this.breakpointService.isDesktop$.subscribe(res => {
      console.log(res)
    })


  }

}
