import { HierarchyPointNode } from "d3-hierarchy";
import { BaseType, Selection } from "d3-selection";
import { ITreeConfig } from "./typings";
export declare const drawLinkEnter: (link: Selection<BaseType, HierarchyPointNode<{}>, SVGGElement, {}>, computedTree: HierarchyPointNode<{}>, settings: ITreeConfig) => Selection<SVGPathElement, HierarchyPointNode<{}>, SVGGElement, {}>;
