import { BaseType, Selection } from "d3-selection";
import { ExtendedHierarchyPointNode, ITreeConfig } from "../typings";
export declare const drawNodeUpdate: (nodeEnter: Selection<SVGGElement, ExtendedHierarchyPointNode, SVGGElement, {}>, node: Selection<BaseType, ExtendedHierarchyPointNode, SVGGElement, {}>, settings: ITreeConfig) => void;
