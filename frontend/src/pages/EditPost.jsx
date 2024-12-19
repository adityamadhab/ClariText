import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { posts as postsApi } from '../services/api'
import Editor from '../components/blog/Editor'
import Button from '../components/common/Button'

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    coverImage: null
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsApi.getOne(id)
        const post = response.data
        setFormData({
          title: post.title,
          content: post.content,
          tags: post.tags.join(', '),
          coverImage: null
        })
      } catch (err) {
        setError('Failed to fetch post')
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'coverImage') {
      setFormData(prev => ({ ...prev, coverImage: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('tags', formData.tags.split(',').map(tag => tag.trim()))
      if (formData.coverImage) {
        formDataToSend.append('coverImage', formData.coverImage)
      }

      const response = await postsApi.update(id, formDataToSend)
      navigate(`/post/${response.data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            Content
          </label>
          <Editor
            value={formData.content}
            onChange={handleEditorChange}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="technology, programming, web development"
          />
        </div>

        <div>
          <label htmlFor="coverImage" className="block text-gray-700 mb-2">
            Cover Image
          </label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleChange}
            accept="image/*"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(`/post/${id}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditPost 