import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles, mergeStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';

// import { ISectionComponentProps } from './ISectionComponentProps';
// import { ISectionComponentState } from './ISectionComponentState';

import SectionItemComponent from '../SectionItem/SectionItemComponent';
import { closestCenter, DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const rightIcon: IIconProps = { iconName: 'ChevronRightMed' };
const downIcon: IIconProps = { iconName: 'ChevronDownMed' };
const headerStackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.themeDarker
    },
};

const headerLabelStyles = mergeStyles({
    color: DefaultPalette.themeLighterAlt,
});
const headerStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
};

const itemStackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.themeTertiary,
    },
};

const itemStackTokens: IStackTokens = {
    childrenGap: 10,
    padding: 10,
};


function SectionComponent(props) {

    const [sectionItems, setSectionItems] = React.useState(props.sectionItems);
    const [isExpanded, setIsSectionExpandedItems] = React.useState(props.isExpanded);
    const sensors = [useSensor(PointerSensor)];

    const onComponentItemDragEnd = ({ active, over }) => {
        console.log(sectionItems);
        if (active.id != over.id) {
            setSectionItems((sectionItems) => {
                const oldIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === active.id);
                const newIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === over.id);
                return arrayMove(sectionItems, oldIndex, newIndex);
            });
        }
    };

    const onCollapseButtonClick = () => {
        setIsSectionExpandedItems(!isExpanded);
    };
    const onExpandButtonClick = () => {
        setIsSectionExpandedItems(!isExpanded);
    };

    return (
        <div>
            <div>
                <Stack horizontal styles={headerStackStyles} tokens={headerStackTokens}>
                    {
                        isExpanded === false ?
                            <IconButton iconProps={rightIcon} onClick={onCollapseButtonClick} />
                            : undefined
                    }
                    {
                        isExpanded === true ?
                            <IconButton iconProps={downIcon} onClick={onExpandButtonClick} />
                            : undefined
                    }
                    <Label className={headerLabelStyles} >{props.locationId} ({props.id}) {props.title}</Label>

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