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
    uiMode: number; //0=view, 1=edit, 2=new
}