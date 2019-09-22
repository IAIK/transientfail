import { HierarchyPointNode } from "d3-hierarchy";
import { BaseType, Selection } from "d3-selection";
import { ITreeConfig } from "../typings";
export declare const drawLinkUpdate: (linkEnter: Selection<SVGPathElement, HierarchyPointNode<{}>, SVGGElement, {}>, link: Selection<BaseType, HierarchyPointNode<{}>, SVGGElement, {}>, settings: ITreeConfig) => void;
