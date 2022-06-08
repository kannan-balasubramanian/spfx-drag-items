import * as React from 'react';

import { ActionButton, Stack, IStackStyles, IStackTokens, IStackItemStyles, mergeStyles, TextField, Label, IconButton, IIconProps, DefaultPalette } from 'office-ui-fabric-react';

// import { ISectionComponentProps } from './ISectionComponentProps';
// import { ISectionComponentState } from './ISectionComponentState';

import SectionItemComponent from '../SectionItem/SectionItemComponent';
import ISection from "../../models/ISection";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ISectionItem from '../../models/ISectionItem';
import ISectionItemTitle from "../../models/ISectionItemTitle";

const rightIcon: IIconProps = { iconName: 'ChevronRightMed' };
const downIcon: IIconProps = { iconName: 'ChevronDownMed' };
const addIcon: IIconProps = { iconName: 'Add' };
const deleteIcon: IIconProps = { iconName: 'Delete' };
const headerStackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.themeDarker,
        verticalAlign: 'center'
    },
};

const headerLabelStyles = mergeStyles({
    color: DefaultPalette.themeLighterAlt,
    verticalAlign: 'center'
});
const headerStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,

};
const headerStackItemStyles: IStackItemStyles = {
    root: {
        //   background: DefaultPalette.themePrimary,
        // color: DefaultPalette.white,
        // padding: 5,
    },
};

const itemStackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.themeTertiary,
    },
};
const itemStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 5,
};



