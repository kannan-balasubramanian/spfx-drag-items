import * as React from 'react';

import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
import { DefaultPalette } from 'office-ui-fabric-react';

import { ISectionsContainerComponentState } from './ISectionsContainerComponentState';
import ISection from "../../models/ISection";
import ISectionItem from "../../models/ISectionItem";
import SectionComponent from '../Section/SectionComponent';

const generateIcon: IIconProps = { iconName: 'SyncStatus' };
const viewIcon: IIconProps = { iconName: 'EntryView' };
const stackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.neutralLight,
    },
};
const itemAlignmentsStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
};

export default class SectionsContainerComponent extends React.Component<{}, ISectionsContainerComponentState> {

    constructor(state: ISectionsContainerComponentState) {
        super(state);
        this.state = { sections: [], isGenerateSectionsButtonDisabled: false };
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
                            < Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
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
                {/* <SectionComponent /> */}
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
        console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
        let tempSectionsFromState = [...this.state.sections];
        tempSectionsFromState[sectionLocationId].sectionItems.splice(sectionItemLocationId, 1);
        this.setState({ sections: tempSectionsFromState });
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

        for (let indexX = 0; indexX < 1; indexX++) {
            let sectionItemLocationId: number = 0;
            let newSectionItems: ISectionItem[] = [];
            let newSectionId: number = this.randomNumberGenerator();
            let newSectionTitle: string = ("Section " + (indexX + 1));

            for (let indexY = 0; indexY < 4; indexY++) {
                newSectionItems.push({ id: this.randomNumberGenerator(), title: (" Item " + (indexY + 1)), locationId: sectionItemLocationId, sectionId: newSectionId });
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