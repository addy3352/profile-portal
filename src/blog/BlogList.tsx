import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight, User } from 'lucide-react';

interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  author?: string;
}

// Helper to parse frontmatter (the metadata at the top of md files)
const parseFrontmatter = (text: string): { metadata: Record<string, string>; content: string } => {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, content: text };
  
  const metadataLines = match[1].split('\n');
  const metadata: Record<string, string> = {};
  
  metadataLines.forEach(line => {
    const [key, ...value] = line.split(':');
    if (key && value) metadata[key.trim()] = value.join(':').trim();
  });
  
  return { metadata, content: match[2] };
};

export default function BlogList() {
  const [posts, setPosts] = useState<PostMetadata[]>([]);

  useEffect(() => {
    console.log("[BlogList] Checking for markdown files...");
    // Load all markdown files from the content directory
    const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true });
    console.log("[BlogList] Modules found:", Object.keys(modules));
    
    const loadedPosts = Object.entries(modules).map(([path, content]) => {
      const { metadata } = parseFrontmatter(content as string);
      const slug = path.split('/').pop()?.replace('.md', '') || '';
      
      return {
        slug,
        title: metadata.title || 'Untitled',
        date: metadata.date || '',
        description: metadata.description || '',
        author: metadata.author
      };
    });

    // Sort by date descending
    loadedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    console.log("[BlogList] Processed posts:", loadedPosts);
    setPosts(loadedPosts);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-blue-600" />
            My Blog
          </h1>
          <p className="mt-3 text-xl text-gray-500">Thoughts, tutorials, and updates.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post.slug} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 line-clamp-3">{post.description}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <Link to={`/blog/${post.slug}`} className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}