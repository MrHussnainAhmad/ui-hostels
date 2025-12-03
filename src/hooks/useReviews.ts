// src/hooks/useReviews.ts
import { useState, useEffect } from 'react';
import { reviewsApi } from '../lib/api';

export interface Review {
  _id: string;
  student: {
    _id: string;
    email: string;
    studentProfile?: {
      fullName: string;
    };
  };
  hostel: {
    _id: string;
    name: string;
  };
  rating: number;
  content: string;
  createdAt: string;
}

interface UseReviewsResult {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFeaturedReviews = (limit: number = 4): UseReviewsResult => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsApi.getFeatured(limit);
      setReviews(response.data.reviews || response.data);
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [limit]);

  return { reviews, loading, error, refetch: fetchReviews };
};

export const useHostelReviews = (hostelId: string): UseReviewsResult => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!hostelId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await reviewsApi.getHostelReviews(hostelId);
      setReviews(response.data.reviews || response.data);
    } catch (err: any) {
      console.error('Failed to fetch hostel reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [hostelId]);

  return { reviews, loading, error, refetch: fetchReviews };
};