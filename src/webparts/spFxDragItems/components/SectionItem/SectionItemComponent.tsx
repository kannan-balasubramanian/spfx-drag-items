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

    // console.debug("SectionItemComponent->", props.id, props.title);
    // console.log(props.title);

    // console.log(props.sectionItemTitles);

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
            // console.log("SectionItemComponent=>onAddButtonClick->" + props.id + "|" + props.locationId);
            props.onAddSectionItem(props.id, props.locationId);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>SectionItemComponent'", Error);
        }
    };

    const onItemDeleteButtonClick = () => {
        try {
            // console.log("SectionItemComponent=>onDeleteButtonClick->");
            props.onDeleteSectionItem(props.id, props.locationId);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onItemDeleteButtonClick'", Error);
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
            console.error("Error at 'SectionComponent=>listContainsTagList'", Error);
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
            console.error("Error at 'SectionComponent=>filterSuggestedTags'", Error);
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
            console.error("Error at 'SectionComponent=>onItemSelected'", Error);
        }
    }, []);

    const filterSectionTitle = (type: number) => {
        try {
            // console.log("SectionComponent=>filterSectionTitle->testTags");
            // console.log(props.title);
            // console.log(props.sectionItemTitles);
            if (type === 0) {
                // let id = props.sectionItemTitles.filter(sectionItemTitleTemp => sectionItemTitleTemp.title == sectionItemTitle.title)[0].id;                
                let id = pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].key;
                // console.log(props.title.id + "|" + id);
                return id;
            } else if (type === 1) {
                // let title = props.sectionItemTitles.filter(sectionItemTitleTemp => sectionItemTitleTemp.title == sectionItemTitle.title)[0].title;
                let title = pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.name == props.title.title)[0].name;
                // console.log(props.title.title + "|" + title);
                return title;
            }
        } catch (Error) {
            console.error("Error at 'SectionComponent=>filterSectionTitle'", Error);
        }
    };

    const onItemChanged = (selectedItems: ITag[]): void => {
        try {
            console.log("SectionComponent=>onItemChanged->");
            console.log(selectedItems);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>onItemChanged'", Error);
        }
    };

    React.useEffect(() => {
        try {
            // console.log("SectionItemComponent=>useEffect->");
            // let updatedSectionItemTitle = props.title;
            // let currentSectionItemTitle = [...sectionItemTitle];
            // updatedSectionItemTitle = currentSectionItemTitle;
            setSectionItemTitle(props.title);
        } catch (Error) {
            console.error("Error at 'SectionComponent=>useEffect'", Error);
        }
    });
    // console.log(props.locationId + "=>" + filterSectionTitle(1) + "|" + filterSectionTitle(0));
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Stack horizontal disableShrink styles={stackStyles} tokens={stackTokens}>
                <Stack.Item align="auto" styles={stackItemStyles}>
                    {props.title === undefined ?
                        <Label>{props.locationId} ({props.id})</Label>
                        : <Label>{props.locationId} ({props.id}) {props.title.title} ({props.title.id})</Label>}
                </Stack.Item>
                <Stack.Item align="auto" grow styles={stackItemStyles}>
                    {props.title == undefined ?
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
                        // onChange={onItemChanged}
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
                            onItemSelected={onItemSelected}
                            // onChange={onItemChanged}
                            selectedItems={[{ key: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].key, name: pickerTags.filter(sectionItemTitleTemp => sectionItemTitleTemp.key == props.title.id)[0].name }]}
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