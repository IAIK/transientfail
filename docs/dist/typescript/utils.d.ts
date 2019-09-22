import { ExtendedHierarchyPointNode, ITreeConfig } from "./typings";
export declare const getAreaSize: (
  htmlId: string
) => {
  areaWidth: number;
  areaHeight: number;
};
declare type Result = ExtendedHierarchyPointNode & {
  x0: number;
  y0: number;
};
export declare const getFirstDisplayedAncestor: (
  ghostNodes: ExtendedHierarchyPointNode[],
  viewableNodes: ExtendedHierarchyPointNode[],
  id: string
) => Result;
export declare const setNodeLocation: (
  xPosition: number,
  yPosition: number,
  settings: ITreeConfig
) => string;
export {};
