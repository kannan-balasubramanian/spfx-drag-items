import ISectionItem from "../../models/ISectionItem";
import ISectionItemTitle from "../../models/ISectionItemTitle";

export interface ISectionComponentState {
    id: number;
    title: string;
    locationId: number;
    isExpanded: boolean;
    sectionItems: ISectionItem[];
    sectionItemTitles: ISectionItemTitle[];
    uiMode: number; //0=view, 1=edit, 2=new
}