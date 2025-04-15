export interface Comment {
    id: number;
    memeId: number;
    author: string;
    text: string;
    date: string;
  }
  
  

  export interface Meme {
    id: number;
    name: string;
    image: string;
    upvotes: number;
    downvotes: number;
  }
  
  
  