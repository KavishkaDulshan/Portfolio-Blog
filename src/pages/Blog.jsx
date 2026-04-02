import { getAllPosts } from '../utils/getPosts';
import BlogCard from '../components/BlogCard';
import FadeIn from '../components/FadeIn';

export default function Blog() {
  const posts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10 sm:py-16">
      <FadeIn>
        <div className="mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-gray-900 mb-3">Blog</h1>
          <p className="text-gray-500 text-sm">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} on software engineering, learning, and building.
          </p>
        </div>
      </FadeIn>

      {posts.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-sm">
              No posts yet. Drop a <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">.md</code> file
              in <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">src/posts/</code> to get started.
            </p>
          </div>
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.07}>
              <BlogCard post={post} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
