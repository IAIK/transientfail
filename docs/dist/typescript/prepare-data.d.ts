import { HierarchyNode } from "d3-hierarchy";
import { ITreeConfig } from "./typings";
export declare const generateNestedData: (data: any, treeConfig: ITreeConfig) => HierarchyNode<any>;
export declare const generateBasicTreemap: (treeConfig: ITreeConfig) => import("d3-hierarchy").TreeLayout<unknown>;
