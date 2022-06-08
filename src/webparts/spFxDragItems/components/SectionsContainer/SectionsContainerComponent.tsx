import * as React from 'react';

import { ActionButton, PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';
import { Stack, IStackStyles, IStackTokens, IStackItemStyles, Modal, FontIcon, mergeStyles, Label } from 'office-ui-fabric-react';
import { DefaultPalette } from 'office-ui-fabric-react';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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


function SectionsContainerComponent(props) {
    const [sectionItemTitles, setSectionItemTitles] = React.useState([]);
    const [sections, setSections] = React.useState([]);
    const [isGenerateSectionsButtonDisabled, setIsGenerateSectionsButtonDisabled] = React.useState(false);
    const [deleteSectionItemModalWarningText, setDeleteSectionItemModalWarningText] = React.useState("");
    const [isDeleteSectionModalOpen, setIsDeleteSectionModalOpen] = React.useState(false);
    const [isDeleteSectionItemModalOpen, setIsDeleteSectionItemModalOpen] = React.useState(false);
    const [sectionIndexToDelete, setSectionIndexToDelete] = React.useState(-1);
    const [sectionItemIndexToDelete, setSectionItemIndexToDelete] = React.useState(-1);
    const [isDragged, setIsDragged] = React.useState(false);

    //This distance parameter ensures that drag event is avoided until unless dragged for more than 7px. This is used to prevent the drag event applying for child elements like button
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: { y: 7 },
            },
        })
    );

    const onComponentItemDragStart = (event) => {
        try {
            console.log("SectionsContainerComponent=>onComponentItemDragStart->");
            console.log(event.target);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onComponentItemDragStart'", Error);
        }
    };

    const onComponentItemDragEnd = ({ active, over }) => {
        try {
            console.log("SectionsContainerComponent=>onComponentItemDragEnd->");
            if (active.id != over.id) {
                // setIsDragged(true);
                // const oldIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === active.id);
                // const newIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === over.id);
                // let reIndexedSectionItems = arrayMove(sectionItems, oldIndex, newIndex);
                // setSectionItems(reIndexedSectionItems);
                // setSectionItems((sectionItems) => {
                //     const oldIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === active.id);
                //     const newIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === over.id);
                //     return arrayMove(sectionItems, oldIndex, newIndex);
                // });
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onComponentItemDragEnd'", Error);
        }
    };

    //#region [Green] Section Items - Start
    const onAddNewSectionItemFromSection = (sectionId, sectionLocationId, sectionItemId, sectionItemLocationId) => {
        try {
            // console.log("SectionsContainerComponent=>onAddNewSectionItemFromSection->");
            // console.log(sectionId + "-" + sectionLocationId + "|" + sectionItemId + "-" + sectionItemLocationId);
            let newSectionItemId = randomNumberGenerator();
            // let newSectionItemTitle = { id: sectionItemTitles[(sections.length + 1)].id, title: sectionItemTitles[(sections.length + 1)].title };
            let newSectionItemTitle = undefined;
            let newSectionItemLocationId = (sectionItemLocationId + 1);
            let newSectionItemSectionId = sectionId;

            let newSectionItem: ISectionItem = { id: newSectionItemId, title: newSectionItemTitle, locationId: newSectionItemLocationId, sectionId: newSectionItemSectionId };

            let tempSectionsFromState = [...sections];
            // console.log(tempSectionsFromState[sectionLocationId].sectionItems);
            let tempSectionItemsFromState = [...tempSectionsFromState[sectionLocationId].sectionItems];
            tempSectionItemsFromState.splice(newSectionItemLocationId, 0, newSectionItem);
            tempSectionItemsFromState.forEach((item, index, arr) => {
                item.locationId = index;
            });
            tempSectionsFromState[sectionLocationId].sectionItems = tempSectionItemsFromState;
            // console.log(tempSectionsFromState[sectionLocationId].sectionItems);
            // tempSectionsFromState[sectionLocationId].sectionItems.push(newSectionItem);
            // this.setState({ sections: tempSectionsFromState });
            setSections(tempSectionsFromState);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onAddNewSectionItemFromSection'", Error);
        }
    };

    const onDeleteNewSectionItemFromSection = (sectionId, sectionLocationId, sectionItemId, sectionItemLocationId) => {
        try {
            if (sections[sectionLocationId].sectionItems[sectionItemLocationId].title == undefined) {
                // this.setState({ isDeleteSectionItemModalOpen: false, sectionItemIndexToDelete: sectionLocationId, sectionItemIndexToDelete: sectionItemLocationId });
                onConfirmDeleteNewSectionItemFromSection(sectionLocationId, sectionItemLocationId);
            }
            else {
                let sectionItemToBeDeletedTitle: string = sections[sectionLocationId].sectionItems[sectionItemLocationId].title.title + ' in ' + sections[sectionLocationId].title;
                // this.setState({
                //     deleteSectionItemModalWarningText: sectionItemToBeDeletedTitle,
                //     isDeleteSectionModalOpen: false,
                //     isDeleteSectionItemModalOpen: true,
                //     sectionIndexToDelete: sectionLocationId,
                //     sectionItemIndexToDelete: sectionItemLocationId
                // });
                setDeleteSectionItemModalWarningText(sectionItemToBeDeletedTitle);
                setIsDeleteSectionModalOpen(false);
                setIsDeleteSectionItemModalOpen(true);
                setSectionIndexToDelete(sectionLocationId);
                setSectionItemIndexToDelete(sectionItemLocationId);
            }
            // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
            // let tempSectionsFromState = [...sections];
            // tempSectionsFromState[sectionLocationId].sectionItems.splice(sectionItemLocationId, 1);
            // this.setState({ sections: tempSectionsFromState });
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onDeleteNewSectionItemFromSection'", Error);
        }
    };

    const onConfirmDeleteNewSectionItemFromSection = (sectionIndexToDeleteFromSection?: number, sectionItemIndexToDeleteFromSection?: number) => {
        try {
            // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection" + sectionItemIndexToDelete + "|" + sectionItemIndexToDelete);
            if (sectionIndexToDeleteFromSection != -1 && sectionItemIndexToDeleteFromSection != -1) {
                // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->Index Minus One->" + sectionItemIndexToDelete + "|" + sectionItemIndexToDelete);
                // this.setState({ isDeleteSectionItemModalOpen: false });
                setIsDeleteSectionItemModalOpen(false);

                let tempSectionsFromState = [...sections];
                tempSectionsFromState[sectionIndexToDeleteFromSection].sectionItems.splice(sectionItemIndexToDeleteFromSection, 1);
                // this.setState({
                //     sections: tempSectionsFromState,
                //     sectionIndexToDelete: -1,
                //     sectionItemIndexToDelete: -1
                // });
                setSections(tempSectionsFromState);
                setSectionIndexToDelete(-1);
                setSectionItemIndexToDelete(-1);
            }
            else {
                // this.setState({ isDeleteSectionItemModalOpen: false });
                setIsDeleteSectionItemModalOpen(false);
                // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
                let tempSectionsFromState = [...sections];
                if (tempSectionsFromState[sectionIndexToDelete] != undefined) {
                    // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->Actual Index->" + sectionItemIndexToDelete + "|" + sectionItemIndexToDelete);
                    tempSectionsFromState[sectionIndexToDelete].sectionItems.splice(sectionItemIndexToDelete, 1);
                    // this.setState({
                    //     sections: tempSectionsFromState,
                    //     sectionIndexToDelete: -1,
                    //     sectionItemIndexToDelete: -1
                    // });
                    setSections(tempSectionsFromState);
                    setSectionIndexToDelete(-1);
                    setSectionItemIndexToDelete(-1);
                }
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onConfirmDeleteNewSectionItemFromSection'", Error);
        }
    };

    const onConfirmNotDeleteNewSectionItemFromSection = () => {
        // this.setState({ isDeleteSectionItemModalOpen: false });
        setIsDeleteSectionItemModalOpen(false);
    };

    const onUpdateParentStateCallFromSection = (section: ISection) => {
        try {
            let newSectionItems: ISectionItem[] = [];
            for (let i = 0; i < section.sectionItems.length; i++) {
                newSectionItems.push({ id: section.sectionItems[i].id, title: section.sectionItems[i].title, locationId: i, sectionId: section.sectionItems[i].sectionId });
            }

            let tempSectionsFromState = [...sections];
            // tempSectionsFromState[section.locationId].sectionItems = newSectionItems;
            let tempSectionsSectionItemsFromState = [...tempSectionsFromState[section.locationId].sectionItems];
            tempSectionsSectionItemsFromState = newSectionItems;
            tempSectionsFromState[section.locationId].sectionItems = tempSectionsSectionItemsFromState;

            // this.setState({ sections: tempSectionsFromState });
            setSections(tempSectionsFromState);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onUpdateParentStateCallFromSection'", Error);
        }
    };
    //#endregion Section Items - End

    //#region [Orange] Section - Start
    const onGenerateSectionsButtonClicked = (event?: React.MouseEvent<HTMLButtonElement>) => {
        try {
            // this.setState({ isGenerateSectionsButtonDisabled: true });
            setIsGenerateSectionsButtonDisabled(true);
            let newSections: ISection[] = [];
            let newSectionItemTitles: ISectionItemTitle[] = [];
            let sectionLocationId: number = 0;

            for (let indexA = 0; indexA < 100; indexA++) {
                let newSectionItemTitleId: number = 0;
                let newSectionItemTitleTitle: string = "";
                if (indexA > 0) {
                    newSectionItemTitleId = randomNumberGenerator();
                    newSectionItemTitleTitle = ("Item " + (indexA));
                }
                newSectionItemTitles.push({ id: newSectionItemTitleId, title: newSectionItemTitleTitle });
            }

            // this.setState({ sectionItemTitles: newSectionItemTitles });
            setSectionItemTitles(newSectionItemTitles);

            for (let indexX = 0; indexX < 1; indexX++) {
                let sectionItemLocationId: number = 0;
                let newSectionItems: ISectionItem[] = [];
                let newSectionId: number = randomNumberGenerator();
                let newSectionTitle: string = undefined;

                for (let indexY = 0; indexY < 1; indexY++) {
                    if (indexX === 0) {
                        newSectionItems.push({ id: randomNumberGenerator(), title: undefined, locationId: sectionItemLocationId, sectionId: newSectionId });
                    }
                    else {
                        newSectionItems.push({ id: randomNumberGenerator(), title: { id: newSectionItemTitles[indexY].id, title: newSectionItemTitles[indexY].title }, locationId: sectionItemLocationId, sectionId: newSectionId });
                    }
                    sectionItemLocationId++;
                }
                newSections.push({ id: newSectionId, title: newSectionTitle, locationId: sectionLocationId, isExpanded: true, sectionItems: newSectionItems });
                sectionLocationId++;

                // this.setState({ sections: newSections });
                setSections(newSections);
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onGenerateSectionsButtonClicked'", Error);
        }
    };

    const onAddNewSectionFromSection = (sectionId, sectionLocationId) => {
        try {
            let newSectionId = randomNumberGenerator();
            let newSectionTitle = undefined;

            let newSectionItemId = randomNumberGenerator();
            let newSectionItemTitle = undefined;
            let newSectionItemLocationId = 0;

            let newSectionItem: ISectionItem[] = [{ id: newSectionItemId, title: newSectionItemTitle, locationId: newSectionItemLocationId, sectionId: newSectionId }];
            let newSection: ISection = { id: newSectionId, title: newSectionTitle, locationId: -1, isExpanded: true, sectionItems: newSectionItem };

            let tempSectionsFromState = [...sections];
            // console.log(tempSectionsFromState);
            tempSectionsFromState.splice((sectionLocationId + 1), 0, newSection);
            tempSectionsFromState.forEach((item, index, arr) => {
                item.locationId = index;
            });
            // console.log(tempSectionsFromState);

            // this.setState({ sections: tempSectionsFromState });
            setSections(tempSectionsFromState);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onAddNewSectionFromSection'", Error);
        }
    };

    const onDeleteSectionFromSection = (sectionId, sectionLocationId) => {
        try {
            if (sections[sectionLocationId].title == undefined) {
                // this.setState({ isDeleteSectionItemModalOpen: false, sectionItemIndexToDelete: sectionLocationId, sectionItemIndexToDelete: sectionItemLocationId });
                // console.log("SectionsContainerComponent==>onDeleteSectionFromSection=>onConfirmDeleteSectionFromSection->" + sectionLocationId);
                onConfirmDeleteSectionFromSection(sectionLocationId);
            }
            else {
                let sectionToBeDeletedTitle: string = sections[sectionLocationId].title;
                // console.log("SectionsContainerComponent==>onDeleteSectionFromSection=>->State->" + sectionLocationId);
                // this.setState({
                //     deleteSectionItemModalWarningText: sectionToBeDeletedTitle,
                //     isDeleteSectionModalOpen: true,
                //     isDeleteSectionItemModalOpen: false,
                //     sectionIndexToDelete: sectionLocationId
                // });
                setDeleteSectionItemModalWarningText(sectionToBeDeletedTitle);
                setIsDeleteSectionModalOpen(true);
                setIsDeleteSectionItemModalOpen(false);
                setSectionIndexToDelete(sectionLocationId);
            }
            // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
            // let tempSectionsFromState = [...sections];
            // tempSectionsFromState[sectionLocationId].sectionItems.splice(sectionItemLocationId, 1);
            // this.setState({ sections: tempSectionsFromState });
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onDeleteSectionFromSection'", Error);
        }
    };

    const onConfirmDeleteSectionFromSection = (sectionIndexToDeleteFromSection?: number) => {
        try {
            // console.log("SectionsContainerComponent=>onConfirmDeleteSectionFromSection->");
            // console.log(sectionIndexToDelete);
            // console.log(sectionIndexToDelete);
            if (sectionIndexToDelete == -1) {
                // console.log("SectionsContainerComponent==>onConfirmDeleteSectionFromSection->From onDeleteSectionFromSection->" + sectionIndexToDelete);
                // this.setState({ isDeleteSectionModalOpen: false });
                setIsDeleteSectionModalOpen(false);

                let tempSectionsFromState = [...sections];
                tempSectionsFromState.splice(sectionIndexToDeleteFromSection, 1);
                // this.setState({
                //     sections: tempSectionsFromState,
                //     sectionIndexToDelete: -1
                // });
                setSections(tempSectionsFromState);
                setSectionIndexToDelete(sectionIndexToDelete);
            }
            else {
                // this.setState({ isDeleteSectionModalOpen: false });
                setIsDeleteSectionModalOpen(false);
                // console.log("SectionsContainerComponent=>onDeleteNewSectionItemFromSection->");
                let tempSectionsFromState = [...sections];
                if (tempSectionsFromState[sectionIndexToDelete] != undefined) {
                    // console.log("SectionsContainerComponent==>onConfirmDeleteSectionFromSection->From State->" + sectionIndexToDelete);
                    tempSectionsFromState.splice(sectionIndexToDelete, 1);
                    // this.setState({
                    //     sections: tempSectionsFromState,
                    //     sectionIndexToDelete: -1
                    // });
                    setSections(tempSectionsFromState);
                    setSectionIndexToDelete(-1);
                }
            }
            // console.log("SectionsContainerComponent==>onDeleteNewSectionItemFromSection->Sections Length->" + sections.length);
            if (sections.length <= 1) {
                // this.setState({ isGenerateSectionsButtonDisabled: false });
                setIsGenerateSectionsButtonDisabled(false);
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onConfirmDeleteSectionFromSection'", Error);
        }
    };

    const onConfirmNotDeleteNewSectionFromSection = () => {
        try {
            // this.setState({ isDeleteSectionModalOpen: false });
            setIsDeleteSectionModalOpen(false);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onConfirmNotDeleteNewSectionFromSection'", Error);
        }
    };

    const onSectionTitleChange = (sectionId: number, sectionLocationId: number, sectionTitle: string) => {
        try {
            // console.log(sectionId + "|" + sectionLocationId + "|" + sectionTitle);
            let tempSectionsFromState = [...sections];
            tempSectionsFromState[sectionLocationId].title = sectionTitle;
            // this.setState({ sections: tempSectionsFromState });
            setSections(tempSectionsFromState);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onSectionTitleChange'", Error);
        }
    };

    const viewState = () => {
        try {
            console.log("SectionsContainerComponent=>viewState->");
            if (sections.length > 0) {
                console.log(sections);
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>viewState'", Error);
        }
    };

    const randomNumberGenerator = () => {
        try {
            let min = 1;
            let max = 999;
            let rand = min + (Math.random() * (max - min));
            return Math.round(rand);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>randomNumberGenerator'", Error);
        }
    };
    //#endregion Section - End

    return (
        <div>
            <div>
                <ActionButton iconProps={generateIcon} onClick={onGenerateSectionsButtonClicked.bind(this)} disabled={isGenerateSectionsButtonDisabled} >Generate Sections</ActionButton>
                <ActionButton iconProps={viewIcon} onClick={viewState.bind(this)} >View 'State' in console</ActionButton>
            </div>
            <div>
                <div>
                    {sections.length > 0 ?
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onComponentItemDragStart} onDragEnd={onComponentItemDragEnd} >
                            <SortableContext items={sections.map(sectionItem => sectionItem.locationId.toString())} strategy={verticalListSortingStrategy} >
                                <Stack styles={stackStyles} tokens={stackTokens}>
                                    {
                                        sections.map((eachSection) => {
                                            return (<div key={eachSection.locationId}><SectionComponent
                                                onAddSection={onAddNewSectionFromSection}
                                                onDeleteSection={onDeleteSectionFromSection}
                                                onUpdateParentState={onUpdateParentStateCallFromSection}
                                                onAddSectionItem={onAddNewSectionItemFromSection}
                                                onDeleteSectionItem={onDeleteNewSectionItemFromSection}
                                                onSectionTitleChange={onSectionTitleChange}
                                                sectionItemTitles={sectionItemTitles}
                                                section={eachSection}
                                                key={eachSection.locationId} /></div>);
                                        })

                                    }
                                </Stack>
                            </SortableContext>
                        </DndContext>
                        : <div></div>
                    }
                </div>
            </div>
            <div>
                <Modal isOpen={isDeleteSectionItemModalOpen}>
                    <Stack>
                        <Stack horizontal styles={deleteModalHeaderStackStyles} tokens={deleteModalHeaderStackTokens}>
                            <Stack.Item align="baseline" tokens={deleteModalHeaderStackItemTokens}>
                                <FontIcon aria-label="Delete" iconName="Delete" className={deleteModalHeaderIconClass} />
                            </Stack.Item>
                            <Stack.Item align="end" grow >
                                <Label className={deleteModalHeaderLabelStyles}>Delete Section Item?</Label>
                            </Stack.Item>
                        </Stack>
                        <Stack>
                            <Stack.Item align='auto' tokens={deleteModalHeaderStackItemTokens}>
                                Are you sure you want to delete '{deleteSectionItemModalWarningText}' ?
                            </Stack.Item>
                        </Stack>
                        <Stack styles={deleteModalStackItemStyles} tokens={deleteModalItemStackTokens}>
                            <Stack.Item>
                                <PrimaryButton text="Yes, delete" iconProps={yesIcon} onClick={onConfirmDeleteNewSectionItemFromSection.bind(-1, -1)}></PrimaryButton>
                            </Stack.Item>
                            <Stack.Item>
                                <DefaultButton text="No, do not delete" iconProps={noIcon} onClick={onConfirmNotDeleteNewSectionItemFromSection}></DefaultButton>
                            </Stack.Item>
                        </Stack>
                    </Stack>
                </Modal>
                <Modal isOpen={isDeleteSectionModalOpen}>
                    <Stack>
                        <Stack horizontal styles={deleteModalHeaderStackStyles} tokens={deleteModalHeaderStackTokens}>
                            <Stack.Item align="baseline" tokens={deleteModalHeaderStackItemTokens}>
                                <FontIcon aria-label="Delete" iconName="Delete" className={deleteModalHeaderIconClass} />
                            </Stack.Item>
                            <Stack.Item align="end" grow >
                                <Label className={deleteModalHeaderLabelStyles}>Delete Section?</Label>
                            </Stack.Item>
                        </Stack>
                        <Stack>
                            <Stack.Item align='auto' tokens={deleteModalHeaderStackItemTokens}>
                                Are you sure you want to delete '{deleteSectionItemModalWarningText}' ?
                            </Stack.Item>
                        </Stack>
                        <Stack styles={deleteModalStackItemStyles} tokens={deleteModalItemStackTokens}>
                            <Stack.Item>
                                <PrimaryButton text="Yes, delete" iconProps={yesIcon} onClick={onConfirmDeleteSectionFromSection.bind(-1)}></PrimaryButton>
                            </Stack.Item>
                            <Stack.Item>
                                <DefaultButton text="No, do not delete" iconProps={noIcon} onClick={onConfirmNotDeleteNewSectionFromSection}></DefaultButton>
                            </Stack.Item>
                        </Stack>
                    </Stack>
                </Modal>
            </div>
        </div >

    );
}

export default SectionsContainerComponent;