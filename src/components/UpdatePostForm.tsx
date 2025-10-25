import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload, Image as ImageIcon } from "lucide-react";
import BlogPostPreview from "@/components/BlogPostPreview";
import ImageUploadDialog from "@/components/ImageUploadPopup";
import { Button } from "@/components/ui/button";

interface ContentSection {
  type: string;
  content: string;
  src: string;
}

interface PostData {
  id: number;
  title: string;
  content: string;
  description: string;
  image: string;
  category: string;
  contentSections: ContentSection[];
}

const UpdatePostForm = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [contentSections, setContentSections] = useState<ContentSection[]>([
    { type: "text", content: "", src: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [isMainImageDialogOpen, setIsMainImageDialogOpen] = useState(false);
  const [currentSectionForImage, setCurrentSectionForImage] = useState<number | null>(null);

  // Fetch post data when the component mounts
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log(`Fetching post data for ID: ${id}`);
        
        // Include the full URL to avoid relative URL issues
        const baseUrl = window.location.origin;
        const url = `${baseUrl}/api/posts/${id}`;
        console.log('Fetching from URL:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Ensure credentials are included for CORS
          credentials: 'include',
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Post data received:", data);
          const post = data.data;
          
          // Set post data
          setTitle(post.title || "");
          setContent(post.content || "");
          setDescription(post.description || "");
          setImage(post.image || "");
          setCategory(post.category || "");
          
          // Set content sections or use default if none
          if (post.contentSections && post.contentSections.length > 0) {
            // Sort sections by order if needed
            const sortedSections = [...post.contentSections].sort((a, b) => a.order - b.order);
            setContentSections(sortedSections);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch post data:", errorText);
          try {
            const errorJson = JSON.parse(errorText);
            console.error("Error details:", errorJson);
          } catch (e) {
            // If not JSON, just log the text
          }
          
          toast({
            title: "Error",
            description: "Gagal mengambil data postingan.",
            variant: "destructive",
          });
          
          setTimeout(() => {
            router.push("/admin");
          }, 2000);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat mengambil data postingan.",
          variant: "destructive",
        });
        
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, router]);

  const handleAddSection = () => {
    setContentSections([
      ...contentSections,
      { type: "text", content: "", src: "" },
    ]);
  };

  const handleDeleteSection = (indexToDelete: number) => {
    // Prevent deletion if only one section remains
    if (contentSections.length === 1) {
      toast({
        title: "Tidak bisa menghapus section",
        description: "Anda harus memiliki setidaknya satu section.",
        variant: "destructive",
      });
      return;
    }

    const updatedSections = contentSections.filter(
      (_, index) => index !== indexToDelete
    );
    setContentSections(updatedSections);
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    const updatedSections = [...contentSections];
    updatedSections[index] = { 
      ...updatedSections[index], 
      [field]: value 
    };
    setContentSections(updatedSections);
  };

  // Function to handle image URL from the upload dialog
  const handleImageUrl = (url: string) => {
    // If uploading for main image
    if (currentSectionForImage === null) {
      setImage(url);
    } 
    // If uploading for a specific section
    else {
      handleSectionChange(currentSectionForImage, "src", url);
    }
  };

  // Function to open image dialog for main image
  const openMainImageUpload = () => {
    setCurrentSectionForImage(null);
    setIsMainImageDialogOpen(true);
  };

  // Function to open image dialog for section image
  const openSectionImageUpload = (index: number) => {
    setCurrentSectionForImage(index);
    setIsMainImageDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const confirmation = window.confirm(
      "Apakah Anda yakin ingin memperbarui postingan ini?"
    );

    if (!confirmation) {
      toast({
        title: "Pembaruan dibatalkan",
        description: "Anda telah membatalkan pembaruan postingan.",
        variant: "destructive",
      });
      return;
    }

    // Prepare the data payload
    const postData = {
      title,
      content,
      description,
      image,
      category,
      contentSections,
    };

    console.log(`Updating post ID: ${id} with data:`, postData);

    try {
      // Show loading toast
      toast({
        title: "Memperbarui postingan",
        description: "Sedang memproses permintaan Anda...",
      });

      // Include the full URL to avoid relative URL issues
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/api/update-post?id=${id}`;
      console.log('Sending update to URL:', url);
      
      // Send the update request
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(postData),
      });

      console.log('Update response status:', response.status);
      
      if (response.ok) {
        // Success response
        const result = await response.json();
        console.log("Update successful:", result);
        
        // Show success toast and redirect
        toast({
          title: "Postingan berhasil diperbarui",
          description: "Postingan Anda telah berhasil diperbarui.",
          variant: "default",
        });
        
        // Redirect after a short delay to ensure toast is visible
        setTimeout(() => {
          router.push("/admin");
        }, 1000);
      } else {
        // Error response
        const errorText = await response.text();
        console.error("Failed to update post:", errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          console.error("Error details:", errorJson);
          
          toast({
            title: "Error",
            description: errorJson?.error || "Gagal memperbarui postingan. Silakan coba lagi.",
            variant: "destructive",
          });
        } catch (e) {
          // If not JSON, just use the text
          toast({
            title: "Error",
            description: errorText || "Gagal memperbarui postingan. Silakan coba lagi.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui postingan.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-20 bg-gray-100 dark:bg-gray-900">
      <div className="mt-20 container mx-auto px-4">
        <div className="flex gap-8 relative">
          {/* Preview Section - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <BlogPostPreview
              postData={{
                title,
                description,
                image,
                category,
                contentSections,
              }}
            />
          </div>

          {/* Input Form Section - Fixed */}
          <div className="w-[600px] relative">
            <div className="fixed top-20 w-[600px] max-h-screen overflow-y-auto pb-8">
              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-4xl w-full sticky bottom-0"
              >
                <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
                  Update Post
                </h2>
                
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 p-2 block w-full rounded-md dark:bg-white dark:text-black border border-gray-500 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="mt-1 p-2 block w-full rounded-md dark:bg-white dark:text-black border-gray-500 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 p-2 block w-full rounded-md dark:bg-white dark:text-black border-gray-500 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                  >
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      id="image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="mt-1 p-2 py-2 block w-full rounded-md dark:bg-white dark:text-black border-gray-500 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <Button 
                      type="button" 
                      onClick={openMainImageUpload}
                      className="mt-1 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="mt-1 p-2 block w-full rounded-md dark:bg-white dark:text-black border-gray-500 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-700 mb-2 dark:text-white">
                    Content Sections ({contentSections.length})
                  </h3>
                  {contentSections.map((section, index) => (
                    <div
                      key={index}
                      className="mb-4 border rounded p-4 relative"
                    >
                      {/* Section number badge */}
                      <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Section #{index + 1}
                      </div>
                      
                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(index)}
                        className="absolute top-4 right-6 p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Delete section"
                      >
                        <Trash2 size={30} />
                      </button>

                      <div className="mt-8">
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                          Type (Section #{index + 1})
                        </label>
                        <select
                          value={section.type}
                          onChange={(e) =>
                            handleSectionChange(index, "type", e.target.value)
                          }
                          className="mb-2 py-3 px-2 block w-full rounded-md dark:bg-gray-800 dark:text-white border-gray-500 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                          <option value="text">Text</option>
                          <option value="image">Image</option>
                          <option value="code">Code</option>
                          <option value="video">Video</option>
                          <option value="link">Link</option>
                          <option value="html">HTML</option>
                        </select>
                      </div>
                      
                      {section.type === "html" && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            HTML Content (Section #{index + 1})
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                            placeholder="Enter HTML content"
                            className="block w-full h-48 rounded-md dark:bg-white dark:text-black border-gray-500 border p-2 font-mono"
                          />
                        </div>
                      )}
                      {section.type === "text" && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Text Content (Section #{index + 1})
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                            placeholder="Enter text content"
                            className="block w-full rounded-md border-gray-500 border dark:bg-white dark:text-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
                            rows={5}
                          />
                        </div>
                      )}
                      {(section.type === "image" ||
                        section.type === "video") && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)} URL (Section #{index + 1})
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={section.src}
                              onChange={(e) =>
                                handleSectionChange(index, "src", e.target.value)
                              }
                              placeholder={`Enter ${section.type} URL`}
                              className="py-2 px-2 block w-full rounded-md dark:bg-white dark:text-black border-gray-500 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            {section.type === "image" && (
                              <Button 
                                type="button" 
                                onClick={() => openSectionImageUpload(index)}
                                className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                              >
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      {section.type === "code" && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Code Content (Section #{index + 1})
                          </label>
                          <textarea
                            value={section.content}
                            onChange={(e) =>
                              handleSectionChange(
                                index,
                                "content",
                                e.target.value
                              )
                            }
                            placeholder="Enter code content"
                            className="py-2 px-2 block w-full rounded-md dark:bg-white dark:text-black border-gray-500 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows={8}
                          />
                        </div>
                      )}
                      {section.type === "link" && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Link URL (Section #{index + 1})
                          </label>
                          <input
                            type="url"
                            value={section.src}
                            onChange={(e) =>
                              handleSectionChange(index, "src", e.target.value)
                            }
                            placeholder="Enter link URL"
                            className="py-2 px-2 block w-full rounded-md dark:bg-white dark:text-black border-gray-500 border shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Add Section
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Update Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Upload Dialog */}
      <ImageUploadDialog
        isOpen={isMainImageDialogOpen}
        onOpenChange={(open) => {
          setIsMainImageDialogOpen(open);
          if (!open) setCurrentSectionForImage(null);
        }}
        onImageUploaded={(imageData) => {
          handleImageUrl(imageData.url);
          setIsMainImageDialogOpen(false);
        }}
      />
    </div>
  );
};

export default UpdatePostForm;