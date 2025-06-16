export interface Comment {
  id!:string;//!required
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
  marbleId: string;
}
