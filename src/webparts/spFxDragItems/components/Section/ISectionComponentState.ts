import ISectionItem from "../../models/ISectionItem";

export interface ISectionComponentState {
    id: number;
    title: string;
    locationId: number;
    isExpanded: boolean;
    sectionItems: ISectionItem[];
}