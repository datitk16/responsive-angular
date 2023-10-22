import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';


// refer https://angularindepth.com/posts/1383/responsive-angular

@Injectable()
export class MediaService {
  private matches = new ReplaySubject<boolean>(1);
  public match$ = this.matches.asObservable();

  trackMode(query: string) {
    // we need to make sure we are in browser
    if (window) {
      const mediaQueryList = window.matchMedia(query);
      // here we pass value to our ReplaySubject
      const listener = (event: any) => this.matches.next(event.matches);
      // run once and then add listener
      listener(mediaQueryList);
      mediaQueryList.addEventListener('change', listener);
    }
  }
}
