export interface ISectionItemComponentProps {
    id: number;
    title: string;
    locationId: number;
    sectionId: number;

    onDeleteSectionItem(id: number, locationId: number): void;
}