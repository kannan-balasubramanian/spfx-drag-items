import ISectionItemTitle from "../../models/ISectionItemTitle";

export interface ISectionItemComponentState {
    id: number;
    title: string;
    locationId: number;
    sectionId: number;

    sectionItemTitles: ISectionItemTitle[];
}