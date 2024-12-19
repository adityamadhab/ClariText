import { useState, useEffect } from 'react'
import { comments as commentsApi } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'
import moment from 'moment'

const CommentSection = ({ postId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await commentsApi.getForPost(postId)
      setComments(response.data)
    } catch (err) {
      setError('Failed to fetch comments')
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const response = await commentsApi.create({
        content: newComment,
        postId
      })
      setComments([response.data, ...comments])
      setNewComment('')
    } catch (err) {
      console.error('Error creating comment:', err)
    }
  }

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentsApi.delete(commentId)
        setComments(comments.filter(comment => comment._id !== commentId))
      } catch (err) {
        console.error('Error deleting comment:', err)
      }
    }
  }

  const handleLike = async (commentId) => {
    try {
      const response = await commentsApi.like(commentId)
      setComments(comments.map(comment => 
        comment._id === commentId ? response.data : comment
      ))
    } catch (err) {
      console.error('Error liking comment:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Write a comment..."
            required
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit">
              Post Comment
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-gray-600 mb-8">Please login to comment.</p>
      )}

      {error && (
        <div className="text-red-600 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="font-semibold">{comment.author.username}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {moment(comment.createdAt).fromNow()}
                </span>
              </div>
              {user?.id === comment.author._id && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(comment._id)}
                >
                  Delete
                </Button>
              )}
            </div>
            <p className="text-gray-700 mb-2">{comment.content}</p>
            <div className="flex items-center text-sm text-gray-500">
              <button
                onClick={() => handleLike(comment._id)}
                className="hover:text-blue-600"
              >
                {comment.likes.includes(user?.id) ? 'Unlike' : 'Like'} ({comment.likes.length})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CommentSection 