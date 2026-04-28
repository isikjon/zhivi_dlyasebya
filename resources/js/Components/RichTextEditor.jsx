import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Link as LinkIcon, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700 bg-gray-900/50 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${editor.isActive('bold') ? 'text-quantum-amber bg-gray-700' : 'text-gray-400'}`}
        title="Жирный"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${editor.isActive('italic') ? 'text-quantum-amber bg-gray-700' : 'text-gray-400'}`}
        title="Курсив"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${editor.isActive('underline') ? 'text-quantum-amber bg-gray-700' : 'text-gray-400'}`}
        title="Подчеркнутый"
      >
        <UnderlineIcon size={18} />
      </button>
      <div className="w-px h-6 bg-gray-700 mx-1 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${editor.isActive('bulletList') ? 'text-quantum-amber bg-gray-700' : 'text-gray-400'}`}
        title="Список"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${editor.isActive('orderedList') ? 'text-quantum-amber bg-gray-700' : 'text-gray-400'}`}
        title="Нумерованный список"
      >
        <ListOrdered size={18} />
      </button>
      <div className="w-px h-6 bg-gray-700 mx-1 self-center" />
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Введите URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-2 rounded hover:bg-gray-700 transition-colors ${editor.isActive('link') ? 'text-quantum-amber bg-gray-700' : 'text-gray-400'}`}
        title="Ссылка"
      >
        <LinkIcon size={18} />
      </button>
      <div className="flex-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-700 text-gray-400"
        title="Назад"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-700 text-gray-400"
        title="Вперед"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

const extensions = [
  StarterKit.configure({
    history: true,
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'rich-text-link',
    },
  }),
];

export const RichTextEditor = ({ value, onChange, placeholder = "Введите текст..." }) => {
  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-gray-200 text-sm leading-relaxed rich-text-content',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded-xl focus-within:ring-1 focus-within:ring-quantum-amber/50 transition-all overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
