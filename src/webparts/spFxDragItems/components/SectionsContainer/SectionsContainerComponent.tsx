import * as React from 'react';

import { ActionButton, PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles, Modal, FontIcon, mergeStyles, Label } from 'office-ui-fabric-react';
import { DefaultPalette } from 'office-ui-fabric-react';

import { ISectionsContainerComponentState } from './ISectionsContainerComponentState';
import ISection from "../../models/ISection";
import ISectionItem from "../../models/ISectionItem";
import SectionComponent from '../Section/SectionComponent';
import ISectionItemTitle from '../../models/ISectionItemTitle';

const generateIcon: IIconProps = { iconName: 'SyncStatus' };
const yesIcon: IIconProps = { iconName: 'Accept' };
const noIcon: IIconProps = { iconName: 'CalculatorMultiply' };

const viewIcon: IIconProps = { iconName: 'EntryView' };

const stackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.neutralLight,
    },
};
const stackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
};

const deleteModalHeaderStackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.themeDarker,
        verticalAlign: 'center'
    },
};
const deleteModalHeaderStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 0,
};
const deleteModalItemStackTokens: IStackTokens = {
    childrenGap: 15,
    padding: 10,
};
const deleteModalStackItemStyles: IStackStyles = {
    root: {
        verticalAlign: 'center',
        textAlign: 'center',
    },
};
const deleteModalHeaderStackItemTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,

};
const deleteModalHeaderIconClass = mergeStyles({
    fontSize: 30,
    height: 20,
    width: 20,
    margin: '5px 0 0 5px',
    color: DefaultPalette.themeLighterAlt,
});
const deleteModalHeaderLabelStyles = mergeStyles({
    color: DefaultPalette.themeLighterAlt,
    fontSize: 20,
    textAlign: 'center',
    margin: '0px 0px 11px -17px'
});


export default class SectionsContainerComponent extends React.Component<{}, ISectionsContainerComponentState> {

    constructor(state: ISectionsContainerComponentState) {
        super(state);
        this.state = { sectionItemTitles: [], sections: [], isGenerateSectionsButtonDisabled: false, deleteSectionItemModalWarningText: "", isDeleteSectionItemModalOpen: false, sectionIndexToDelete: -1, sectionItemIndexToDelete: -1 };
    }

    public render(): React.ReactElement<{}> {
        // console.log("SectionsContainerComponent=>render->");
        // if (this.state.sections.length > 0) {
        //     console.log(this.state.sections[0].sectionItems);
        // }
        return (
            <div>
                <div>
                    <ActionButton iconProps={generateIcon} onClick={this.onGenerateSectionsButtonClicked.bind(this)} disabled={this.state.isGenerateSectionsButtonDisabled} >Generate Sections</ActionButton>
                    <ActionButton iconProps={viewIcon} onClick={this.viewState.bind(this)} >View 'State' in console</ActionButton>
                </div>
                <div>
                    <div>
                        {this.state.sections.length > 0 ?
                            < Stack styles={stackStyles} tokens={stackTokens}>
                                {
                                    this.state.sections.map((eachSection) => {
                                        return (<div><SectionComponent onUpdateParentState={this.onUpdateParentStateCallFromSection} onAddSectionItem={this.onAddNewSectionItemFromSection} onDeleteSectionItem={this.onDeleteNewSectionItemFromSection} sectionItemTitles={this.state.sectionItemTitles} section={eachSection} key={eachSection.locationId} /></div>);
                                    })

                                }
                            </Stack>
                            : <div></div>
                        }
                    </div>
                </div>
                <div>
                    <Modal isOpen={this.state.isDeleteSectionItemModalOpen}>
                        <Stack>
                            <Stack horizontal styles={deleteModalHeaderStackStyles} tokens={deleteModalHeaderStackTokens}>
                                <Stack.Item align="baseline" tokens={deleteModalHeaderStackItemTokens}>
                                    <FontIcon aria-label="Delete" iconName="Delete" className={deleteModalHeaderIconClass} />
                                </Stack.Item>
                                <Stack.Item align="end" grow >
                                    <Label className={deleteModalHeaderLabelStyles}>Delete Item?</Label>
                                </Stack.Item>
                            </Stack>
                            <Stack>
                                <Stack.Item align='auto' tokens={deleteModalHeaderStackItemTokens}>
                                    Are you sure you want to delete '{this.state.deleteSectionItemModalWarningText}' ?
                                </Stack.Item>
                            </Stack>
                            <Stack styles={deleteModalStackItemStyles} tokens={deleteModalItemStackTokens}>
                                <Stack.Item>
                                    <PrimaryButton text="Yes, delete" iconProps={yesIcon} onClick={this.onConfirmDeleteNewSectionItemFromSection.bind(-1, -1)}></PrimaryButton>
                                </Stack.Item>
                                <Stack.Item>
                                    <DefaultButton text="No, do not delete" iconProps={noIcon} onClick={this.onConfirmNotDeleteNewSectionItemFromSection}></DefaultButton>
                                </Stack.Item>
                            </Stack>
                        </Stack>
                    </Modal>
                </div>
            </div >

        );
    }

