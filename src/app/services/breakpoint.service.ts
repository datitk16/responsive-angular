import { fromEvent, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, startWith } from 'rxjs/operators';

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

export const Breakpoints = {
  xSmall: 'xs', // min-width: 0px
  small: 'sm', // min-width: 576px
  medium: 'md', // min-width: 768px
  large: 'lg', // min-width: 992px
  xLarge: 'xl' // min-width: 1200px
} as const;

type BreakpointType = typeof Breakpoints[keyof typeof Breakpoints];

const query: Map<BreakpointType, string> = new Map([
  [Breakpoints.xLarge, '(min-width: 1200px)'],
  [Breakpoints.large, '(min-width: 992px)'],
  [Breakpoints.medium, '(min-width: 768px)'],
  [Breakpoints.small, '(min-width: 576px)'],
  [Breakpoints.xSmall, '(min-width: 0px)'],
]);

@Injectable()
export class BreakpointService {
  private size$: Observable<BreakpointType>;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (this.isPlatformBrowser) {
      this.size$ = fromEvent(window, 'resize').pipe(
        startWith(this.getScreenSize()),
        map(() => {
          return this.getScreenSize();
        }),
        distinctUntilChanged(),
        shareReplay(1)
      );
    } else {
      this.size$ = of(Breakpoints.medium);
    }
  }

  get breakpoint$(): Observable<BreakpointType> {
    return this.size$;
  }

  get isMobile$(): Observable<boolean> {
    return this.breakpoint$.pipe(map(x => x === Breakpoints.xSmall || x === Breakpoints.small));
  }

  get isDesktop$(): Observable<boolean> {
    return this.breakpoint$.pipe(map(x => x === Breakpoints.medium || x === Breakpoints.large || x === Breakpoints.xLarge));
  }

  get isLarge$(): Observable<boolean> {
    return this.breakpoint$.pipe(map(x => x === Breakpoints.large || x === Breakpoints.xLarge));
  }

  private getScreenSize(): BreakpointType {
    const [[newSize]] = Array.from(query.entries()).filter(([size, mediaQuery]) =>
      this.isPlatformBrowser ? window.matchMedia(mediaQuery).matches : size === Breakpoints.small);
    return newSize;
  }

  private get isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
