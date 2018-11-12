import { gql } from 'apollo-boost';

/////////////////////////////////////////
////////////  Post Queries
////////////////////////////////////////

export const GET_POSTS = gql`
  query {
    getPosts {
      id
      title
      imageUrl
    }
  }
`;



export const GET_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      title
      imageUrl
      categories
      description
      likes
      createdDate
      messages {
        id
        messageBody
        messageDate
        messageUser {
          id
          username
          avatar
        }
      }
    }
  }
`;

export const SEARCH_POSTS = gql`
  query($searchTerm: String) {
    searchPosts(searchTerm: $searchTerm) {
      id
      title
      description
      imageUrl
      likes
    }
  }
`;


export const GET_USER_POSTS = gql`
  query($userId: ID!) {
    getUserPosts(userId: $userId) {
      id
      title
      imageUrl
      description
      categories
      createdDate
      likes
    }
  }
`;


export const ADD_POST = gql`
  mutation(
    $title: String!
    $imageUrl: String!
    $categories: [String]!
    $description: String!
    $creatorId: ID!
  ) {
    addPost(
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
      creatorId: $creatorId
    ) {
      id
      title
      imageUrl
      categories
      description
    }
  }
`;


export const ADD_POST_MESSAGE = gql`
  mutation($messageBody: String!, $userId: ID!, $postId: ID!) {
    addPostMessage(
      messageBody: $messageBody
      userId: $userId
      postId: $postId
    ) {
      id
      messageBody
      messageDate
      messageUser {
        id
        username
        avatar
      }
    }
  }
`;


export const DELETE_USER_POST = gql`
  mutation($postId: ID!) {
    deleteUserPost(postId: $postId) {
      id
    }
  }
`;

export const INFINITE_SCROLL_POSTS = gql`
  query($pageNum: Int!, $pageSize: Int!) {
    infiniteScrollPosts(pageNum: $pageNum, pageSize: $pageSize) {
      hasMore
      posts {
        id
        title
        imageUrl
        categories
        description
        likes
        createdDate
        messages {
          id
        }
        createdBy {
          id
          username
          avatar
        }
      }
    }
  }
`;



export const LIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    likePost(postId: $postId, username: $username) {
      likes
      favorites {
        id
        title
        imageUrl
      }
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation($postId: ID!, $username: String!) {
    unlikePost(postId: $postId, username: $username) {
      likes
      favorites {
        id
        title
        imageUrl
      }
    }
  }
`;


export const UPDATE_USER_POST = gql`
  mutation(
  $postId: ID!
  $userId: ID!
  $title: String!
  $imageUrl: String!
  $categories: [String]!
  $description: String!
  ) {
    updateUserPost(
      postId: $postId
      userId: $userId
      title: $title
      imageUrl: $imageUrl
      categories: $categories
      description: $description
    ) {
      id
      title
      imageUrl
      description
      categories
      createdDate
      likes
      createdBy {
        id
        avatar
      }
    }
  }
`;

/////////////////////////////////////////
////////////  User Queries
////////////////////////////////////////

export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      id
      username
      email
      password
      avatar
      joinDate
      favorites {
        id
        title
        imageUrl
      }
    }
  }
`;

/////////////////////////////////////////
////////////  User Mutations
////////////////////////////////////////

export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $password: String!, $email: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
