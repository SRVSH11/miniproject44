export type PostType = 'doubt' | 'notes' | 'discussion';

export interface User {
  id: string;
  name: string;
  email: string;
  passkey: string;
  avatarColor: string;
  joinedDate: string;
  course: string;
  semester: string;
  bio?: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subject: string;
  memberCount: number;
  createdAt: string;
  isCustom?: boolean;
  creatorEmail?: string;
  creatorName?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  content: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  isSolution?: boolean;
  images?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  type: PostType;
  communityId: string;
  communityName: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  commentCount: number;
  isSolved?: boolean;
  solvedCommentId?: string;
  tags?: string[];
  images?: string[];
  timestamp?: number;
}

export type FeedFilter = 'all' | 'doubt' | 'notes' | 'discussion';
export type SortOption = 'newest' | 'upvotes' | 'comments';
