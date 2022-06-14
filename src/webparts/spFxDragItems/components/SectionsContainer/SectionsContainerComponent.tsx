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
const viewStateIcon: IIconProps = { iconName: 'EntryView' };
const viewModeIcon: IIconProps = { iconName: 'View' };
const editModeIcon: IIconProps = { iconName: 'Edit' };

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
    const [sections, setSections] = React.useState<ISection[]>([]);
    const [isGenerateSectionsButtonDisabled, setIsGenerateSectionsButtonDisabled] = React.useState(false);
    const [deleteSectionItemModalWarningText, setDeleteSectionItemModalWarningText] = React.useState("");
    const [isDeleteSectionModalOpen, setIsDeleteSectionModalOpen] = React.useState(false);
    const [isDeleteSectionItemModalOpen, setIsDeleteSectionItemModalOpen] = React.useState(false);
    const [sectionIndexToDelete, setSectionIndexToDelete] = React.useState(-1);
    const [sectionItemIndexToDelete, setSectionItemIndexToDelete] = React.useState(-1);
    const [isDragged, setIsDragged] = React.useState(false);
    const [uiMode, setUiMode] = React.useState(1);

    //#region [Blue] Section Container - Start
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
            // console.log(event.target);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onComponentItemDragStart'", Error);
        }
    };

    const onComponentItemDragEnd = ({ active, over }) => {
        try {
            if (active.id != over.id) {
                setIsDragged(true);
                const oldIndex = sections.findIndex(sectionItem => sectionItem.locationId.toString() === active.id);
                const newIndex = sections.findIndex(sectionItem => sectionItem.locationId.toString() === over.id);
                let reIndexedSections = arrayMove([...sections], oldIndex, newIndex);
                reIndexedSections.forEach((item, index, arr) => {
                    item.locationId = index;
                });
                setSections(reIndexedSections);
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onComponentItemDragEnd'", Error);
        }
    };
    //#endregion [Green] Section Container - End

    //#region [Green] Section Items - Start    
    const onAddNewSectionItemFromSection = (sectionId, sectionLocationId, sectionItemId, sectionItemLocationId) => {
        try {
            let newSectionItemId = randomNumberGenerator();
            let newSectionItemTitle = undefined;
            let newSectionItemLocationId = (sectionItemLocationId + 1);
            let newSectionItemSectionId = sectionId;

            let newSectionItem: ISectionItem = { id: newSectionItemId, title: newSectionItemTitle, locationId: newSectionItemLocationId, sectionId: newSectionItemSectionId };

            let tempSectionsFromState = [...sections];
            let tempSectionItemsFromState = [...tempSectionsFromState[sectionLocationId].sectionItems];
            tempSectionItemsFromState.splice(newSectionItemLocationId, 0, newSectionItem);
            tempSectionItemsFromState.forEach((item, index, arr) => {
                item.locationId = index;
            });
            tempSectionsFromState[sectionLocationId].sectionItems = tempSectionItemsFromState;
            setSections(tempSectionsFromState);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onAddNewSectionItemFromSection'", Error);
        }
    };

    const onDeleteNewSectionItemFromSection = (sectionId, sectionLocationId, sectionItemId, sectionItemLocationId) => {

        try {
            if (sections[sectionLocationId].sectionItems[sectionItemLocationId].title == undefined) {
                onConfirmDeleteNewSectionItemFromSection(sectionLocationId, sectionItemLocationId);
            }
            else {
                let sectionItemTitle = sections[sectionLocationId].sectionItems[sectionItemLocationId].title.title;
                let sectionTitle = sections[sectionLocationId].title;
                if (sectionItemTitle == undefined) {
                    sectionItemTitle = '"Empty item with no title"';
                }
                if (sectionTitle == undefined) {
                    sectionTitle = '"Empty section with no title"';
                }
                let sectionItemToBeDeletedTitle: string = sectionItemTitle + ' in ' + sectionTitle;

                setDeleteSectionItemModalWarningText(sectionItemToBeDeletedTitle);
                setIsDeleteSectionModalOpen(false);
                setIsDeleteSectionItemModalOpen(true);
                setSectionIndexToDelete(sectionLocationId);
                setSectionItemIndexToDelete(sectionItemLocationId);
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onDeleteNewSectionItemFromSection'", Error);
        }
    };

    const onConfirmDeleteNewSectionItemFromSection = (sectionIndexToDeleteFromSection?: number, sectionItemIndexToDeleteFromSection?: number) => {
        try {
            if (sectionIndexToDeleteFromSection != -1 && sectionItemIndexToDeleteFromSection != -1) {
                setIsDeleteSectionItemModalOpen(false);

                let tempSectionsFromState = [...sections];
                tempSectionsFromState[sectionIndexToDeleteFromSection].sectionItems.splice(sectionItemIndexToDeleteFromSection, 1);

                setSections(tempSectionsFromState);
                setSectionIndexToDelete(-1);
                setSectionItemIndexToDelete(-1);
            }
            else {
                setIsDeleteSectionItemModalOpen(false);

                let tempSectionsFromState = [...sections];
                if (tempSectionsFromState[sectionIndexToDelete] != undefined) {
                    tempSectionsFromState[sectionIndexToDelete].sectionItems.splice(sectionItemIndexToDelete, 1);

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
        setIsDeleteSectionItemModalOpen(false);
    };

    const onUpdateParentStateCallFromSection = (section: ISection) => {
        try {
            let newSectionItems: ISectionItem[] = [];
            for (let i = 0; i < section.sectionItems.length; i++) {
                // if (section.sectionItems[i].id != -1) {
                newSectionItems.push({ id: section.sectionItems[i].id, title: section.sectionItems[i].title, locationId: i, sectionId: section.sectionItems[i].sectionId });
                // }
            }

            let tempSectionsFromState = [...sections];
            let tempSectionsSectionItemsFromState = [...tempSectionsFromState[section.locationId].sectionItems];
            tempSectionsSectionItemsFromState = newSectionItems;
            tempSectionsFromState[section.locationId].sectionItems = tempSectionsSectionItemsFromState;

            setSections(tempSectionsFromState);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onUpdateParentStateCallFromSection'", Error);
        }
    };
    //#endregion Section Items - End

    //#region [Orange] Section - Start
    const onGenerateSectionsButtonClicked = (event?: React.MouseEvent<HTMLButtonElement>) => {
        try {
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
            tempSectionsFromState.splice((sectionLocationId + 1), 0, newSection);
            tempSectionsFromState.forEach((item, index, arr) => {
                item.locationId = index;
            });

            setSections(tempSectionsFromState);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onAddNewSectionFromSection'", Error);
        }
    };

    const onDeleteSectionFromSection = (sectionId, sectionLocationId) => {
        try {
            if (sections[sectionLocationId].title == undefined) {
                onConfirmDeleteSectionFromSection(sectionLocationId);
            }
            else {
                let sectionToBeDeletedTitle: string = sections[sectionLocationId].title;

                setDeleteSectionItemModalWarningText(sectionToBeDeletedTitle);
                setIsDeleteSectionModalOpen(true);
                setIsDeleteSectionItemModalOpen(false);
                setSectionIndexToDelete(sectionLocationId);
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onDeleteSectionFromSection'", Error);
        }
    };

    const onConfirmDeleteSectionFromSection = (sectionIndexToDeleteFromSection?: number) => {
        try {

            if (sectionIndexToDelete == -1) {
                setIsDeleteSectionModalOpen(false);

                let tempSectionsFromState = [...sections];
                tempSectionsFromState.splice(sectionIndexToDeleteFromSection, 1);
                tempSectionsFromState.forEach((item, index, arr) => {
                    item.locationId = index;
                });
                setSections(tempSectionsFromState);
                setSectionIndexToDelete(sectionIndexToDelete);
            }
            else {
                setIsDeleteSectionModalOpen(false);
                let tempSectionsFromState = [...sections];
                if (tempSectionsFromState[sectionIndexToDelete] != undefined) {
                    tempSectionsFromState.splice(sectionIndexToDelete, 1);
                    tempSectionsFromState.forEach((item, index, arr) => {
                        item.locationId = index;
                    });
                    setSections(tempSectionsFromState);
                    setSectionIndexToDelete(-1);
                }
            }
            if (sections.length <= 1) {
                setIsGenerateSectionsButtonDisabled(false);
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onConfirmDeleteSectionFromSection'", Error);
        }
    };

    const onConfirmNotDeleteNewSectionFromSection = () => {
        try {
            setIsDeleteSectionModalOpen(false);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onConfirmNotDeleteNewSectionFromSection'", Error);
        }
    };

    const onSectionTitleChange = (sectionId: number, sectionLocationId: number, sectionTitle: string) => {
        try {
            let tempSectionsFromState = [...sections];
            tempSectionsFromState[sectionLocationId].title = sectionTitle;
            setSections(tempSectionsFromState);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>onSectionTitleChange'", Error);
        }
    };

    const viewState = () => {
        try {
            console.debug("SectionsContainerComponent=>viewState->");
            if (sections.length > 0) {
                console.debug(sections);
            }
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>viewState'", Error);
        }
    };

    const setUToView = () => {
        try {
            setUiMode(0);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>setUToView'", Error);
        }
    };

    const setUToEdit = () => {
        try {
            setUiMode(1);
        } catch (Error) {
            console.error("Error at 'SectionsContainerComponent=>setUToEdit'", Error);
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
                <ActionButton iconProps={viewStateIcon} onClick={viewState.bind(this)} >View 'State' in console</ActionButton>
                <ActionButton iconProps={viewModeIcon} onClick={setUToView.bind(this)} >View Mode</ActionButton>
                <ActionButton iconProps={editModeIcon} onClick={setUToEdit.bind(this)} >Edit Mode</ActionButton>
            </div>
            <div>
                <div>
                    {
                        sections.length > 0
                            ?
                            uiMode == 1
                                ?
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
                                                        uiMode={uiMode}
                                                        key={eachSection.locationId} /></div>);
                                                })

                                            }
                                        </Stack>
                                    </SortableContext>
                                </DndContext>
                                :
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
                                                uiMode={uiMode}
                                                key={eachSection.locationId} /></div>);
                                        })

                                    }
                                </Stack>
                            :
                            undefined
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