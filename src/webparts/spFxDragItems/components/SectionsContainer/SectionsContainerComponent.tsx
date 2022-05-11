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
                </div>
                <div>
                    <div>
                        {this.state.sections.length > 0 ?
                            < Stack styles={stackStyles} tokens={itemAlignmentsStackTokens}>
                                {
                                    this.state.sections.map((eachSection) => {
                                        return (<div><SectionComponent id={eachSection.id} title={eachSection.title} locationId={eachSection.locationId} isExpanded={eachSection.isExpanded} key={eachSection.id} sectionItems={eachSection.sectionItems} /></div>);
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

    private generateSectionsButtonClicked(event?: React.MouseEvent<HTMLButtonElement>) {
        this.setState({ isGenerateSectionsButtonDisabled: true });
        let newSections: ISection[] = [];

        for (let indexX = 0; indexX < 4; indexX++) {
            let newSectionItems: ISectionItem[] = [];
            let newSectionId: number = this.randomNumberGenerator();
            let newSectionTitle: string = ("Section " + (indexX + 1));

            for (let indexY = 0; indexY < 4; indexY++) {
                newSectionItems.push({ id: this.randomNumberGenerator(), title: (newSectionTitle + " Item " + (indexY + 1)), locationId: indexY, sectionId: newSectionId });
            }
            newSections.push({ id: newSectionId, title: newSectionTitle, locationId: indexX, isExpanded: false, sectionItems: newSectionItems });
        }
        this.setState({ sections: newSections });
        // console.log("SectionsContainerComponent=>generateSectionsButtonClicked->");
        // console.log(newSections);
    }

    private randomNumberGenerator(): number {
        let min = 1;
        let max = 999999;
        let rand = min + (Math.random() * (max - min));
        return Math.round(rand);
    }
}