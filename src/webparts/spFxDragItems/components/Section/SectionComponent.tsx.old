import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';

import { ISectionComponentProps } from './ISectionComponentProps';
import { ISectionComponentState } from './ISectionComponentState';

import SectionItemComponent from '../SectionItem/SectionItemComponent';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

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

const itemsStackStyles: IStackStyles = {
    root: {
        background: DefaultPalette.neutralLight
    },
};

const itemsStackTokens: IStackTokens = {
    childrenGap: 5,
    padding: 10,
};



export default class SectionComponent extends React.Component<ISectionComponentProps, ISectionComponentState> {

    constructor(props: ISectionComponentProps, state: ISectionComponentState) {
        super(props);
        if (props != null) {
            this.state = {
                id: props.id,
                title: props.title,
                locationId: props.locationId,
                isExpanded: props.isExpanded,
                sectionItems: props.sectionItems
            };
        }
        else {
            this.state = {
                id: undefined,
                title: undefined,
                locationId: undefined,
                isExpanded: undefined,
                sectionItems: []
            };
        }
    }

    public componentWillReceiveProps(props: ISectionComponentProps) {
        if (props != null) {
            this.state = {
                id: props.id,
                title: props.title,
                locationId: props.locationId,
                isExpanded: props.isExpanded,
                sectionItems: props.sectionItems
            };
        }
    }

    public render(): React.ReactElement<{}> {
        return (
            <div>
                <div>
                    <Stack horizontal styles={headerStackStyles} tokens={headerStackTokens}>
                        <IconButton iconProps={rightIcon} />
                        <IconButton iconProps={downIcon} />
                        <Label>{this.state.locationId} ({this.state.id}) {this.state.title}</Label>
                    </Stack>
                </div>
                <div>
                    <DndContext onDragEnd={this.onDndContextDragEnd.bind(this)}>
                        <SortableContext items={this.state.sectionItems.map(sectionItem => sectionItem.locationId.toString())} strategy={verticalListSortingStrategy} >
                            <Stack styles={headerStackStyles} tokens={headerStackTokens}>
                                {this.state.sectionItems.map((sectionItem) => {
                                    return (<SectionItemComponent id={sectionItem.id} title={sectionItem.title} locationId={sectionItem.locationId} sectionId={sectionItem.sectionId} />);
                                })}
                            </Stack>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        );
    }

    private onDndContextDragEnd() {
        console.log("SectionComponent->onDndContextDragEnd");
    }
}