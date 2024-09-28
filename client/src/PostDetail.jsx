import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/fetchpost/${id}`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
                setError("Failed to load post. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <p>Loading post...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>Post not found.</p>;

    return (
        <div className="container d-flex justify-content-center mt-5">

       
        <div className="post-detail ">
              <img
                      src={`http://localhost:5000${post.image.path}`} // Use the full path
                      alt={post.title}
                      style={{width:"700px",height:"400px"}}
                  />
            <h1 className='ms-2'>{post.title}</h1>
            <p className='ms-4 text-secondary'>{post.content}</p>
        </div>
        </div>
    );
};

export default PostDetail;
