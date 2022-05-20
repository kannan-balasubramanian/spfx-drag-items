// import ISectionItem from "../../models/ISectionItem";
import ISection from "../../models/ISection";
import ISectionItemTitle from "../../models/ISectionItemTitle";

export interface ISectionComponentProps {
    section: ISection;
    sectionItemTitles: ISectionItemTitle[];
    // id: number;
    // title: string;
    // locationId: number;
    // isExpanded: boolean;
    // sectionItems: ISectionItem[];

    onUpdateParentState(section: ISection): void;
    onAddSection(id: number, locationId: number): void;
    onDeleteSection(id: number, locationId: number, sectionItemId: number, sectionItemLocationId: number): void;
}