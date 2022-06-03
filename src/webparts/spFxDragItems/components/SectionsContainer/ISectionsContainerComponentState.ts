import ISection from "../../models/ISection";
import ISectionItemTitle from "../../models/ISectionItemTitle";
export interface ISectionsContainerComponentState {
    sections: ISection[];
    sectionIndexToDelete: number;
    sectionItemIndexToDelete: number;
    isGenerateSectionsButtonDisabled: boolean;
    deleteSectionItemModalWarningText: string;
    isDeleteSectionItemModalOpen: boolean;
    isDeleteSectionModalOpen: boolean;
    sectionItemTitles: ISectionItemTitle[];
}