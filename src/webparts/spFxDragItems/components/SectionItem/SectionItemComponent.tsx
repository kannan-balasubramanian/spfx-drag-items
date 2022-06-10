import * as React from 'react';

import { Stack, IStackStyles, IStackTokens, IStackItemStyles, mergeStyles } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultPalette } from 'office-ui-fabric-react';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { IIconProps } from 'office-ui-fabric-react/';
import { TagPicker, IBasePicker, ITag, IInputProps, IBasePickerSuggestionsProps, BasePicker } from 'office-ui-fabric-react/lib/Pickers';
import { useBoolean } from '@fluentui/react-hooks';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import ISectionItemTitle from "../../models/ISectionItemTitle";

function SectionItemComponent(props) {

    const [sectionItemTitle, setSectionItemTitle] = React.useState(props.title);

    const deleteIcon: IIconProps = { iconName: 'Delete' };
    const dragIcon: IIconProps = { iconName: 'DragObject' };
    const addIcon: IIconProps = { iconName: 'Add' };

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

    const onAddButtonClick = () => {
        try {
            props.onAddSectionItem(props.id, props.locationId);
        } catch (Error) {
            console.error("Error at 'SectionItemComponent=>SectionItemComponent'", Error);
        }
    };

    const onItemDeleteButtonClick = () => {
        try {
            props.onDeleteSectionItem(props.id, props.locationId);
        } catch (Error) {
            console.error("Error at 'SectionItemComponent=>onItemDeleteButtonClick'", Error);
        }
    };

    const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
        suggestionsHeaderText: 'Suggested tags',
        noResultsFoundText: 'No color tags found',
    };
    const pickerTags: ITag[] = props.sectionItemTitles.map(item => ({ key: item.id, name: item.title }));
    const inputProps: IInputProps = {
        // onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
        // onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
    };
    const [tagPicker, { toggle: toggleIsTagPickerVisible }] = useBoolean(false);
    const listContainsTagList = (tag: ITag, tagList?: ITag[]) => {
        try {
            if (!tagList || !tagList.length || tagList.length === 0) {
                return false;
            }
            return tagList.some(compareTag => compareTag.key === tag.key);
        } catch (Error) {
            console.error("Error at 'SectionItemComponent=>listContainsTagList'", Error);
        }
    };
    const filterSuggestedTags = (filterText: string, tagList: ITag[]): ITag[] => {
        try {
            return filterText
                ? pickerTags.filter(
                    tag => tag.name.toLowerCase().indexOf(filterText.toLowerCase()) === 0 && !listContainsTagList(tag, tagList),
                )
                : [];
        } catch (Error) {
            console.error("Error at 'SectionItemComponent=>filterSuggestedTags'", Error);
        }
    };

    const getTextFromItem = (item: ITag) => item.name;
    const picker = React.useRef<IBasePicker<ITag>>(null);
    const onItemSelected = React.useCallback((item: ITag): ITag | null => {
        try {
            if (picker.current && listContainsTagList(item, picker.current.items)) {
                return null;
            }
            props.onTitleChange(props.id, props.locationId, item.name, item.key);
            return item;
        } catch (Error) {
            console.error("Error at 'SectionItemComponent=>onItemSelected'", Error);
        }
    }, []);

    const filterSectionTitle = (type: number) => {
        try {

            if (type === 0) {
                let id = pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].key;
                return id;
            } else if (type === 1) {
                let title = pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.name == props.title.title)[0].name;
                return title;
            }
        } catch (Error) {
            console.error("Error at 'SectionItemComponent=>filterSectionTitle'", Error);
        }
    };

    const onItemChanged = (selectedItems: ITag[]): void => {
        try {
            if (selectedItems.length > 0) {
                props.onTitleChange(props.id, props.locationId, selectedItems[0].name, selectedItems[0].key);
            }
            else {
                props.onTitleChange(props.id, props.locationId, undefined, undefined);
            }
        } catch (Error) {
            console.error("Error at 'SectionItemComponent=>onItemChanged'", Error);
        }
    };

    React.useEffect(() => {
        try {
            // let updatedSectionItemTitle = props.title;
            // let currentSectionItemTitle = [...sectionItemTitle];
            // updatedSectionItemTitle = currentSectionItemTitle;
            setSectionItemTitle(props.title);
        } catch (Error) {
            console.error("Error at 'SectionItemComponent=>useEffect'", Error);
        }
    });

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Stack horizontal disableShrink styles={stackStyles} tokens={stackTokens}>
                <Stack.Item align="auto" styles={stackItemStyles}>
                    {props.title === undefined ?
                        <Label>{props.locationId} ({props.id})</Label>
                        : <Label>{props.locationId} ({props.id}) {props.title.title} ({props.title.id})</Label>}
                </Stack.Item>
                <Stack.Item align="auto" grow styles={stackItemStyles}>
                    {sectionItemTitle == undefined || sectionItemTitle.id == undefined ?
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
                            // onItemSelected={onItemSelected}
                            onChange={onItemChanged}
                        // selectedItems={[{ key: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].key, name: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].name }]}
                        // defaultSelectedItems={[{ key: filterSectionTitle(0), name: filterSectionTitle(1).toString() }]}
                        // defaultSelectedItems={[{ key: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].key, name: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].name }]}
                        />
                        :
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
                            // onItemSelected={onItemSelected}
                            onChange={onItemChanged}
                            selectedItems={[{ key: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == sectionItemTitle.id)[0].key, name: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == sectionItemTitle.id)[0].name }]}
                        // defaultSelectedItems={[{ key: filterSectionTitle(0), name: filterSectionTitle(1).toString() }]}
                        // defaultSelectedItems={[{ key: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].key, name: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].name }]}
                        />
                    }

                </Stack.Item>
                <Stack.Item align="end" styles={stackItemStyles}>
                    {/* <IconButton iconProps={dragIcon} /> */}
                    <IconButton iconProps={addIcon} onClick={onAddButtonClick} />
                    <IconButton iconProps={deleteIcon} onClick={onItemDeleteButtonClick} />
                </Stack.Item>
            </Stack>
        </div >

    );
}

export default SectionItemComponent;
//https://stackoverflow.com/questions/65649408/how-to-indicate-loaging-searching-on-office-fabricui-tagpicker-for-large-data-se