    private onAddNewSectionItemFromSection = (sectionId, sectionLocationId, sectionItemId, sectionItemLocationId) => {
        // console.log("SectionsContainerComponent=>onAddNewSectionItemFromSection->");
        // console.log(sectionId + "-" + sectionLocationId + "|" + sectionItemId + "-" + sectionItemLocationId);
        let newSectionItemId = this.randomNumberGenerator();
        // let newSectionItemTitle = { id: this.state.sectionItemTitles[(this.state.sections.length + 1)].id, title: this.state.sectionItemTitles[(this.state.sections.length + 1)].title };
        let newSectionItemTitle = undefined;
        let newSectionItemLocationId = (sectionItemLocationId + 1);
        let newSectionItemSectionId = sectionId;

        let newSectionItem: ISectionItem = { id: newSectionItemId, title: newSectionItemTitle, locationId: newSectionItemLocationId, sectionId: newSectionItemSectionId };

        let tempSectionsFromState = [...this.state.sections];
        // console.log(tempSectionsFromState[sectionLocationId].sectionItems);
        let tempSectionItemsFromState = [...tempSectionsFromState[sectionLocationId].sectionItems];
        tempSectionItemsFromState.splice(newSectionItemLocationId, 0, newSectionItem);
        tempSectionItemsFromState.forEach((item, index, arr) => {
            item.locationId = index;
        });
        tempSectionsFromState[sectionLocationId].sectionItems = tempSectionItemsFromState;
        // console.log(tempSectionsFromState[sectionLocationId].sectionItems);
        // tempSectionsFromState[sectionLocationId].sectionItems.push(newSectionItem);
        this.setState({ sections: tempSectionsFromState });
    }
    private onDeleteNewSectionItemFromSection = (sectionId, sectionLocationId, sectionItemId, sectionItemLocationId) => {
        if (this.state.sections[sectionLocationId].sectionItems[sectionItemLocationId].title == undefined) {
            // this.setState({ isDeleteSectionItemModalOpen: false, sectionIndexToDelete: sectionLocationId, sectionItemIndexToDelete: sectionItemLocationId });
            this.onConfirmDeleteNewSectionItemFromSection(sectionLocationId, sectionItemLocationId);
        }
        else {
            let sectionItemToBeDeletedTitle: string = this.state.sections[sectionLocationId].sectionItems[sectionItemLocationId].title.title + ' in ' + this.state.sections[sectionLocationId].title;
            this.setState({ deleteSectionItemModalWarningText: sectionItemToBeDeletedTitle, isDeleteSectionItemModalOpen: true, sectionIndexToDelete: sectionLocationId, sectionItemIndexToDelete: sectionItemLocationId });
        }
        // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
        // let tempSectionsFromState = [...this.state.sections];
        // tempSectionsFromState[sectionLocationId].sectionItems.splice(sectionItemLocationId, 1);
        // this.setState({ sections: tempSectionsFromState });
    }
    private onConfirmDeleteNewSectionItemFromSection = (sectionIndexToDelete?: number, sectionItemIndexToDelete?: number) => {
        // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection" + sectionIndexToDelete + "|" + sectionItemIndexToDelete);
        if (sectionIndexToDelete != -1 && sectionItemIndexToDelete != -1) {
            // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->Index Minus One->" + sectionIndexToDelete + "|" + sectionItemIndexToDelete);
            this.setState({ isDeleteSectionItemModalOpen: false });

            let tempSectionsFromState = [...this.state.sections];
            tempSectionsFromState[sectionIndexToDelete].sectionItems.splice(sectionItemIndexToDelete, 1);
            this.setState({ sections: tempSectionsFromState });
        }
        else {
            this.setState({ isDeleteSectionItemModalOpen: false });
            // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
            let tempSectionsFromState = [...this.state.sections];
            if (tempSectionsFromState[this.state.sectionIndexToDelete] != undefined) {
                // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->Actual Index->" + this.state.sectionIndexToDelete + "|" + this.state.sectionItemIndexToDelete);
                tempSectionsFromState[this.state.sectionIndexToDelete].sectionItems.splice(this.state.sectionItemIndexToDelete, 1);
                this.setState({ sections: tempSectionsFromState });
            }
        }
    }
    private onConfirmNotDeleteNewSectionItemFromSection = () => {
        this.setState({ isDeleteSectionItemModalOpen: false });
        // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
        // let tempSectionsFromState = [...this.state.sections];
        // tempSectionsFromState[sectionLocationId].sectionItems.splice(sectionItemLocationId, 1);
        // this.setState({ sections: tempSectionsFromState });
    }

