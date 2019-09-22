import { HierarchyPointNode } from "d3-hierarchy";
import { BaseType, Selection } from "d3-selection";
import { ExtendedHierarchyPointNode, ITreeConfig } from "../typings";
export declare const drawLinkExit: (link: Selection<BaseType, HierarchyPointNode<{}>, SVGGElement, {}>, settings: ITreeConfig, nodes: ExtendedHierarchyPointNode[], oldNodes: ExtendedHierarchyPointNode[]) => void;
