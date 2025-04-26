export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User | string;
  votes: number;
  voters: string[];
  comments: Comment[] | string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User | string;
  post: string;
  votes?: number;
  voters?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export interface VoteData {
  vote: 1 | -1;
}

export function isComment(c: Comment | string): c is Comment {
  return typeof c !== "string" && "_id" in c;
}