function SectionComponent(props) {
    // console.log("SectionComponent=>props", props);
    const [sectionItems, setSectionItems] = React.useState(props.section.sectionItems);
    const [isExpanded, setIsSectionExpandedItems] = React.useState(props.section.isExpanded);
    // const sensors = [useSensor(PointerSensor)];    
    const [isDragged, setIsDragged] = React.useState(false);

    //This distance parameter ensures that drag event is avoided until unless dragged for more than 7px. This is used to prevent the drag event applying for child elements like button
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: { y: 7 },
            },
        })
    );

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.section.locationId.toString() });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    // console.log("SectionComponent=>Entry->");
    // console.log(props.section.sectionItems);

    const onComponentItemDragStart = (event) => {
        try {
            // console.log("SectionComponent=>onComponentItemDragStart->");
            // console.log(event.target);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onComponentItemDragStart'", Error);
        }
    };

    const onComponentItemDragEnd = ({ active, over }) => {
        try {
            if (active.id != over.id) {
                setIsDragged(true);
                const oldIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === active.id);
                const newIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === over.id);
                let reIndexedSectionItems = arrayMove(sectionItems, oldIndex, newIndex);
                setSectionItems(reIndexedSectionItems);
                // setSectionItems((sectionItems) => {
                //     const oldIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === active.id);
                //     const newIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === over.id);
                //     return arrayMove(sectionItems, oldIndex, newIndex);
                // });
            }
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onComponentItemDragEnd'", Error);
        }
    };

    const onCollapseButtonClick = () => {
        try {
            setIsSectionExpandedItems(!isExpanded);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onCollapseButtonClick'", Error);
        }
    };
    const onExpandButtonClick = () => {
        try {
            setIsSectionExpandedItems(!isExpanded);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onExpandButtonClick'", Error);
        }
    };
    const onAddButtonClick = () => {
        try {
            props.onAddSection(props.section.id, props.section.locationId);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onAddButtonClick'", Error);
        }
    };
    const onDeleteButtonClick = () => {
        try {
            props.onDeleteSection(props.section.id, props.section.locationId);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onDeleteButtonClick'", Error);
        }
    };

    const onSectionItemAdd = (sectionItemId, sectionItemLocationId) => {
        try {
            // console.log("SectionComponent=>onSectionItemDelete->");
            // console.log(sectionItemId);
            // console.log(sectionItemLocationId);
            // props.onDeleteSectionItem(props.section.id, props.section.locationId, sectionItemId, sectionItemLocationId);
            props.onAddSectionItem(props.section.id, props.section.locationId, sectionItemId, sectionItemLocationId);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onSectionItemAdd'", Error);
        }
    };

    const onSectionItemDelete = (sectionItemId, sectionItemLocationId) => {
        try {
            // console.log("SectionComponent=>onSectionItemDelete->");
            // console.log(sectionItemId);
            // console.log(sectionItemLocationId);
            props.onDeleteSectionItem(props.section.id, props.section.locationId, sectionItemId, sectionItemLocationId);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onSectionItemDelete'", Error);
        }
    };

    const updateParentStateCall = () => {
        try {
            let updatedSection: ISection = {
                id: props.section.id,
                title: props.section.title,
                locationId: props.section.locationId,
                isExpanded: props.section.isExpanded,
                sectionItems: sectionItems,
            };
            props.onUpdateParentState(updatedSection);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>updateParentStateCall'", Error);
        }
    };

    const updateParentStateOnSectionItemTitleChange = (id: number, locationId: number, newTitle: string, newTitleKey: number) => {
        try {
            // let updatedSectionItem: ISectionItem = sectionItems[props.section.locationId];
            // // console.log(updatedSectionItem.title);
            // updatedSectionItem.title = newTitleText;

            let updatedSectionItems: ISectionItem[] = props.section.sectionItems;
            let updateSectionItemsTitle: ISectionItemTitle = { id: newTitleKey, title: newTitle };
            updatedSectionItems[locationId].title = updateSectionItemsTitle;
            // console.log(updatedSectionItem);
            // props.onUpdateParentState(updatedSectionItem);

            let updatedSection: ISection = {
                id: props.section.id,
                title: props.section.title,
                locationId: props.section.locationId,
                isExpanded: props.section.isExpanded,
                sectionItems: updatedSectionItems,
            };
            // console.log(updatedSection);
            props.onUpdateParentState(updatedSection);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>updateParentStateOnSectionItemTitleChange'", Error);
        }
    };

    const onTextChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        try {
            props.onSectionTitleChange(props.section.id, props.section.locationId, newValue);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onTextChange'", Error);
        }
    };


    React.useEffect(() => {
        try {
            // isDragged is used to prevent infinite loop since useEffect is called for every render even when the state is updated.
            // Also isDragged variable is used as a state rather than variable since the value is not maintained during each render
            if (isDragged == true) {
                setIsDragged(false);
                updateParentStateCall();
            }
            let updatedSectionItems: ISectionItem[] = props.section.sectionItems;
            let currentSectionItems: ISectionItem[] = [...sectionItems];
            currentSectionItems = updatedSectionItems;
            setSectionItems(currentSectionItems);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>useEffect'", Error);
        }
    });

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div>
                <Stack horizontal disableShrink styles={headerStackStyles} tokens={headerStackTokens}>
                    {
                        isExpanded === false ?
                            <Stack.Item align="auto" styles={headerStackItemStyles}><IconButton iconProps={rightIcon} onClick={onCollapseButtonClick} /></Stack.Item>
                            : undefined
                    }
                    {
                        isExpanded === true ?
                            <Stack.Item align="auto" styles={headerStackItemStyles}><IconButton iconProps={downIcon} onClick={onExpandButtonClick} /></Stack.Item>
                            : undefined
                    }
                    <Stack.Item align="auto" styles={headerStackItemStyles}>
                        <Label className={headerLabelStyles} >{props.section.locationId} ({props.section.id}) {props.section.title}</Label>
                    </Stack.Item>
                    <Stack.Item align="auto" grow styles={headerStackItemStyles}>
                        <TextField required value={props.section.title == undefined ? "" : props.section.title} onChange={onTextChange} />
                    </Stack.Item>
                    <Stack.Item align="end" styles={headerStackItemStyles}>
                        <IconButton iconProps={addIcon} onClick={onAddButtonClick} />
                        <IconButton iconProps={deleteIcon} onClick={onDeleteButtonClick} />
                    </Stack.Item>
                </Stack>
            </div>
            {isExpanded === true ?
                <div>
                    {sectionItems.length > 0 ?
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onComponentItemDragStart} onDragEnd={onComponentItemDragEnd} >
                            <SortableContext items={sectionItems.map(sectionItem => sectionItem.locationId.toString())} strategy={verticalListSortingStrategy} >
                                <Stack styles={itemStackStyles} tokens={itemStackTokens}>
                                    {sectionItems.map((sectionItem) =>
                                        <div key={sectionItem.locationId}><SectionItemComponent onAddSectionItem={onSectionItemAdd} onDeleteSectionItem={onSectionItemDelete} key={sectionItem.locationId} sectionItemTitles={props.sectionItemTitles} onTitleChange={updateParentStateOnSectionItemTitleChange} {...sectionItem} /></div>
                                    )}
                                </Stack>
                            </SortableContext>
                        </DndContext>
                        :
                        <ActionButton iconProps={addIcon} onClick={onSectionItemAdd.bind(props.section.id, 0)} >Add section item</ActionButton>
                    }
                </div>
                : undefined
            }
        </div>
    );
}

export default SectionComponent;

//https://www.youtube.com/watch?v=eDc2xowd0RI