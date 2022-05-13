import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IIconProps } from 'office-ui-fabric-react/';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SectionComponent(props) {

    // console.log("SectionComponent->");
    // console.log(id);
    // console.log(locationId);
    // console.log(sectionId);

    // const rightIcon: IIconProps = { iconName: 'ChevronRightMed' };
    // const downIcon: IIconProps = { iconName: 'ChevronDownMed' };

    const stackStyles: IStackStyles = {
        root: {
            background: DefaultPalette.neutralLight,
        },
    };

    const itemAlignmentsStackTokens: IStackTokens = {
        childrenGap: 5,
        padding: 10,
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

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Stack horizontal styles={stackStyles} tokens={itemAlignmentsStackTokens}>
                <Label>{props.locationId} </Label>
                {/* <IconButton iconProps={rightIcon} />
                            <IconButton iconProps={downIcon} /> */}
                <Label>({props.sectionId}/{props.id}) {props.title}</Label>
            </Stack>
        </div >

    );
}

export default SectionComponent;