import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles, mergeStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';
import { TagPicker, IBasePicker, ITag, IInputProps, IBasePickerSuggestionsProps } from 'office-ui-fabric-react/lib/Pickers';
import { useBoolean } from '@fluentui/react-hooks';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ISectionItemTitle from "../../models/ISectionItemTitle";

function SectionItemComponent(props) {

    // console.log("SectionComponent->");
    // console.log(props.locationId + "=>" + props.title.title + "|" + props.title.title);

    // console.log(props.sectionItemTitles);
    // console.log(sectionId);
    const [sectionItemTitle, setSectionItemTitle] = React.useState(props.title);

    const deleteIcon: IIconProps = { iconName: 'Delete' };
    const dragIcon: IIconProps = { iconName: 'DragObject' };

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

    const tagPickerDivStyles = mergeStyles({
        width: 20
    });

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

    const onItemDeleteButtonClick = () => {
        // console.log("SectionItemComponent=>onDeleteButtonClick->");
        props.onDeleteSectionItem(props.id, props.locationId);
    };

    const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
        suggestionsHeaderText: 'Suggested tags',
        noResultsFoundText: 'No color tags found',
    };

    const testTags: ITag[] = props.sectionItemTitles.map(item => ({ key: item.id, name: item.title }));
    const inputProps: IInputProps = {
        onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
        onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
    };
    const [tagPicker, { toggle: toggleIsTagPickerVisible }] = useBoolean(false);

    const listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
        if (!tagList || !tagList.length || tagList.length === 0) {
            return false;
        }
        return tagList.some(compareTag => compareTag.key === tag.key);
    };

    const filterSuggestedTags = (filterText: string, tagList: ITag[]): ITag[] => {
        return filterText
            ? testTags.filter(
                tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList),
            )
            : [];
    };

    const getTextFromItem = (item: ITag) => item.name;
    const picker = React.useRef<IBasePicker<ITag>>(null);
    const onItemSelected = React.useCallback((item: ITag): ITag | null => {
        if (picker.current && listContainsTagList(item, picker.current.items)) {
            return null;
        }
        // console.log("SectionItemComponent->onItemSelected");
        // console.log(item);
        props.onTitleChange(props.id, props.locationId, item.name, item.key);
        return item;
    }, []);

    const filterSectionTitle = (type: number) => {
        try {
            // console.log("SectionComponent=>filterSectionTitle->");
            // console.log(props.title);
            // console.log(props.sectionItemTitles);
            if (type === 0) {
                let id = props.sectionItemTitles.filter(sectionItemTitleTemp => sectionItemTitleTemp.title == sectionItemTitle.title)[0].id;
                if (sectionItemTitle.id !== id) {
                    // console.log(id);
                }
                return id;
            } else if (type === 1) {
                let title = props.sectionItemTitles.filter(sectionItemTitleTemp => sectionItemTitleTemp.title == sectionItemTitle.title)[0].title;
                if (sectionItemTitle.title !== title) {
                    // console.log(title);
                }
                return title;
            }
        } catch (Error) {
            console.log("Error at SectionComponent=>filterSectionTitle-> " + Error);
        }
    };

    React.useEffect(() => {
        try {
            // let updatedSectionItemTitle = props.title;
            // let currentSectionItemTitle = [...sectionItemTitle];
            // updatedSectionItemTitle = currentSectionItemTitle;
            setSectionItemTitle(props.title);
        } catch (Error) {
            console.log("Error at SectionComponent=>useEffect-> " + Error);
        }
    });
    // console.log(props.locationId + "=>" + filterSectionTitle(1) + "|" + filterSectionTitle(0));
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Stack horizontal disableShrink styles={stackStyles} tokens={stackTokens}>
                {/* <Stack.Item align="auto" styles={stackItemStyles}>
                    <Label>{props.locationId} ({props.id}) {sectionItemTitle.title}({sectionItemTitle.id})</Label>
                </Stack.Item> */}
                <Stack.Item align="auto" grow styles={stackItemStyles}>
                    <TagPicker
                        removeButtonAriaLabel="Remove"
                        onResolveSuggestions={filterSuggestedTags}
                        getTextFromItem={getTextFromItem}
                        pickerSuggestionsProps={pickerSuggestionsProps}
                        itemLimit={1}
                        disabled={tagPicker}
                        inputProps={{
                            ...inputProps,
                            id: 'picker1',
                        }}
                        onItemSelected={onItemSelected}
                        selectedItems={[{ "key": filterSectionTitle(0), name: filterSectionTitle(1) }]}
                    // defaultSelectedItems={[{ "key": filterSectionTitle(0), name: filterSectionTitle(1) }]}
                    />
                </Stack.Item>
                <Stack.Item align="end" styles={stackItemStyles}>
                    {/* <IconButton iconProps={dragIcon} /> */}
                    <IconButton iconProps={deleteIcon} onClick={onItemDeleteButtonClick} />
                </Stack.Item>
            </Stack>
        </div >

    );
}

export default SectionItemComponent;