import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';
import { TagPicker, IBasePicker, ITag, IInputProps, IBasePickerSuggestionsProps } from 'office-ui-fabric-react/lib/Pickers';
import { useBoolean } from '@fluentui/react-hooks';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


function SectionItemComponent(props) {

    // console.log("SectionComponent->");
    // console.log(props.title);
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
        console.log("SectionItemComponent->onItemSelected");
        console.log(item);
        props.onTitleChange(props.id, props.locationId, item.name, item.key);
        return item;
    }, []);

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Stack horizontal disableShrink styles={stackStyles} tokens={stackTokens}>
                <Stack.Item align="auto" grow styles={stackItemStyles}>
                    <Label>{props.locationId} ({props.id}) {props.title}</Label>
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
                        defaultSelectedItems={[{ "key": props.sectionItemTitles.filter(sectionItemTitle => sectionItemTitle.title == props.title)[0].id, name: props.sectionItemTitles.filter(sectionItemTitle => sectionItemTitle.title == props.title)[0].title }]}
                    />
                </Stack.Item>
                <Stack.Item align="end" styles={stackItemStyles}>
                    <IconButton iconProps={deleteIcon} onClick={onItemDeleteButtonClick} />
                </Stack.Item>
            </Stack>
        </div >

    );
}

export default SectionItemComponent;