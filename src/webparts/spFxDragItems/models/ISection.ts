import ISectionItem from "./ISectionItem";
export default interface ISection {
    id: number;
    title: string;
    locationId: number;
    isExpanded: boolean;
    sectionItems: ISectionItem[];
}