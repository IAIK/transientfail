import { BaseType, Selection } from "d3-selection";
import { ExtendedHierarchyPointNode, ITreeConfig } from "../typings";
export declare const drawNodeEnter: (node: Selection<BaseType, ExtendedHierarchyPointNode, SVGGElement, {}>, settings: ITreeConfig, nodes: ExtendedHierarchyPointNode[], oldNodes: ExtendedHierarchyPointNode[]) => Selection<SVGGElement, ExtendedHierarchyPointNode, SVGGElement, {}>;
