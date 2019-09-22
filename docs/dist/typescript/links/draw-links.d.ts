import { ITreeConfig } from "../typings";
interface ICoordinates {
    x: number;
    y: number;
}
export declare const generateLinkLayout: (s: ICoordinates, d: ICoordinates, treeConfig: ITreeConfig) => string;
export {};
