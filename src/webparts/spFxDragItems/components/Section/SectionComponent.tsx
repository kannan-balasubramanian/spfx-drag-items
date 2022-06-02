import * as React from 'react';

import { ActionButton, Stack, IStackStyles, IStackTokens, IStackItemStyles, mergeStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';

// import { ISectionComponentProps } from './ISectionComponentProps';
// import { ISectionComponentState } from './ISectionComponentState';

import SectionItemComponent from '../SectionItem/SectionItemComponent';
import ISection from "../../models/ISection";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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

    const [sectionItems, setSectionItems] = React.useState(props.section.sectionItems);
    const [isExpanded, setIsSectionExpandedItems] = React.useState(props.section.isExpanded);
    // const sensors = [useSensor(PointerSensor)];    
    const [isDragged, setIsDragged] = React.useState(false);

    //This distance paramenter ensures that drag event is avoided until unless dragged for more than 7px. This is used to prevent the drag event applying for child elements like button
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: { y: 7 },
            },
        })
    );

    // console.log("SectionComponent=>Entry->");
    // console.log(props.section.sectionItems);

    const onComponentItemDragStart = (event) => {
        // console.log("SectionComponent=>onComponentItemDragStart->");
        // console.log(event.target);
    };

    const onComponentItemDragEnd = ({ active, over }) => {
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
    };

    const onCollapseButtonClick = () => {
        setIsSectionExpandedItems(!isExpanded);
    };
    const onExpandButtonClick = () => {
        setIsSectionExpandedItems(!isExpanded);
    };
    const onAddButtonClick = () => {
        props.onAddSection(props.section.id, props.section.locationId);
    };
    const onDeleteButtonClick = () => {
        // props.onDeleteSection(props.section.id, props.section.locationId);
    };

    const onSectionItemAdd = (sectionItemId, sectionItemLocationId) => {
        // console.log("SectionComponent=>onSectionItemDelete->");
        // console.log(sectionItemId);
        // console.log(sectionItemLocationId);
        // props.onDeleteSectionItem(props.section.id, props.section.locationId, sectionItemId, sectionItemLocationId);
        props.onAddSectionItem(props.section.id, props.section.locationId, sectionItemId, sectionItemLocationId);
    };

    const onSectionItemDelete = (sectionItemId, sectionItemLocationId) => {
        // console.log("SectionComponent=>onSectionItemDelete->");
        // console.log(sectionItemId);
        // console.log(sectionItemLocationId);
        props.onDeleteSectionItem(props.section.id, props.section.locationId, sectionItemId, sectionItemLocationId);
    };

    const updateParentStateCall = () => {
        let updatedSection: ISection = {
            id: props.section.id,
            title: props.section.title,
            locationId: props.section.locationId,
            isExpanded: props.section.isExpanded,
            sectionItems: sectionItems,
        };
        props.onUpdateParentState(updatedSection);
    };

    const updateParentStateOnSectionItemTitleChange = (id: number, locationId: number, newTitle: string, newTitleKey: number) => {
        // console.log("SectionComponent=>updateParentStateOnSectionItemTitleChange->");
        // console.log(id);
        // console.log(locationId);
        // console.log(newTitle);
        // console.log(newTitleKey);
        // console.log(sectionItems);

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
    };


    React.useEffect(() => {
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
    });

    return (
        <div>
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
                    <Stack.Item align="baseline" grow styles={headerStackItemStyles}><Label className={headerLabelStyles} >{props.section.locationId} ({props.section.id}) {props.section.title}</Label></Stack.Item>
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