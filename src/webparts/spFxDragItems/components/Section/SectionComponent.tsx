import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
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
        background: DefaultPalette.neutralTertiaryAlt
    },
};

const headerStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
};

// const itemsStackStyles: IStackStyles = {
//     root: {
//         background: DefaultPalette.neutralLight
//     },
// };

// const itemsStackTokens: IStackTokens = {
//     childrenGap: 5,
//     padding: 10,
// };



function SectionComponent(props) {

    const [sectionItems, setItems] = React.useState(props.sectionItems);
    const sensors = [useSensor(PointerSensor)];

    const handleDragEnd = ({ active, over }) => {
        // console.clear();
        // console.log("SectionComponent->handleDragEnd");
        console.log(sectionItems);
        if (active.id != over.id) {
            // console.log("Not Same");
            setItems((sectionItems) => {
                const oldIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === active.id);
                const newIndex = sectionItems.findIndex(sectionItem => sectionItem.locationId.toString() === over.id);
                // console.log(oldIndex);
                // console.log(newIndex);

                return arrayMove(sectionItems, oldIndex, newIndex);
            });
        }
        else {
            // console.log("Same");
            // console.log(active.id);
            // console.log(over.id);
        }
        // console.log(sectionItems);
    };
    // console.log("SectionComponent=>SectionComponent->Before return");
    // console.log(sectionItems);
    return (
        <div>
            <div>
                <Stack horizontal styles={headerStackStyles} tokens={headerStackTokens}>
                    <IconButton iconProps={rightIcon} />
                    <IconButton iconProps={downIcon} />
                    <Label>{props.locationId} ({props.id}) {props.title}</Label>
                </Stack>
            </div>
            <div>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                    <SortableContext items={sectionItems.map(sectionItem => sectionItem.locationId.toString())} strategy={verticalListSortingStrategy} >
                        {/* <Stack styles={headerStackStyles} tokens={headerStackTokens}> */}
                        {sectionItems.map((sectionItem) =>
                            <div key={sectionItem.locationId}><SectionItemComponent key={sectionItem.locationId} {...sectionItem} /></div>
                        )}
                        {/* </Stack> */}
                    </SortableContext>
                </DndContext>

            </div>
        </div>
    );
}

export default SectionComponent;

//https://www.youtube.com/watch?v=eDc2xowd0RI