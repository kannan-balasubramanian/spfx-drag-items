import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
// import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';

import { ISectionItemComponentProps } from './ISectionItemComponentProps';
import { ISectionItemComponentState } from './ISectionItemComponentState';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import { identity } from 'lodash';

const rightIcon: IIconProps = { iconName: 'ChevronRightMed' };
const downIcon: IIconProps = { iconName: 'ChevronDownMed' };
const stackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.neutralLight,
    },
};

const itemAlignmentsStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
};



export default class SectionItemComponent extends React.Component<ISectionItemComponentProps, ISectionItemComponentState> {

    constructor(props: ISectionItemComponentProps, state: ISectionItemComponentState) {
        super(props);
        if (props != null) {
            this.state = {
                id: props.id,
                title: props.title,
                locationId: props.locationId,
                sectionId: props.sectionId
            };
        }
        else {
            this.state = {
                id: undefined,
                title: undefined,
                locationId: undefined,
                sectionId: undefined
            };
        }
    }


    public componentWillReceiveProps(props: ISectionItemComponentProps) {
        if (props != null) {
            this.state = {
                id: props.id,
                title: props.title,
                locationId: props.locationId,
                sectionId: props.sectionId
            };
        }

    }

    public render(): React.ReactElement<{}> {

        try {

            const sortable = useSortable({ id: this.state.locationId.toString() });

            // const style = {
            //     transform: CSS.Transform.toString(transform),
            //     transition,
            // };

            return (
                <div  >
                    <Stack horizontal styles={stackStyles} tokens={itemAlignmentsStackTokens}>
                        <Label>{this.state.locationId} </Label>
                        {/* <IconButton iconProps={rightIcon} />
                    <IconButton iconProps={downIcon} /> */}
                        <Label>({this.state.sectionId}/{this.state.id}) {this.state.title}</Label>
                    </Stack>
                </div >
            );
        }
        catch (error) {
            console.log("Error:" + error);
        }
    }
}