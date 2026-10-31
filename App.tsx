import { useState, useMemo, useEffect } from 'react';
import {
  HelpCircle,
  FileText,
  MessageSquare,
  Sparkles,
  Plus,
  Flame,
  Clock,
  MessageCircle,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { Community, Post, Comment, User, FeedFilter, SortOption } from './types';
import {
  getStoredCommunities,
  saveCommunities,
  getStoredPosts,
  savePosts,
  getStoredComments,
  saveComments,
  getStoredUsers,
  saveUsers,
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
} from './utils/storage';
import {
  subscribeCommunities,
  subscribePosts,
  subscribeComments,
  subscribeUsers,
  createCommunityInFirestore,
  createPostInFirestore,
  updatePostInFirestore,
  deletePostFromFirestore,
  createCommentInFirestore,
  updateCommentInFirestore,
  deleteCommentFromFirestore,
  saveUserToFirestore,
  signOutFirebaseUser,
  parsePostTimestamp,
} from './utils/firebase';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PostCard } from './components/PostCard';
import { PostDetailModal } from './components/PostDetailModal';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateCommunityModal } from './components/CreateCommunityModal';
import { CommunityBar } from './components/CommunityBar';
import { AuthModal } from './components/AuthModal';
import { StudentProfileModal } from './components/StudentProfileModal';

