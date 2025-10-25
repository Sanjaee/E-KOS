import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Constants
const ITEMS_PER_PAGE = 9;

// Types
interface Post {
  id: number;
  title: string;
  description: string;
  content: string | null;
  image: string;
  category: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface PostListProps {
  initialPosts: Post[];
  categories: string[];
}

type SortType = "views" | "latest";

// Loading skeleton component
const PostSkeleton = () => (
  <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
    <div className="flex justify-between mt-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
    </div>
  </div>
);

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(5, totalPages);
    } else {
      startPage = Math.max(1, endPage - 4);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 my-10 px-4 max-w-full">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      {pageNumbers.map((number) => (
        <Button
          key={number}
          variant={currentPage === number ? "default" : "outline"}
          onClick={() => onPageChange(number)}
          className="px-4"
        >
          {number}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Post Card Component
const PostCard = React.memo(({ post, onEdit, onDelete }: { 
  post: Post, 
  onEdit: (id: number) => void,
  onDelete: (id: number) => void 
}) => (
  <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
    <div className="h-48 overflow-hidden">
      <Image
        src={post.image || "/placeholder-image.jpg"}
        alt={post.title}
        width={400}
        height={200}
        className="w-full h-full object-cover"
      />
    </div>
    <CardHeader className="pb-2">
      <CardTitle className="line-clamp-2 text-xl">{post.title}</CardTitle>
      <CardDescription>{post.category}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow pb-2">
      <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
        {post.description}
      </p>
    </CardContent>
    <CardFooter className="flex flex-col pt-0 gap-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          <span className="text-sm mr-1">{post.views}</span>
          <span className="text-sm text-blue-600">Views</span>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div className="flex justify-between w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(post.id)}
        >
          <Edit className="h-4 w-4 mr-2" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
          onClick={() => onDelete(post.id)}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </Button>
      </div>
    </CardFooter>
  </Card>
));

const PostList: React.FC<PostListProps> = ({ initialPosts, categories }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [sortType, setSortType] = useState<SortType>("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  const router = useRouter();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortType]);

  // Simulate skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/admin/update/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmation) return;

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        credentials: "same-origin",
      });

      if (response.ok) {
        // Update local state instead of refetching
        setPosts(posts.filter(post => post.id !== id));
        
        toast({
          title: "Success",
          description: "Post deleted successfully",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  // Memoized sorted and filtered posts
  const sortedAndFilteredPosts = useMemo(() => {
    // First filter posts
    let filtered = posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Then sort posts
    return filtered.sort((a, b) => {
      if (sortType === "views") {
        return b.views - a.views;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [posts, searchTerm, selectedCategory, sortType]);

  // Get current page posts
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedAndFilteredPosts.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [sortedAndFilteredPosts, currentPage]);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Posts</h1>
        <Button onClick={() => router.push("/admin/posts/create")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        <Select
          value={sortType}
          onValueChange={(value: SortType) => setSortType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="views">Most Viewed</SelectItem>
            <SelectItem value="latest">Latest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={
                (category === "All" && !selectedCategory) ||
                category === selectedCategory
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                setSelectedCategory(category === "All" ? "" : category)
              }
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {showSkeleton ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(ITEMS_PER_PAGE)
            .fill(0)
            .map((_, index) => (
              <PostSkeleton key={index} />
            ))}
        </div>
      ) : sortedAndFilteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl mb-4">No posts found</p>
          <Button onClick={() => router.push("/admin/posts/create")}>
            Create Your First Post
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {sortedAndFilteredPosts.length > ITEMS_PER_PAGE && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(sortedAndFilteredPosts.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PostList;