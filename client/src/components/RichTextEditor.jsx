import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { HiOutlineBold, HiOutlineItalic, HiOutlineStrikethrough, HiOutlineCodeBracket, HiOutlineListBullet, HiOutlineNumberedList, HiOutlineLink, HiOutlineChatBubbleLeftRight, HiOutlineMinus } from 'react-icons/hi2';

const icon = (Icon, action, active) => (
  <button type="button" onClick={action} className={`p-1.5 rounded-lg transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
    <Icon className="w-4 h-4" />
  </button>
);

export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) return <div className="h-40 bg-gray-50 rounded-xl animate-pulse" />;

  const setLink = () => {
    const url = window.prompt('URL', editor.getAttributes('link').href || 'https://');
    if (url === null) return;
    if (url && /^https?:\/\//i.test(url)) {
      editor.chain().focus().setLink({ href: url }).run();
    } else if (url) {
      window.alert('Only http:// and https:// URLs are allowed');
    } else {
      editor.chain().focus().unsetLink().run();
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50/50 flex-wrap">
        {icon(HiOutlineBold, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {icon(HiOutlineItalic, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {icon(HiOutlineStrikethrough, () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'))}
        {icon(HiOutlineCodeBracket, () => editor.chain().focus().toggleCode().run(), editor.isActive('code'))}
        <span className="w-px h-5 bg-gray-200 mx-1" />
        {icon(HiOutlineListBullet, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {icon(HiOutlineNumberedList, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}
        {icon(HiOutlineChatBubbleLeftRight, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'))}
        {icon(HiOutlineMinus, () => editor.chain().focus().setHorizontalRule().run())}
        <span className="w-px h-5 bg-gray-200 mx-1" />
        {icon(HiOutlineLink, setLink, editor.isActive('link'))}
      </div>
      <EditorContent editor={editor} className="prose prose-sm max-w-none px-4 py-3 min-h-[200px] [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[150px]" />
    </div>
  );
}
