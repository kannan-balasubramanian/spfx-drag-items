import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SectionComponent(props) {

    // console.log("SectionComponent->");
    // console.log(id);
    // console.log(locationId);
    // console.log(sectionId);

    const deleteIcon: IIconProps = { iconName: 'Delete' };
    // const downIcon: IIconProps = { iconName: 'ChevronDownMed' };

    const stackStyles: IStackStyles = {
        root: {
            background: DefaultPalette.themeLighterAlt,
        },
    };

    const stackTokens: IStackTokens = {
        childrenGap: 10,
        padding: 10,
    };

    const stackItemStyles: IStackItemStyles = {
        root: {
            //   background: DefaultPalette.themePrimary,
            // color: DefaultPalette.white,
            // padding: 5,
        },
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: props.locationId.toString() });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const onDeleteButtonClick = () => {
        // setIsSectionExpandedItems(!isExpanded);
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Stack horizontal disableShrink styles={stackStyles} tokens={stackTokens}>
                <Stack.Item align="auto" grow styles={stackItemStyles}>
                    <Label>{props.locationId} ({props.id}) {props.title}</Label>
                </Stack.Item>
                <Stack.Item align="end" styles={stackItemStyles}>
                    <IconButton iconProps={deleteIcon} onClick={onDeleteButtonClick} />
                </Stack.Item>
            </Stack>
        </div >

    );
}

export default SectionComponent;