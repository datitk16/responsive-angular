export interface MediaQueryList extends EventTarget {
    matches: boolean; // => true if document matches the passed media query, false if not
    media: string; // => the media query used for the matching
}