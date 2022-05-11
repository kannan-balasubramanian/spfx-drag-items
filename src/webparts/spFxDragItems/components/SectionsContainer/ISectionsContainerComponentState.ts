import ISection from "../../models/ISection";
export interface ISectionsContainerComponentState {
    sections: ISection[];
    isGenerateSectionsButtonDisabled: boolean;
}