import React, { useState, useEffect } from 'react';

// wysiwyg relation modules
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import dynamic from "next/dynamic";
import TurndownService from 'turndown';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useRef } from 'react';

const Editor = dynamic(
    () => {
        return import("react-draft-wysiwyg").then(mod => mod.Editor);
    },
    { ssr: false }
);

export default function TextEditor(props: {
    html?: string,
    onBlur?: (markdown: string) => void,
    onChange?: (markdown: string) => void,
}) {
    const [editorState, setEditorState] = useState(EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(props.html ?? ''))
    ));
    const editorRef = useRef();

    useEffect(() => {
        let mounted = true;
        if (mounted)
            setEditorState(() => EditorState.moveFocusToEnd(editorState));
        return () => { mounted = false }
    }, [])

    const onEditorStateChange = (e) => {
        setEditorState(() => e);
        // get the html from the editorState
        const html = draftToHtml(convertToRaw(e.getCurrentContent()));
        // convert the html to markdown
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(html);

        // return markDown on onBlur props
        props?.onChange && props.onChange(markdown)
    };

    const onBlur = async (event, editorState) => {
        // get the html from the editorState
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        // convert the html to markdown
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(html);

        // return markDown on onBlur props
        props?.onBlur && props.onBlur(markdown)
    }

    return (
        <Editor
            // @ts-ignore
            ref={editorRef}
            editorState={editorState}
            wrapperClassName="rich-editor demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={onEditorStateChange}
            onBlur={onBlur}
            toolbar={{
                options: ['inline', 'link'], // 'list',
                inline: {
                    inDropdown: false,
                    options: ['bold', 'italic'],
                    bold: { icon: 'https://img.icons8.com/metro/2x/bold.png' },
                    italic: { icon: 'https://img.icons8.com/metro/2x/italic.png' }
                },
                list: {
                    inDropdown: false,
                    options: ['unordered', 'ordered'],
                    unordered: { icon: 'https://image.flaticon.com/icons/png/128/151/151867.png' },
                    ordered: { icon: 'https://image.flaticon.com/icons/png/128/25/25242.png' }
                },
                link: {
                    inDropdown: false,
                    className: undefined,
                    component: undefined,
                    popupClassName: undefined,
                    dropdownClassName: undefined,
                    showOpenOptionOnHover: true,
                    defaultTargetOption: '_self',
                    options: ['link', 'unlink'],
                    link: { icon: 'https://img.icons8.com/metro/2x/link.png', className: undefined },
                    unlink: { icon: 'https://img.icons8.com/metro/2x/delete-link.png', className: undefined },
                    linkCallback: undefined
                },
            }}
        />
    )
}
