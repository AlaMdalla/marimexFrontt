import { Marble } from "./marble";

export  class cart{

    cartItems:cartItem[]=[];
        items :cartItem[]=[];

  totalPrice!: number;
  totalCount!: number;
    constructor (){
        
    }
}
export class cartItem{
    marbel!:Marble;
    count:number=1;
    constructor(marbel:Marble,count:number){
        this.marbel =marbel;
        this.count=count;
    }

}