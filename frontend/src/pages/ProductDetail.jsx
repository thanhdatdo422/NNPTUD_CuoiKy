import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const data = await reviewService.getReviewsByProduct(id);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;

    const formattedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `http://localhost:5000${formattedPath}`;
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    return product.image || '';
  };

  const handleAddToCart = async () => {
    try {
      await cartService.addToCart(product._id, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewService.createReview({
        product: id,
        rating: parseInt(rating),
        comment,
      });
      setComment('');
      setRating(5);
      // Refresh reviews
      const data = await reviewService.getReviewsByProduct(id);
      setReviews(data);
      alert('Review submitted!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {getProductImage(product) && (
            <img
              src={getImageUrl(getProductImage(product))}
              alt={product.name}
              className="w-full h-96 object-cover rounded border border-gray-200"
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x300?text=Image+Error';
              }}
            />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
          <p className="text-sm text-gray-500 mb-4">Stock: {product.stock}</p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div>
            {reviews.map((review) => (
              <div key={review._id} className="border p-4 rounded mb-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold">{review.user.username}</span>
                  <span className="ml-2 text-yellow-500">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
          {user ? (
            <form onSubmit={handleSubmitReview} className="border p-4 rounded">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comment:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="4"
                  placeholder="Write your review here..."
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p>Please <a href="/login" className="text-blue-600 underline">login</a> to leave a review.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;