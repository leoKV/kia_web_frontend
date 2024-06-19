import { Injectable } from '@angular/core';
import { CancionDetailDTO } from '../../models/cancion-detail.dto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // private storageKey = 'cart';
  private readonly CART_KEY = 'cart_items';

  constructor() { }

  // addToCart(cancion: CancionDetailDTO):void{
  //   const cart = this.getCart();
  //   cart.push(cancion);
  //   this.saveCart(cart);
  // }

  // getCart():CancionDetailDTO[]{
  //   const cart = localStorage.getItem(this.storageKey);
  //   return cart ? JSON.parse(cart): [];
  // }

  // private saveCart(cart: CancionDetailDTO[]):void{
  //   localStorage.setItem(this.storageKey, JSON.stringify(cart));
  // }
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // getCart(): CancionDetailDTO[] {
  //   const cart = localStorage.getItem(this.CART_KEY);
  //   return cart ? JSON.parse(cart) : [];
  // }
  getCart(): CancionDetailDTO[] {
    if (!this.isLocalStorageAvailable()) {
      return [];
    }
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  // addToCart(cancion: CancionDetailDTO): boolean {
  //   let cart = this.getCart();
    
  //   // Verificar si la canción ya está en el carrito
  //   if (!cart.some(item => item.cancion_id === cancion.cancion_id)) {
  //     cart.push(cancion);
  //     localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  //     return true;
  //   }
  //   return false;
  // }
  addToCart(cancion: CancionDetailDTO): boolean {
    if (!this.isLocalStorageAvailable()) {
      return false;
    }
    let cart = this.getCart();
    
    // Verificar si la canción ya está en el carrito
    if (!cart.some(item => item.cancion_id === cancion.cancion_id)) {
      cart.push(cancion);
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      return true; // Indicar que la canción fue agregada
    }
    
    return false; // Indicar que la canción ya estaba en el carrito
  }

  // removeFromCart(id: number): void{
  //   let cart = this.getCart();
  //   cart = cart.filter(item => item.cancion_id ! == id);
  //   localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  // }
  removeFromCart(id: number): void {
    console.log('ID DE LA CANCIÓN QUE SE ELIMINA: ',id);
    if (!this.isLocalStorageAvailable()) {
      return;
    }

    
    
    let cart = this.getCart();
    cart = cart.filter(item => item.cancion_id !== id);
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  // clearCart(): void {
  //   localStorage.removeItem(this.CART_KEY);
  // }
  clearCart(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    localStorage.removeItem(this.CART_KEY);
  }

}
