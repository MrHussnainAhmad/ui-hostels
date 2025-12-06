// src/pages/student/LeaveHostel.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { bookingsApi } from "../../lib/api";
import { useSEO } from "../../hooks/useSEO";

// ==================== ICONS ====================
const StarIcon = ({
  filled = false,
  hovered = false,
}: {
  filled?: boolean;
  hovered?: boolean;
}) => (
  <svg
    className={`w-10 h-10 transition-all duration-200 ${
      filled
        ? "text-amber-400 fill-amber-400"
        : hovered
        ? "text-amber-300 fill-amber-300"
        : "text-slate-300"
    }`}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const AlertTriangleIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const AlertCircleIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const LogOutIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const PenIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    className="w-16 h-16 text-emerald-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

// ==================== RATING LABELS ====================
const ratingLabels: Record<
  number,
  { label: string; emoji: string; color: string }
> = {
  1: { label: "Poor", emoji: "😞", color: "text-red-500" },
  2: { label: "Fair", emoji: "😐", color: "text-orange-500" },
  3: { label: "Good", emoji: "🙂", color: "text-yellow-500" },
  4: { label: "Very Good", emoji: "😊", color: "text-emerald-500" },
  5: { label: "Excellent", emoji: "🤩", color: "text-emerald-600" },
};

// ==================== STAR RATING COMPONENT ====================
const StarRating: React.FC<{
  rating: number;
  onRatingChange: (rating: number) => void;
}> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            <StarIcon
              filled={star <= rating}
              hovered={star <= hoverRating && star > rating}
            />
          </button>
        ))}
      </div>
      <div
        className={`text-lg font-medium ${
          ratingLabels[hoverRating || rating]?.color
        }`}
      >
        <span className="text-2xl mr-2">
          {ratingLabels[hoverRating || rating]?.emoji}
        </span>
        {ratingLabels[hoverRating || rating]?.label}
      </div>
    </div>
  );
};

// ==================== REVIEW PROMPTS ====================
const reviewPrompts = [
  "How was the room condition?",
  "Was the staff helpful?",
  "How was the food quality?",
  "Were the facilities as described?",
  "Would you recommend this hostel?",
];

// ==================== MAIN COMPONENT ====================
const LeaveHostel: React.FC = () => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [charCount, setCharCount] = useState(0);
  const navigate = useNavigate();

  const MIN_CHARS = 20;
  const MAX_CHARS = 500;

  useSEO({
    title: "Leave Hostel | HostelHub",
    description: "Leave your current hostel and provide feedback",
  });

  useEffect(() => {
    setCharCount(review.length);
  }, [review]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (review.length < MIN_CHARS) {
      setError(`Please write at least ${MIN_CHARS} characters in your review.`);
      return;
    }

    setStep("confirm");
  };

  const handleConfirmLeave = async () => {
    setError("");
    setLoading(true);

    try {
      await bookingsApi.leave({ rating, review });
      setStep("success");
    } catch (err: any) {
      // Log the full error for debugging
      console.log("Leave hostel error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        "Failed to leave hostel";

      // Handle validation errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
          .join("; ");
        setError(errorMessages || "Validation failed");
      } else {
        setError(
          typeof errorMessage === "string"
            ? errorMessage
            : "Failed to leave hostel"
        );
      }

      setStep("form");
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-center mb-6">
              <CheckCircleIcon />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Successfully Left Hostel
            </h1>
            <p className="text-slate-600 mb-6">
              Thank you for your feedback! Your review helps other students make
              better decisions.
            </p>
            <Link
              to="/student"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
            >
              <HomeIcon />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Modal
  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                <AlertTriangleIcon />
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 text-center mb-2">
              Confirm Leave
            </h2>
            <p className="text-slate-600 text-center mb-6">
              Are you sure you want to leave your current hostel? This action
              cannot be undone.
            </p>

            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-500">Your Rating</span>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-300"
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-medium text-slate-900">{rating}/5</span>
                </div>
              </div>
              <div>
                <span className="text-sm text-slate-500">Your Review</span>
                <p className="text-slate-700 mt-1 line-clamp-3">{review}</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <div className="text-red-500 mt-0.5">
                  <AlertCircleIcon />
                </div>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("form")}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmLeave}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <SpinnerIcon />
                    Processing...
                  </>
                ) : (
                  <>
                    <LogOutIcon />
                    Leave Hostel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/student"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ChevronLeftIcon />
          <span>Back to Dashboard</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogOutIcon />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Leave Your Hostel
            </h1>
            <p className="text-slate-400 max-w-md mx-auto">
              Before you go, please share your experience to help future
              students
            </p>
          </div>

          {/* Warning Banner */}
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
            <div className="flex items-start gap-3">
              <div className="text-amber-600 mt-0.5">
                <AlertTriangleIcon />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Important Notice
                </p>
                <p className="text-sm text-amber-700 mt-0.5">
                  Leaving will end your current booking. Make sure to collect
                  all your belongings and settle any pending dues with the
                  hostel manager.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <div className="text-red-500 mt-0.5">
                  <AlertCircleIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Rating Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4 text-center">
                How would you rate your overall experience?
              </label>
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200" />

            {/* Review Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-slate-700">
                  Write your review
                </label>
                <span
                  className={`text-sm ${
                    charCount < MIN_CHARS
                      ? "text-amber-600"
                      : charCount > MAX_CHARS
                      ? "text-red-600"
                      : "text-slate-500"
                  }`}
                >
                  {charCount}/{MAX_CHARS}
                </span>
              </div>

              {/* Prompts */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-2">
                  Consider mentioning:
                </p>
                <div className="flex flex-wrap gap-2">
                  {reviewPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setReview((prev) => prev + (prev ? " " : "") + prompt)
                      }
                      className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-3 left-4 text-slate-400">
                  <PenIcon />
                </div>
                <textarea
                  value={review}
                  onChange={(e) =>
                    setReview(e.target.value.slice(0, MAX_CHARS))
                  }
                  rows={5}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none transition-all"
                  placeholder="Share your experience at this hostel. What did you like? What could be improved?"
                  required
                />
              </div>

              {charCount < MIN_CHARS && (
                <p className="text-sm text-amber-600 mt-2">
                  Please write at least {MIN_CHARS - charCount} more characters
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-200" />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate("/student")}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={charCount < MIN_CHARS}
                className="flex-1 py-3 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                <LogOutIcon />
                Continue
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-slate-100 rounded-xl">
          <p className="text-sm text-slate-600 text-center">
            Need help? Contact our support team at{" "}
            <a
              href="mailto:support@hostelhub.pk"
              className="text-slate-900 font-medium hover:underline"
            >
              support@hostelhub.pk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaveHostel;
