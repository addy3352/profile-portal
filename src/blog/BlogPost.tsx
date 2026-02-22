import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, User, Loader2 } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        // Dynamic import of the specific markdown file
        // Note: The path must be relative or absolute from project root for Vite to analyze it
        const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default' });
        const path = `../content/posts/${slug}.md`;
        
        if (!modules[path]) throw new Error('Post not found');
        
        const rawContent = await modules[path]() as string;
        
        // Simple frontmatter parser
        const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (match) {
          const metaLines = match[1].split('\n');
          const meta: Record<string, string> = {};
          metaLines.forEach(line => {
            const [key, ...val] = line.split(':');
            if (key) meta[key.trim()] = val.join(':').trim();
          });
          setMetadata(meta);
          setContent(match[2]);
        } else {
          setContent(rawContent);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center"><h2 className="text-2xl font-bold text-gray-900">Post not found</h2><Link to="/blog" className="mt-4 text-blue-600 hover:underline">Back to Blog</Link></div>;

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto prose prose-blue lg:prose-lg">
        <Link to="/blog" className="no-underline text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        
        <header className="mb-8 not-prose">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{metadata.title}</h1>
          <div className="flex items-center gap-6 text-gray-500">
            {metadata.date && <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {metadata.date}</span>}
            {metadata.author && <span className="flex items-center gap-2"><User className="w-4 h-4" /> {metadata.author}</span>}
          </div>
        </header>

        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
