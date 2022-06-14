import ISectionItemTitle from "../../models/ISectionItemTitle";

export interface ISectionItemComponentState {
    id: number;
    title: string;
    locationId: number;
    sectionId: number;
    sectionItemTitles: ISectionItemTitle[];
    uiMode: number; //0=view, 1=edit, 2=new
}