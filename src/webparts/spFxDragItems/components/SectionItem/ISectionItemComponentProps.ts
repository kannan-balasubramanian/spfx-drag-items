import ISectionItemTitle from "../../models/ISectionItemTitle";

export interface ISectionItemComponentProps {
    id: number;
    title: ISectionItemTitle;
    locationId: number;
    sectionId: number;
    sectionItemTitles: ISectionItemTitle[];
    uiMode: number; //0=view, 1=edit, 2=new

    onDeleteSectionItem(id: number, locationId: number): void;
    onAddSectionItem(id: number, locationId: number): void;
    onTitleChange(id: number, locationId: number, newTitleText: string, newTitleKey: number);
}