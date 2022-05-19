import ISection from "../../models/ISection";
export interface ISectionsContainerComponentState {
    sections: ISection[];
    sectionIndexToDelete: number;
    sectionItemIndexToDelete: number;
    isGenerateSectionsButtonDisabled: boolean;
    deleteSectionItemModalWarningText: string;
    isDeleteSectionItemModalOpen: boolean;
}