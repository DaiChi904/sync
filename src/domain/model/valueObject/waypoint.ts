import type { Brand } from "@/utils/brand";
import { Coordinate } from "./coordinate";

const brandSymbol = Symbol("Waypoint");

interface IWaypoint {
  coordinate: Coordinate;
  next: Waypoint | null;
}

export interface PrimitiveWaypoint {
  coordinate: {
    x: number;
    y: number;
  };
  next: PrimitiveWaypoint | null;
}

export type Waypoint = Brand<IWaypoint, typeof brandSymbol>;

export namespace Waypoint {
  export const from = (value: IWaypoint): Waypoint => {
    return value as Waypoint;
  };

  export const fromPrimitive = (primitive: PrimitiveWaypoint | null): Waypoint | null => {
    if (primitive === null) return null;

    return Waypoint.from({
      coordinate: Coordinate.from(primitive.coordinate),
      next: Waypoint.fromPrimitive(primitive.next),
    });
  };

  export const waypointsToCoordinateArray = (waypoint: Waypoint | null): Array<Coordinate> => {
    if (waypoint === null) return [];

    return waypoint.next !== null
      ? [waypoint.coordinate, ...waypointsToCoordinateArray(waypoint.next)]
      : [waypoint.coordinate];
  };

  export const coordinatesToWaypoints = (coordinates: Array<Coordinate>): Waypoint | null => {
    if (coordinates.length === 0) return null;

    const [head, ...tail] = coordinates;

    return Waypoint.from({
      coordinate: head,
      next: coordinatesToWaypoints(tail),
    });
  };

  export const unBrand = (value: Waypoint): IWaypoint => {
    return value as unknown as IWaypoint;
  };

  export const unBrandToPrimitive = (value: Waypoint | null): PrimitiveWaypoint | null => {
    if (value === null) return null;

    return {
      coordinate: Coordinate.unBrand(value.coordinate),
      next: Waypoint.unBrandToPrimitive(value.next),
    };
  };
}
