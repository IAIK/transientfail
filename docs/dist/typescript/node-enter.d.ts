import { BaseType, Selection } from "d3-selection";
import { ExtendedHierarchyPointNode, ITreeConfig } from "./typings";
export declare const placeNodeEnter: (node: Selection<BaseType, ExtendedHierarchyPointNode, SVGGElement, {}>, settings: ITreeConfig) => Selection<SVGGElement, ExtendedHierarchyPointNode, SVGGElement, {}>;
