
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, options?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      getCenter(): LatLng;
      getBounds(): LatLngBounds;
      getZoom(): number;
      fitBounds(bounds: LatLngBounds, padding?: number | Padding): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      getPosition(): LatLng;
      setTitle(title: string): void;
      addListener(event: string, handler: Function): MapsEventListener;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      setContent(content: string | Node): void;
      open(map: Map, anchor?: Marker): void;
      close(): void;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      contains(latLng: LatLng | LatLngLiteral): boolean;
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
      toJSON(): object;
      toSpan(): LatLng;
      toString(): string;
      union(other: LatLngBounds): LatLngBounds;
    }

    interface MapsEventListener {
      remove(): void;
    }

    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      styles?: any[];
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      label?: string | MarkerLabel;
      animation?: number;
      icon?: string | Icon | Symbol;
    }

    interface MarkerLabel {
      text: string;
      color?: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }

    interface Padding {
      top: number;
      right: number;
      bottom: number;
      left: number;
    }
    
    interface Symbol {
      path: string | number;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      height: number;
      width: number;
      equals(other: Size): boolean;
      toString(): string;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
      equals(other: Point): boolean;
      toString(): string;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
      equals(other: LatLng): boolean;
      toString(): string;
      toJSON(): object;
      toUrlValue(precision?: number): string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    const Animation: {
      BOUNCE: number;
      DROP: number;
    };
  }
}
