import * as React from 'react';

import { ActionButton, PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles, Modal, FontIcon, mergeStyles, Label } from 'office-ui-fabric-react';
import { DefaultPalette } from 'office-ui-fabric-react';

import { ISectionsContainerComponentState } from './ISectionsContainerComponentState';
import ISection from "../../models/ISection";
import ISectionItem from "../../models/ISectionItem";
import SectionComponent from '../Section/SectionComponent';

const generateIcon: IIconProps = { iconName: 'SyncStatus' };
const viewIcon: IIconProps = { iconName: 'EntryView' };
const yesIcon: IIconProps = { iconName: 'Accept' };
const noIcon: IIconProps = { iconName: 'CalculatorMultiply' };


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
        this.state = { sections: [], isGenerateSectionsButtonDisabled: false, deleteSectionItemModalWarningText: "", isDeleteSectionItemModalOpen: false, sectionIndexToDelete: -1, sectionItemIndexToDelete: -1 };
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
                                        return (<div><SectionComponent onUpdateParentState={this.onUpdateParentStateCallFromSection} onAddSection={this.onAddNewSectionItemFromSection} onDeleteSection={this.onDeleteNewSectionItemFromSection} section={eachSection} key={eachSection.locationId} /></div>);
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
                                    <FontIcon aria-label="Warning12" iconName="Warning12" className={deleteModalHeaderIconClass} />
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
                                    <PrimaryButton text="Yes, delete" iconProps={yesIcon} onClick={this.onConfirmDeleteNewSectionItemFromSection}></PrimaryButton>
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

    private onAddNewSectionItemFromSection = (sectionId, sectionLocationId) => {
        let newSectionItemId = this.randomNumberGenerator();
        let newSectionItemTitle = ("Item " + (this.state.sections.length + 1));
        let newSectionItemLocationId = (this.state.sections[sectionLocationId].sectionItems.length);
        let newSectionItemSectionId = sectionId;

        let newSectionItem: ISectionItem = { id: newSectionItemId, title: newSectionItemTitle, locationId: newSectionItemLocationId, sectionId: newSectionItemSectionId };

        let tempSectionsFromState = [...this.state.sections];
        tempSectionsFromState[sectionLocationId].sectionItems.push(newSectionItem);
        this.setState({ sections: tempSectionsFromState });
    }
    private onDeleteNewSectionItemFromSection = (sectionId, sectionLocationId, sectionItemId, sectionItemLocationId) => {
        let sectionItemToBeDeletedTitle: string = this.state.sections[sectionLocationId].sectionItems[sectionItemLocationId].title + ' in ' + this.state.sections[sectionLocationId].title;
        this.setState({ deleteSectionItemModalWarningText: sectionItemToBeDeletedTitle, isDeleteSectionItemModalOpen: true, sectionIndexToDelete: sectionLocationId, sectionItemIndexToDelete: sectionItemLocationId });
        // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
        // let tempSectionsFromState = [...this.state.sections];
        // tempSectionsFromState[sectionLocationId].sectionItems.splice(sectionItemLocationId, 1);
        // this.setState({ sections: tempSectionsFromState });
    }
    private onConfirmDeleteNewSectionItemFromSection = () => {
        this.setState({ isDeleteSectionItemModalOpen: false });
        // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
        let tempSectionsFromState = [...this.state.sections];
        tempSectionsFromState[this.state.sectionIndexToDelete].sectionItems.splice(this.state.sectionItemIndexToDelete, 1);
        this.setState({ sections: tempSectionsFromState });
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
        tempSectionsFromState[section.locationId].sectionItems = newSectionItems;

        this.setState({ sections: tempSectionsFromState });

    }

    private onGenerateSectionsButtonClicked(event?: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ isGenerateSectionsButtonDisabled: true });
        let newSections: ISection[] = [];
        let sectionLocationId: number = 0;

        for (let indexX = 0; indexX < 3; indexX++) {
            let sectionItemLocationId: number = 0;
            let newSectionItems: ISectionItem[] = [];
            let newSectionId: number = this.randomNumberGenerator();
            let newSectionTitle: string = ("Section " + (indexX + 1));

            for (let indexY = 0; indexY < 4; indexY++) {
                newSectionItems.push({ id: this.randomNumberGenerator(), title: ("Item " + (indexY + 1)), locationId: sectionItemLocationId, sectionId: newSectionId });
                sectionItemLocationId++;
            }
            newSections.push({ id: newSectionId, title: newSectionTitle, locationId: sectionLocationId, isExpanded: true, sectionItems: newSectionItems });
            sectionLocationId++;
        }
        this.setState({ sections: newSections });
    }

    private viewState() {
        console.log("SectionsContainerComponent=>viewState->");
        if (this.state.sections.length > 0) {
            console.log(this.state.sections[0].sectionItems);
        }
    }

    private randomNumberGenerator(): number {
        let min = 1;
        let max = 99;
        let rand = min + (Math.random() * (max - min));
        return Math.round(rand);
    }
}