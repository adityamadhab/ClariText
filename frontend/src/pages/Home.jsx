import { useState, useEffect } from 'react'
import { posts as postsApi } from '../services/api'
import PostCard from '../components/blog/PostCard'
import FeaturedPost from '../components/blog/FeaturedPost'
import { SearchIcon, AdjustmentsIcon } from '@heroicons/react/outline'

const Home = ({ searchTerm, selectedTag, setAllTags }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [featuredPost, setFeaturedPost] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsApi.getAll()
        const allPosts = response.data
        // Set the most liked post as featured
        const featured = [...allPosts].sort((a, b) => b.likes.length - a.likes.length)[0]
        setFeaturedPost(featured)
        setPosts(allPosts)
        
        // Extract all unique tags and update parent state
        const tags = [...new Set(allPosts.flatMap(post => post.tags || []))]
        setAllTags(tags)
      } catch (err) {
        setError('Failed to fetch posts')
        console.error('Error fetching posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [setAllTags])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = !selectedTag || post.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            ClariText
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A space where ideas come to life. Share your thoughts, connect with others, 
          and discover amazing stories from writers around the world.
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && !loading && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Post</h2>
          <FeaturedPost post={featuredPost} />
        </div>
      )}

      {/* Posts Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
            <p className="text-gray-600">{filteredPosts.length} posts found</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No posts found matching your criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Home 