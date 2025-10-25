import React from 'react';

type Section = {
  type: 'text' | 'image' | 'code' | 'video' | 'link' | 'html';  // Added 'html' type
  content?: string;
  src?: string;
};

type PostData = {
  title?: string;
  description?: string;
  image?: string;
  category?: string;
  contentSections: any[];
};

type Props = {
  postData: PostData;
};

const BlogPostPreview = ({ postData }: Props) => {
  const { title, description, image, category, contentSections } = postData;

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl w-full">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Preview</h2>

      <div className="mb-6">
        {image && (
          <div className="mb-4 rounded-lg overflow-hidden h-64 relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-2 dark:text-white">{title || 'Post Title'}</h1>
        {category && (
          <span className="inline-block bg-gray-200 dark:bg-gray-700 dark:text-white rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            {category}
          </span>
        )}
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description || 'Post description will appear here'}</p>
      </div>

      <div className="space-y-6">
        {contentSections.map((section, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
            <p className="font-bold mb-2">{index + 1}. </p>
            {section.type === 'text' && (
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {section.content}
              </p>
            )}

            {section.type === 'image' && section.src && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={section.src}
                  alt="Content section image"
                  className="w-full h-auto"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
            )}

            {section.type === 'code' && (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{section.content}</code>
              </pre>
            )}

            {section.type === 'video' && section.src && (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={section.src}
                  className="w-full h-96 rounded-lg"
                  allowFullScreen
                />
              </div>
            )}

            {section.type === 'link' && section.src && (
              <a
                href={section.src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline break-all"
              >
                {section.src}
              </a>
            )}

            {section.type === 'html' && section.content && (
              <div className="space-y-4">
                {/* Show HTML Preview */}
                <div 
                  className="prose dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostPreview;