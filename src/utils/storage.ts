import { Community, Post, Comment, User } from '../types';
import { INITIAL_COMMUNITIES, INITIAL_POSTS, INITIAL_COMMENTS, INITIAL_USER, INITIAL_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  COMMUNITIES: 'student_comm_communities_v1',
  POSTS: 'student_comm_posts_v1',
  COMMENTS: 'student_comm_comments_v1',
  USERS: 'student_comm_users_v1',
  CURRENT_USER: 'student_comm_current_user_v1',
};

export const getStoredCommunities = (): Community[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(INITIAL_COMMUNITIES));
      return INITIAL_COMMUNITIES;
    }
    const parsed: Community[] = JSON.parse(raw);
    const sanitized: Community[] = parsed.map((comm) => {
      const initMatch = INITIAL_COMMUNITIES.find((c) => c.id === comm.id);
      return {
        ...comm,
        creatorEmail: comm.creatorEmail || initMatch?.creatorEmail || INITIAL_USER.email,
        creatorName: comm.creatorName || initMatch?.creatorName || INITIAL_USER.name,
      };
    });
    // Seamlessly merge any newly generated initial communities
    for (const initComm of INITIAL_COMMUNITIES) {
      if (!sanitized.some((c) => c.id === initComm.id)) {
        sanitized.push(initComm);
      }
    }
    return sanitized;
  } catch {
    return INITIAL_COMMUNITIES;
  }
};

export const saveCommunities = (communities: Community[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMUNITIES, JSON.stringify(communities));
  } catch (e) {
    console.error('Failed to save communities', e);
  }
};

export const getStoredPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(INITIAL_POSTS));
      return INITIAL_POSTS;
    }
    const parsed: Post[] = JSON.parse(raw);
    const sanitized: Post[] = parsed.map((p) => {
      const initMatch = INITIAL_POSTS.find((ip) => ip.id === p.id);
      return {
        ...p,
        images: p.images || initMatch?.images,
      };
    });
    // Seamlessly merge any newly generated initial posts
    for (const initPost of INITIAL_POSTS) {
      if (!sanitized.some((p) => p.id === initPost.id)) {
        sanitized.push(initPost);
      }
    }
    return sanitized;
  } catch {
    return INITIAL_POSTS;
  }
};

export const savePosts = (posts: Post[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts', e);
  }
};

export const getStoredComments = (): Comment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(INITIAL_COMMENTS));
      return INITIAL_COMMENTS;
    }
    const parsed: Comment[] = JSON.parse(raw);
    const sanitized: Comment[] = parsed.map((c) => {
      const initMatch = INITIAL_COMMENTS.find((ic) => ic.id === c.id);
      return {
        ...c,
        images: c.images || initMatch?.images,
      };
    });
    // Seamlessly merge any newly generated initial comments
    for (const initComment of INITIAL_COMMENTS) {
      if (!sanitized.some((c) => c.id === initComment.id)) {
        sanitized.push(initComment);
      }
    }
    return sanitized;
  } catch {
    return INITIAL_COMMENTS;
  }
};

export const saveComments = (comments: Comment[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save comments', e);
  }
};

export const getStoredUsers = (): User[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed: User[] = JSON.parse(raw);
    // Sanitize any existing user entries that may lack course/semester
    const merged = parsed.map((u) => ({
      ...u,
      course: u.course || 'Undergraduate Degree',
      semester: u.semester || 'Semester 1',
    }));
    // Merge any missing initial users so student post authors have rich profiles
    for (const initUser of INITIAL_USERS) {
      if (!merged.some((u) => u.email.toLowerCase() === initUser.email.toLowerCase())) {
        merged.push(initUser);
      }
    }
    return merged;
  } catch {
    return INITIAL_USERS;
  }
};

export const saveUsers = (users: User[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const hasVisited = localStorage.getItem('student_comm_has_visited');
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

    // If explicitly logged out
    if (raw === 'none') {
      return null;
    }

    if (!raw) {
      // First time visiting the site: default to initial student account
      if (!hasVisited) {
        localStorage.setItem('student_comm_has_visited', 'true');
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USER));
        return INITIAL_USER;
      }
      return null;
    }

    const parsed: User = JSON.parse(raw);
    return {
      ...parsed,
      course: parsed.course || INITIAL_USER.course,
      semester: parsed.semester || INITIAL_USER.semester,
    };
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: User | null) => {
  try {
    localStorage.setItem('student_comm_has_visited', 'true');
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, 'none');
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
};
