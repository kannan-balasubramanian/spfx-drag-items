import ISectionItem from "../../models/ISectionItem";
import ISection from "../../models/ISection";

export interface ISectionComponentProps {
    section: ISection;
    // id: number;
    // title: string;
    // locationId: number;
    // isExpanded: boolean;
    // sectionItems: ISectionItem[];

    updateParentState(section: ISection): void;
}