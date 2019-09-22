import { ITreeConfig } from "./typings";
export declare function create(userSettings: Partial<ITreeConfig>): {
    refresh: (data: any, newSettings?: Partial<ITreeConfig> | undefined) => void;
    clean: (keepConfig: boolean) => void;
};
