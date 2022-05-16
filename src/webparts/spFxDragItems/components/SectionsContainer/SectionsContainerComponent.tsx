import * as React from 'react';

import { ActionButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
import { DefaultPalette } from 'office-ui-fabric-react';

import { ISectionsContainerComponentState } from './ISectionsContainerComponentState';
import ISection from "../../models/ISection";
import ISectionItem from "../../models/ISectionItem";
import SectionComponent from '../Section/SectionComponent';
import { forEach } from 'lodash';


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
        // console.log(this.state.sections);
        return (
            <div>
                <div>
                    <ActionButton iconProps={generateIcon} onClick={this.generateSectionsButtonClicked.bind(this)} disabled={this.state.isGenerateSectionsButtonDisabled} >Generate Sections</ActionButton>
                    <ActionButton iconProps={viewIcon} onClick={this.viewState.bind(this)} >View State</ActionButton>
                </div>
                <div>
                    <div>
                        {this.state.sections.length > 0 ?
                            < Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
                                {
                                    this.state.sections.map((eachSection) => {
                                        return (<div><SectionComponent updateParentState={this.onUpdateParentStateCall} section={eachSection} key={eachSection.locationId} /></div>);
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

    public onUpdateParentStateCall = (section: ISection) => {
        // console.log("SectionComponent=>onUpdateParentStateCall");
        // console.log(section);
        let newSectionItems: ISectionItem[] = [];
        for (let i = 0; i < section.sectionItems.length; i++) {
            newSectionItems.push({ id: section.sectionItems[i].id, title: section.sectionItems[i].title, locationId: i, sectionId: section.sectionItems[i].sectionId });
        }

        // let 
        // this.setState({
        //     sections: this.state.sections.map(currentSection => (currentSection.id === section.id) ? { ...currentSection, sectionItems } : newSectionItems)
        // });

        // // let tempSection = this.state.sections.filter(thisSection => thisSection.id === section.id);
        // console.log("SectionComponent=>onUpdateParentStateCall->AfterLocation");
        // console.log(newSectionItems);

        let tempSectionsFromState = [...this.state.sections];
        tempSectionsFromState[section.locationId].sectionItems = newSectionItems;

        // this.setState({ sections: tempSectionsFromState });


        // console.log(tempSectionItems.sectionItems);
    }

    private generateSectionsButtonClicked(event?: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ isGenerateSectionsButtonDisabled: true });
        let newSections: ISection[] = [];
        let sectionLocationId: number = 0;

        for (let indexX = 0; indexX < 3; indexX++) {
            let sectionItemLocationId: number = 0;
            let newSectionItems: ISectionItem[] = [];
            let newSectionId: number = this.randomNumberGenerator();
            let newSectionTitle: string = ("Section " + (indexX + 1));

            for (let indexY = 0; indexY < 4; indexY++) {
                newSectionItems.push({ id: this.randomNumberGenerator(), title: (newSectionTitle + " Item " + (indexY + 1)), locationId: sectionItemLocationId, sectionId: newSectionId });
                sectionItemLocationId++;
            }
            newSections.push({ id: newSectionId, title: newSectionTitle, locationId: sectionLocationId, isExpanded: false, sectionItems: newSectionItems });
            sectionLocationId++;
        }
        this.setState({ sections: newSections });
        // console.log("SectionsContainerComponent=>generateSectionsButtonClicked->");
        // console.log(newSections);
    }

    private viewState() {
        console.log(this.state.sections);
    }

    private randomNumberGenerator(): number {
        let min = 1;
        let max = 99;
        let rand = min + (Math.random() * (max - min));
        return Math.round(rand);
    }
}