export default function App() {
  const [communities, setCommunities] = useState<Community[]>(getStoredCommunities);
  const [posts, setPosts] = useState<Post[]>(getStoredPosts);
  const [comments, setComments] = useState<Comment[]>(getStoredComments);
  const [users, setUsers] = useState<User[]>(getStoredUsers);
  const [currentUser, setCurrentUserState] = useState<User | null>(getCurrentUser);
  const [isLiveConnected, setIsLiveConnected] = useState(true);

  // Feed filter and search states
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [postTypeFilter, setPostTypeFilter] = useState<FeedFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [profileTargetUser, setProfileTargetUser] = useState<User | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  // REAL-TIME FIRESTORE SUBSCRIPTIONS: Synchronize all devices instantaneously
  useEffect(() => {
    // 1. Subscribe to communities in real-time
    const unsubComm = subscribeCommunities((realtimeCommunities) => {
      if (realtimeCommunities && realtimeCommunities.length > 0) {
        setCommunities(realtimeCommunities);
        saveCommunities(realtimeCommunities);
      }
    });

    // 2. Subscribe to posts in real-time
    const unsubPosts = subscribePosts((realtimePosts) => {
      if (realtimePosts) {
        setPosts(realtimePosts);
        savePosts(realtimePosts);
      }
    });

    // 3. Subscribe to comments in real-time
    const unsubComments = subscribeComments((realtimeComments) => {
      if (realtimeComments) {
        setComments(realtimeComments);
        saveComments(realtimeComments);
      }
    });

    // 4. Subscribe to users in real-time
    const unsubUsers = subscribeUsers((realtimeUsers) => {
      if (realtimeUsers) {
        setUsers(realtimeUsers);
        saveUsers(realtimeUsers);
      }
    });

    setIsLiveConnected(true);

    return () => {
      unsubComm();
      unsubPosts();
      unsubComments();
      unsubUsers();
    };
  }, []);

  // Keep selectedPost synchronized if updated remotely by another device
  useEffect(() => {
    if (selectedPost) {
      const freshPost = posts.find((p) => p.id === selectedPost.id);
      if (freshPost) {
        setSelectedPost(freshPost);
      }
    }
  }, [posts]);

  // Profile View Handler
  const handleViewProfile = (emailOrUser: string | User, nameFallback?: string) => {
    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      setProfileTargetUser(emailOrUser);
      setIsProfileOpen(true);
      return;
    }
    const email = emailOrUser;
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setProfileTargetUser(found);
    } else if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
      setProfileTargetUser(currentUser);
    } else {
      setProfileTargetUser({
        id: `student-${email}`,
        name: nameFallback || email.split('@')[0],
        email: email,
        passkey: '',
        avatarColor: 'bg-indigo-600',
        joinedDate: 'Semester 2026',
        course: 'Undergraduate Degree',
        semester: 'Semester 4',
        bio: 'Student participating in peer study groups.',
      });
    }
    setIsProfileOpen(true);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    if (!users.some((u) => u.id === updatedUser.id)) {
      updatedUsers.push(updatedUser);
    }
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    if (currentUser && (currentUser.id === updatedUser.id || currentUser.email === updatedUser.email)) {
      setCurrentUserState(updatedUser);
      persistCurrentUser(updatedUser);
    }
    setProfileTargetUser(updatedUser);

    // Persist changes to Cloud Firestore
    try {
      await saveUserToFirestore(updatedUser);
      showToast('Academic details updated across all devices');
    } catch (e) {
      console.error('Failed to sync updated user to cloud', e);
    }
  };

  // Auth Handlers
  const handleLogin = (user: User) => {
    setCurrentUserState(user);
    persistCurrentUser(user);
    showToast(`Signed in as ${user.name}`);
  };

  const handleSignup = async (user: User) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    setCurrentUserState(user);
    persistCurrentUser(user);

    try {
      await saveUserToFirestore(user);
      showToast(`Welcome to StudyCircle, ${user.name}!`);
    } catch (e) {
      console.error('Failed to sync new user to cloud', e);
    }
  };

  const handleLogout = async () => {
    setCurrentUserState(null);
    persistCurrentUser(null);
    await signOutFirebaseUser();
    showToast('Signed out successfully');
  };

  // Community Creation
  const handleCreateCommunity = async (newCommunity: Community) => {
    // Optimistic UI update
    setCommunities((prev) => [newCommunity, ...prev.filter((c) => c.id !== newCommunity.id)]);
    saveCommunities([newCommunity, ...communities]);
    setSelectedCommunityId(newCommunity.id);

    // Save to Firestore so other devices see the new study circle immediately
    try {
      await createCommunityInFirestore(newCommunity);
      showToast(`Circle "c/${newCommunity.name}" published to cloud!`);
    } catch (err) {
      console.error('Error creating community in Firestore:', err);
    }
  };

  // Post Creation
  const handleCreatePost = async (newPost: Post) => {
    const postWithTime: Post = {
      ...newPost,
      timestamp: newPost.timestamp || Date.now(),
      createdAt: newPost.createdAt || 'Just now',
    };

    // Optimistic UI update: newest post placed at the very top (index 0)
    setPosts((prev) => [postWithTime, ...prev.filter((p) => p.id !== postWithTime.id)]);
    setSortOption('newest');
    savePosts([postWithTime, ...posts]);

    // Save to Cloud Firestore
    try {
      await createPostInFirestore(postWithTime);
      showToast('Post published! Placed at the top of the feed.');
    } catch (err) {
      console.error('Error creating post in Firestore:', err);
    }
  };

  // Voting on Posts
  const handleVotePost = async (postId: string, direction: 'up' | 'down') => {
    let finalUpvotes = 0;
    let finalDownvotes = 0;

    setPosts((prevPosts) => {
      const updated = prevPosts.map((post) => {
        if (post.id !== postId) return post;

        let upDelta = 0;
        let downDelta = 0;
        let newVote: 'up' | 'down' | undefined = direction;

        if (post.userVote === direction) {
          // Unvote
          newVote = undefined;
          if (direction === 'up') upDelta = -1;
          if (direction === 'down') downDelta = -1;
        } else if (post.userVote === 'up' && direction === 'down') {
          upDelta = -1;
          downDelta = 1;
        } else if (post.userVote === 'down' && direction === 'up') {
          downDelta = -1;
          upDelta = 1;
        } else {
          // New vote from no vote
          if (direction === 'up') upDelta = 1;
          if (direction === 'down') downDelta = 1;
        }

        finalUpvotes = Math.max(0, post.upvotes + upDelta);
        finalDownvotes = Math.max(0, post.downvotes + downDelta);

        return {
          ...post,
          upvotes: finalUpvotes,
          downvotes: finalDownvotes,
          userVote: newVote,
        };
      });

      savePosts(updated);

      if (selectedPost && selectedPost.id === postId) {
        const currentUpdated = updated.find((p) => p.id === postId);
        if (currentUpdated) setSelectedPost(currentUpdated);
      }

      return updated;
    });

    // Cloud Firestore Sync
    try {
      await updatePostInFirestore(postId, {
        upvotes: finalUpvotes,
        downvotes: finalDownvotes,
      });
    } catch (e) {
      console.error('Failed to update post vote in cloud', e);
    }
  };

  // Voting on Comments
  const handleVoteComment = async (commentId: string, direction: 'up' | 'down') => {
    let finalUpvotes = 0;
    let finalDownvotes = 0;

    setComments((prevComments) => {
      const updated = prevComments.map((comment) => {
        if (comment.id !== commentId) return comment;

        let upDelta = 0;
        let downDelta = 0;
        let newVote: 'up' | 'down' | undefined = direction;

        if (comment.userVote === direction) {
          newVote = undefined;
          if (direction === 'up') upDelta = -1;
          if (direction === 'down') downDelta = -1;
        } else if (comment.userVote === 'up' && direction === 'down') {
          upDelta = -1;
          downDelta = 1;
        } else if (comment.userVote === 'down' && direction === 'up') {
          downDelta = -1;
          upDelta = 1;
        } else {
          if (direction === 'up') upDelta = 1;
          if (direction === 'down') downDelta = 1;
        }

        finalUpvotes = Math.max(0, comment.upvotes + upDelta);
        finalDownvotes = Math.max(0, comment.downvotes + downDelta);

        return {
          ...comment,
          upvotes: finalUpvotes,
          downvotes: finalDownvotes,
          userVote: newVote,
        };
      });

      saveComments(updated);
      return updated;
    });

    try {
      await updateCommentInFirestore(commentId, {
        upvotes: finalUpvotes,
        downvotes: finalDownvotes,
      });
    } catch (e) {
      console.error('Failed to update comment vote in cloud', e);
    }
  };

  // Adding Comment or Doubt Solution
  const handleAddComment = async (postId: string, content: string, isSolution = false, images?: string[]) => {
    if (!currentUser) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      authorName: currentUser.name,
      authorEmail: currentUser.email,
      createdAt: 'Just now',
      content,
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      isSolution,
      ...(images && images.length > 0 ? { images: images.slice(0, 3) } : {}),
    };

    // Optimistic UI updates
    setComments((prev) => [...prev, newComment]);
    saveComments([...comments, newComment]);

    let targetCount = 1;
    setPosts((prevPosts) => {
      const updated = prevPosts.map((p) => {
        if (p.id !== postId) return p;
        targetCount = p.commentCount + 1;
        return {
          ...p,
          commentCount: targetCount,
        };
      });
      savePosts(updated);

      if (selectedPost && selectedPost.id === postId) {
        const found = updated.find((p) => p.id === postId);
        if (found) setSelectedPost(found);
      }
      return updated;
    });

    // Cloud Firestore Sync
    try {
      await createCommentInFirestore(newComment);
      await updatePostInFirestore(postId, { commentCount: targetCount });
      showToast('Reply shared with all students in real-time');
    } catch (e) {
      console.error('Failed to write comment to cloud', e);
    }
  };

  // Toggle Solved on Doubt Post or Mark Comment as Accepted Solution
  const handleToggleSolved = async (postId: string, commentId?: string) => {
    let targetIsSolved = false;
    let targetSolvedCommentId: string | undefined = undefined;

    setPosts((prevPosts) => {
      const updated = prevPosts.map((p) => {
        if (p.id !== postId) return p;

        if (commentId) {
          targetIsSolved = true;
          targetSolvedCommentId = commentId;
          return {
            ...p,
            isSolved: true,
            solvedCommentId: commentId,
          };
        } else {
          targetIsSolved = !p.isSolved;
          targetSolvedCommentId = !p.isSolved ? p.solvedCommentId : undefined;
          return {
            ...p,
            isSolved: targetIsSolved,
            solvedCommentId: targetSolvedCommentId,
          };
        }
      });

      savePosts(updated);

      if (selectedPost && selectedPost.id === postId) {
        const found = updated.find((p) => p.id === postId);
        if (found) setSelectedPost(found);
      }
      return updated;
    });

    if (commentId) {
      setComments((prevComments) => {
        const updated = prevComments.map((c) => {
          if (c.postId !== postId) return c;
          return {
            ...c,
            isSolution: c.id === commentId,
          };
        });
        saveComments(updated);
        return updated;
      });

      try {
        await updateCommentInFirestore(commentId, { isSolution: true });
      } catch (e) {
        console.error('Failed to update comment solution status', e);
      }
    }

    try {
      await updatePostInFirestore(postId, {
        isSolved: targetIsSolved,
        solvedCommentId: targetSolvedCommentId || '',
      });
      showToast(targetIsSolved ? 'Doubt marked as Solved!' : 'Doubt reopened');
    } catch (e) {
      console.error('Failed to update post solved status in cloud', e);
    }
  };

  // Helper to determine if current user created / admins a community
  const isUserCommunityAdmin = (communityId: string, user: User | null): boolean => {
    if (!user) return false;
    // Primary default admin (Aarav Sharma) has moderation privileges across circles
    if (user.email.toLowerCase() === 'aarav.study@student.edu') return true;
    const comm = communities.find((c) => c.id === communityId);
    if (!comm || !comm.creatorEmail) return false;
    return comm.creatorEmail.toLowerCase() === user.email.toLowerCase();
  };

  // Admin / Author Delete Post handler
  const handleDeletePost = async (postId: string) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.filter((p) => p.id !== postId);
      savePosts(updatedPosts);
      return updatedPosts;
    });

    setComments((prevComments) => {
      const updatedComments = prevComments.filter((c) => c.postId !== postId);
      saveComments(updatedComments);
      return updatedComments;
    });

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(null);
    }

    // Cloud Delete
    try {
      await deletePostFromFirestore(postId);
      showToast('Post removed across all devices');
    } catch (e) {
      console.error('Failed to delete post from cloud', e);
    }
  };

  // Admin / Author Delete Comment / Message handler
  const handleDeleteComment = async (commentId: string) => {
    let targetPostId: string | null = null;

    setComments((prevComments) => {
      const targetComment = prevComments.find((c) => c.id === commentId);
      if (targetComment) {
        targetPostId = targetComment.postId;
      }
      const updatedComments = prevComments.filter((c) => c.id !== commentId);
      saveComments(updatedComments);
      return updatedComments;
    });

    // Update post reply count & solution status
    let newCount = 0;
    setPosts((prevPosts) => {
      const updated = prevPosts.map((p) => {
        if (targetPostId && p.id !== targetPostId) return p;
        if (!targetPostId && p.solvedCommentId !== commentId) return p;

        const wasSolution = p.solvedCommentId === commentId;
        newCount = Math.max(0, p.commentCount - 1);
        return {
          ...p,
          commentCount: newCount,
          isSolved: wasSolution ? false : p.isSolved,
          solvedCommentId: wasSolution ? undefined : p.solvedCommentId,
        };
      });
      savePosts(updated);

      if (selectedPost && (selectedPost.id === targetPostId || selectedPost.solvedCommentId === commentId)) {
        const found = updated.find((p) => p.id === selectedPost.id);
        if (found) setSelectedPost(found);
      }

      return updated;
    });

    // Cloud Delete
    try {
      await deleteCommentFromFirestore(commentId);
      if (targetPostId) {
        await updatePostInFirestore(targetPostId, { commentCount: newCount });
      }
      showToast('Reply removed across all devices');
    } catch (e) {
      console.error('Failed to delete comment from cloud', e);
    }
  };

  // Selected Community Info
  const activeCommunity = useMemo(
    () => communities.find((c) => c.id === selectedCommunityId),
    [communities, selectedCommunityId]
  );

  // Filtered and Sorted Posts
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by Community
    if (selectedCommunityId) {
      result = result.filter((p) => p.communityId === selectedCommunityId);
    }

    // Filter by Post Type (All, Doubt, Notes, Discussion)
    if (postTypeFilter !== 'all') {
      result = result.filter((p) => p.type === postTypeFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.communityName.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortOption === 'newest') {
      // Sort in reverse chronological order: newest created posts first at the top
      result.sort((a, b) => {
        const timeA = a.timestamp || parsePostTimestamp(a);
        const timeB = b.timestamp || parsePostTimestamp(b);
        return timeB - timeA;
      });
    } else if (sortOption === 'upvotes') {
      result.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
    } else if (sortOption === 'comments') {
      result.sort((a, b) => b.commentCount - a.commentCount);
    }

    return result;
  }, [posts, selectedCommunityId, postTypeFilter, searchQuery, sortOption]);

  // Counts for activity
  const doubtCount = posts.filter((p) => p.type === 'doubt').length;
  const notesCount = posts.filter((p) => p.type === 'notes').length;
  const discussionCount = posts.filter((p) => p.type === 'discussion').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => currentUser && handleViewProfile(currentUser)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenCreateCommunity={() => setIsCreateCommunityOpen(true)}
        selectedCommunityName={activeCommunity?.name}
        onResetCommunity={() => setSelectedCommunityId(null)}
        onSwitchDemoUser={handleLogin}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Horizontal Communities Bar */}
        <CommunityBar
          communities={communities}
          selectedCommunityId={selectedCommunityId}
          onSelectCommunity={setSelectedCommunityId}
          onOpenCreateCommunity={() => setIsCreateCommunityOpen(true)}
        />

        {/* Active Community Banner (if in specific community) */}
        {activeCommunity && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 mb-6 shadow-xs flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs shrink-0">
                  {activeCommunity.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-slate-900">{activeCommunity.name}</h1>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      c/{activeCommunity.slug}
                    </span>
                    {isUserCommunityAdmin(activeCommunity.id, currentUser) ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        You are Community Admin
                      </span>
                    ) : (
                      activeCommunity.creatorName && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          <ShieldCheck className="w-3 h-3 text-slate-400" />
                          Admin: {activeCommunity.creatorName}
                        </span>
                      )
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">{activeCommunity.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  id="community-new-post-btn"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post in {activeCommunity.name}</span>
                </button>
              </div>
            </div>

            {/* Admin Moderation Alert Banner if Current User is the Community Admin */}
            {isUserCommunityAdmin(activeCommunity.id, currentUser) && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-900 bg-indigo-50/50 rounded-lg px-3 py-2 border border-indigo-100">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    <strong>Admin Moderation Active:</strong> As creator and admin of this community, you have the authority to delete unwanted posts and messages.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Feed Column */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Filter & Sort Controls Card */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Post Type Filter Tabs (All, Doubts, Notes, Discussions) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  id="filter-all-btn"
                  onClick={() => setPostTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    postTypeFilter === 'all'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  All Posts
                </button>
                <button
                  type="button"
                  id="filter-doubt-btn"
                  onClick={() => setPostTypeFilter('doubt')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    postTypeFilter === 'doubt'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Doubts ({doubtCount})
                </button>
                <button
                  type="button"
                  id="filter-notes-btn"
                  onClick={() => setPostTypeFilter('notes')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    postTypeFilter === 'notes'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Notes ({notesCount})
                </button>
                <button
                  type="button"
                  id="filter-discussion-btn"
                  onClick={() => setPostTypeFilter('discussion')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    postTypeFilter === 'discussion'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200/60'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Discussions ({discussionCount})
                </button>
              </div>

              {/* Sort selector */}
              <div className="flex items-center justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400">Sort:</span>
                <button
                  type="button"
                  id="sort-newest-btn"
                  onClick={() => setSortOption('newest')}
                  className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                    sortOption === 'newest' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Newest Posts"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New</span>
                </button>
                <button
                  type="button"
                  id="sort-upvotes-btn"
                  onClick={() => setSortOption('upvotes')}
                  className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                    sortOption === 'upvotes' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Top Upvoted"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Top</span>
                </button>
                <button
                  type="button"
                  id="sort-comments-btn"
                  onClick={() => setSortOption('comments')}
                  className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                    sortOption === 'comments' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                  title="Most Discussed"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Discussed</span>
                </button>
              </div>
            </div>

            {/* Quick post creation prompt bar (Reddit style) */}
            <div
              id="feed-create-post-prompt"
              onClick={() => setIsCreatePostOpen(true)}
              className="bg-white rounded-xl border border-slate-200/80 p-3 shadow-xs flex items-center gap-3 cursor-pointer hover:border-slate-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                {currentUser ? currentUser.name.charAt(0) : '🎓'}
              </div>
              <div className="flex-1 text-xs text-slate-400 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200/70 hover:bg-slate-100/70 transition-colors">
                Ask a doubt, share study notes, or start a subject discussion...
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0"
              >
                Post
              </button>
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-xs">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800 mb-1">No posts found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  {searchQuery
                    ? `No study posts matched "${searchQuery}". Try a different keyword.`
                    : 'Be the first student to publish a doubt, share notes, or post a discussion here!'}
                </p>
                <button
                  type="button"
                  id="empty-state-create-post-btn"
                  onClick={() => setIsCreatePostOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onVote={handleVotePost}
                    onSelectPost={setSelectedPost}
                    onSelectCommunity={setSelectedCommunityId}
                    isAuthor={currentUser?.email === post.authorEmail}
                    isCommunityAdmin={isUserCommunityAdmin(post.communityId, currentUser)}
                    onDeletePost={handleDeletePost}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right/Sidebar Navigation Column */}
          <Sidebar
            communities={communities}
            selectedCommunityId={selectedCommunityId}
            onSelectCommunity={setSelectedCommunityId}
            onOpenCreateCommunity={() => setIsCreateCommunityOpen(true)}
            doubtCount={doubtCount}
            notesCount={notesCount}
            discussionCount={discussionCount}
            currentUser={currentUser}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Student Community</span>
            <span>•</span>
            <span>A simple Reddit-style study forum</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Math • Physics • Chemistry • Biology • Computer Science • Economics • Law • Psychology • History • Geography</span>
          </div>
        </div>
      </footer>

      {/* Post Detail Modal with Doubt Resolution & Comments */}
      <PostDetailModal
        post={selectedPost}
        comments={comments}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        currentUser={currentUser}
        isCommunityAdmin={selectedPost ? isUserCommunityAdmin(selectedPost.communityId, currentUser) : false}
        onVotePost={handleVotePost}
        onVoteComment={handleVoteComment}
        onAddComment={handleAddComment}
        onToggleSolved={handleToggleSolved}
        onDeletePost={handleDeletePost}
        onDeleteComment={handleDeleteComment}
        onOpenAuth={() => setIsAuthOpen(true)}
        onViewProfile={handleViewProfile}
      />

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onCreate={handleCreatePost}
        communities={communities}
        selectedCommunityId={selectedCommunityId}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsCreatePostOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* Create Community Modal */}
      <CreateCommunityModal
        isOpen={isCreateCommunityOpen}
        onClose={() => setIsCreateCommunityOpen(false)}
        onCreate={handleCreateCommunity}
        currentUser={currentUser}
      />

      {/* Auth Modal (Signup / Signin / Profile) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLogout={handleLogout}
        users={users}
        onOpenFullProfile={() => currentUser && handleViewProfile(currentUser)}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={profileTargetUser}
        currentUser={currentUser}
        posts={posts}
        comments={comments}
        onUpdateUser={handleUpdateUser}
        onSelectPost={(post) => {
          setSelectedPost(post);
          setIsProfileOpen(false);
        }}
        onLogout={handleLogout}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div
          id="app-toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
