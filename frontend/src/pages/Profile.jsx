import { useState, useEffect } from 'react'
import { users as usersApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import PostCard from '../components/blog/PostCard'

const Profile = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    profilePicture: null
  })

  useEffect(() => {
    fetchProfile()
    fetchUserPosts()
  }, [user.id])

  const fetchProfile = async () => {
    try {
      const response = await usersApi.getProfile(user.id)
      const profileData = response.data
      setProfile(profileData)
      setFormData({
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio || '',
        currentPassword: '',
        newPassword: '',
        profilePicture: null
      })
    } catch (err) {
      setError('Failed to fetch profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const response = await usersApi.getUserPosts(user.id)
      setUserPosts(response.data)
    } catch (err) {
      console.error('Error fetching user posts:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'profilePicture') {
      setFormData(prev => ({ ...prev, profilePicture: files[0] }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })

      await usersApi.updateProfile(formDataToSend)
      setEditMode(false)
      fetchProfile()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
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
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.username}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">
                  {profile?.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{profile?.username}</h1>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>
          <Button onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="profilePicture" className="block text-gray-700 mb-2">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="currentPassword" className="block text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-2">Bio</h2>
            <p className="text-gray-700 mb-6">{profile?.bio || 'No bio yet'}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">My Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userPosts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        {userPosts.length === 0 && (
          <p className="text-gray-600 text-center py-8">No posts yet</p>
        )}
      </div>
    </div>
  )
}

export default Profile 