    private onUpdateParentStateCallFromSection = (section: ISection) => {
        let newSectionItems: ISectionItem[] = [];
        for (let i = 0; i < section.sectionItems.length; i++) {
            newSectionItems.push({ id: section.sectionItems[i].id, title: section.sectionItems[i].title, locationId: i, sectionId: section.sectionItems[i].sectionId });
        }

        let tempSectionsFromState = [...this.state.sections];
        // tempSectionsFromState[section.locationId].sectionItems = newSectionItems;
        let tempSectionsSectionItemsFromState = [...tempSectionsFromState[section.locationId].sectionItems];
        tempSectionsSectionItemsFromState = newSectionItems;
        tempSectionsFromState[section.locationId].sectionItems = tempSectionsSectionItemsFromState;

        this.setState({ sections: tempSectionsFromState });

    }

    private onGenerateSectionsButtonClicked(event?: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ isGenerateSectionsButtonDisabled: true });
        let newSections: ISection[] = [];
        let newSectionItemTitles: ISectionItemTitle[] = [];
        let sectionLocationId: number = 0;

        for (let indexA = 0; indexA < 100; indexA++) {
            let newSectionItemTitleId: number = 0;
            let newSectionItemTitleTitle: string = "";
            if (indexA > 0) {
                newSectionItemTitleId = this.randomNumberGenerator();
                newSectionItemTitleTitle = ("Item " + (indexA));
            }
            newSectionItemTitles.push({ id: newSectionItemTitleId, title: newSectionItemTitleTitle });
        }

        this.setState({ sectionItemTitles: newSectionItemTitles });

        for (let indexX = 0; indexX < 1; indexX++) {
            let sectionItemLocationId: number = 0;
            let newSectionItems: ISectionItem[] = [];
            let newSectionId: number = this.randomNumberGenerator();
            let newSectionTitle: string = ("Section " + (indexX + 1));

            for (let indexY = 0; indexY < 1; indexY++) {
                if (indexX === 0) {
                    newSectionItems.push({ id: this.randomNumberGenerator(), title: undefined, locationId: sectionItemLocationId, sectionId: newSectionId });
                }
                else {
                    newSectionItems.push({ id: this.randomNumberGenerator(), title: { id: newSectionItemTitles[indexY].id, title: newSectionItemTitles[indexY].title }, locationId: sectionItemLocationId, sectionId: newSectionId });
                }
                sectionItemLocationId++;
            }
            newSections.push({ id: newSectionId, title: newSectionTitle, locationId: sectionLocationId, isExpanded: true, sectionItems: newSectionItems });
            sectionLocationId++;

            this.setState({ sections: newSections });
        }
    }

    private viewState() {
        console.log("SectionsContainerComponent=>viewState->");
        if (this.state.sections.length > 0) {
            console.log(this.state.sections);
        }
    }

    private randomNumberGenerator(): number {
        let min = 1;
        let max = 999;
        let rand = min + (Math.random() * (max - min));
        return Math.round(rand);
    }
}