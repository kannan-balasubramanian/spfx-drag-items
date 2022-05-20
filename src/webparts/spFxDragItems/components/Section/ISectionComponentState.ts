import ISectionItem from "../../models/ISectionItem";
import ISectionItemTitle from "../../models/ISectionItemTitle";

export interface ISectionComponentState {
    id: number;
    title: string;
    locationId: number;
    isExpanded: boolean;
    sectionItems: ISectionItem[];
    sectionItemTitles: ISectionItemTitle[];
}