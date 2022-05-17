import ISectionItem from "../../models/ISectionItem";
import ISection from "../../models/ISection";

export interface ISectionComponentProps {
    section: ISection;
    // id: number;
    // title: string;
    // locationId: number;
    // isExpanded: boolean;
    // sectionItems: ISectionItem[];

    onUpdateParentState(section: ISection): void;
    onAddSection(id: number, locationId: number): void;
}