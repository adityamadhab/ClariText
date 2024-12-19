import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { posts as postsApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import moment from 'moment'
import Button from '../components/common/Button'
import CommentSection from '../components/blog/CommentSection'

const PostDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsApi.getOne(id)
        setPost(response.data)
      } catch (err) {
        setError('Failed to fetch post')
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleLike = async () => {
    try {
      const response = await postsApi.like(id)
      setPost(response.data)
    } catch (err) {
      console.error('Error liking post:', err)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsApi.delete(id)
        navigate('/')
      } catch (err) {
        console.error('Error deleting post:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error || 'Post not found'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <span>By {post.author.username}</span>
        <span className="mx-2">•</span>
        <span>{moment(post.createdAt).format('MMMM D, YYYY')}</span>
      </div>
      <div 
        className="prose max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <div className="flex items-center space-x-4 mb-8">
        <Button
          onClick={handleLike}
          variant="secondary"
        >
          {post.likes.includes(user?.id) ? 'Unlike' : 'Like'} ({post.likes.length})
        </Button>
        {user?.id === post.author._id && (
          <>
            <Button
              onClick={() => navigate(`/edit-post/${id}`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        )}
      </div>
      <CommentSection postId={id} />
    </div>
  )
}

export default PostDetail 