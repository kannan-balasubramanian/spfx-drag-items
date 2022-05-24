import ISectionItemTitle from "../../models/ISectionItemTitle";

export interface ISectionItemComponentProps {
    id: number;
    title: ISectionItemTitle;
    locationId: number;
    sectionId: number;

    sectionItemTitles: ISectionItemTitle[];

    onDeleteSectionItem(id: number, locationId: number): void;
    onTitleChange(id: number, locationId: number, newTitleText: string, newTitleKey: number);
}