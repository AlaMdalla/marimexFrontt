
export class Comment {
  id?: string;
  userId!: string;
  userName!: string;
  text!: string;
  createdAt?: Date;
  marbleId!: string;
  rating!: number; // Add this line
}
