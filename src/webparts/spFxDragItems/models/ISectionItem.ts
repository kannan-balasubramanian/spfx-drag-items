import ISectionItemTitle from "./ISectionItemTitle";
export default interface ISectionItem {
    id: number;
    title: ISectionItemTitle;
    locationId: number;
    sectionId: number;
}