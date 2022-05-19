import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles, mergeStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';

// import { ISectionComponentProps } from './ISectionComponentProps';
// import { ISectionComponentState } from './ISectionComponentState';

import SectionItemComponent from '../SectionItem/SectionItemComponent';
import ISection from "../../models/ISection";
import { closestCenter, DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import ISectionItem from '../../models/ISectionItem';

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
    const sensors = [useSensor(PointerSensor)];
    const [isDragged, setIsDragged] = React.useState(false);

    // console.log("SectionComponent=>Entry->");
    // console.log(props.section.sectionItems);

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
        // setIsSectionExpandedItems(!isExpanded);
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
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onComponentItemDragEnd} >
                        <SortableContext items={sectionItems.map(sectionItem => sectionItem.locationId.toString())} strategy={verticalListSortingStrategy} >
                            <Stack styles={itemStackStyles} tokens={itemStackTokens}>
                                {sectionItems.map((sectionItem) =>
                                    <div key={sectionItem.locationId}><SectionItemComponent key={sectionItem.locationId} {...sectionItem} /></div>
                                )}
                            </Stack>
                        </SortableContext>
                    </DndContext>

                </div>
                : undefined
            }
        </div>
    );
}

export default SectionComponent;

//https://www.youtube.com/watch?v=eDc2xowd0RI