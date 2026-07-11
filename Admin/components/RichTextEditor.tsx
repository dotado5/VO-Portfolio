"use client";

import React, { useCallback, useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  ImagePlus,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  placeholder?: string;
}

const ToolbarButton: React.FC<{
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}> = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className="rte-btn"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "34px",
      height: "34px",
      borderRadius: "8px",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      background: active ? "var(--accent-muted)" : "transparent",
      color: active ? "var(--accent-primary)" : "var(--text-muted)",
      opacity: disabled ? 0.4 : 1,
      transition: "all 0.15s ease",
    }}
  >
    {children}
  </button>
);

const Toolbar: React.FC<{
  editor: Editor;
  onImageUpload?: (file: File) => Promise<string>;
}> = ({ editor, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previousUrl ?? "https://");

    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      let src: string;
      if (onImageUpload) {
        src = await onImageUpload(file);
      } else {
        src = URL.createObjectURL(file);
      }
      editor.chain().focus().setImage({ src }).run();
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const divider = (
    <span
      style={{
        width: "1px",
        alignSelf: "stretch",
        background: "var(--glass-border)",
        margin: "0 0.25rem",
      }}
    />
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.15rem",
        padding: "0.5rem",
        borderBottom: "1px solid var(--glass-border)",
        position: "sticky",
        top: 0,
        background: "var(--glass-bg, rgba(0,0,0,0.2))",
        backdropFilter: "blur(8px)",
        zIndex: 2,
      }}
    >
      <ToolbarButton
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
      >
        <Strikethrough size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      >
        <UnderlineIcon size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Inline code"
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
      >
        <Code size={17} />
      </ToolbarButton>
      {divider}
      <ToolbarButton
        title="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 size={17} />
      </ToolbarButton>
      {divider}
      <ToolbarButton
        title="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        <Quote size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Code block"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive("codeBlock")}
      >
        <Code2 size={17} />
      </ToolbarButton>
      {divider}
      <ToolbarButton
        title="Link"
        onClick={setLink}
        active={editor.isActive("link")}
      >
        <LinkIcon size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Insert image"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 size={17} className="animate-spin" />
        ) : (
          <ImagePlus size={17} />
        )}
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageFile}
      />
      {divider}
      <ToolbarButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 size={17} />
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 size={17} />
      </ToolbarButton>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onImageUpload,
  placeholder,
}) => {
  const editor = useEditor({
    immediatelyRender: false, // avoid Next.js SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      Image.configure({
        HTMLAttributes: { class: "rte-image" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Write your post…",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-content",
      },
    },
  });

  if (!editor) {
    return (
      <div
        style={{
          minHeight: "320px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div
      className="glass"
      style={{
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}
    >
      <Toolbar editor={editor} onImageUpload={onImageUpload} />
      <div style={{ maxHeight: "45vh", overflowY: "auto" }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
