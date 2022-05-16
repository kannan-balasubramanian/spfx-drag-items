import ISectionItem from "../../models/ISectionItem";

export interface ISectionComponentProps {
    id: number;
    title: string;
    locationId: number;
    isExpanded: boolean;
    sectionItems: ISectionItem[];

    updateParentState(id: number, sectionItems: ISectionItem[]): void;
}