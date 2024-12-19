import { Link } from 'react-router-dom'
import moment from 'moment'
import { StarIcon } from '@heroicons/react/solid'
import { ThumbUpIcon, EyeIcon, ChatIcon } from '@heroicons/react/outline'

const FeaturedPost = ({ post }) => {
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

  if (!post) return null

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center space-x-1 z-10">
        <StarIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Featured</span>
      </div>
      
      <div className="md:flex">
        {post.coverImage && (
          <div className="md:w-2/5 relative overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-64 md:h-full w-full object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        
        <div className="p-8 md:w-3/5">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
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
          
          <Link to={`/post/${post._id}`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
          </Link>
          
          <p className="text-gray-600 mb-6 line-clamp-3">
            {truncateText(post.content || '', 200)}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
              {(post.tags || []).length > 3 && (
                <span className="text-gray-500 text-sm">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 text-gray-500">
              <span className="flex items-center space-x-1">
                <EyeIcon className="w-5 h-5" />
                <span>{post.views || 0}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ThumbUpIcon className="w-5 h-5" />
                <span>{(post.likes || []).length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <ChatIcon className="w-5 h-5" />
                <span>{getCommentsCount(post)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPost 