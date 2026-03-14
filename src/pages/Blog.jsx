import { getAllPosts } from '../utils/getPosts';
import BlogCard from '../components/BlogCard';

export default function Blog() {
  const posts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 mb-3">Blog</h1>
        <p className="text-gray-500 text-sm">
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} on software engineering, learning, and building.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-sm">No posts yet. Drop a <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">.md</code> file in <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">src/posts/</code> to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
