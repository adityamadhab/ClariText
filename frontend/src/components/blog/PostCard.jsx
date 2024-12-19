import { Link } from 'react-router-dom'
import moment from 'moment'
import { ThumbUpIcon, EyeIcon, ChatIcon } from '@heroicons/react/outline'

const PostCard = ({ post }) => {
  const truncateText = (text, maxLength) => {
    const strippedText = text.replace(/<[^>]*>/g, '')
    return strippedText.length > maxLength 
      ? `${strippedText.substring(0, maxLength)}...` 
      : strippedText
  }

  const getInitial = (username) => {
    return username && username.length > 0 ? username[0].toUpperCase() : '?'
  }

  const getCommentsCount = (post) => {
    return post.comments?.length || 0
  }

  return (
    <Link to={`/post/${post._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
        {post.coverImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">
                {getInitial(post.author?.username)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {post.author?.username || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500">
                {moment(post.createdAt).fromNow()}
              </p>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(post.content || '', 150)}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {(post.tags || []).length > 2 && (
                <span className="text-xs text-gray-500">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <span className="flex items-center space-x-1">
                <EyeIcon className="w-4 h-4" />
                <span>{post.views || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ThumbUpIcon className="w-4 h-4" />
                <span>{(post.likes || []).length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ChatIcon className="w-4 h-4" />
                <span>{getCommentsCount(post)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PostCard 