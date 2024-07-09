import { Injectable } from '@angular/core';
import { CancionDetailDTO } from '../../models/cancion-detail.dto';
import { Observable } from 'rxjs';
import { Parametro } from '../../models/parametro';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // private storageKey = 'cart';
  private API_URL =  `${environment.apiUrl}`;
  private readonly CART_KEY = 'cart_items';
  
  constructor(private http:HttpClient) { }

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

  getCart(): CancionDetailDTO[] {
    if (!this.isLocalStorageAvailable()) {
      return [];
    }
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

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

  removeFromCart(id: number): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    let cart = this.getCart();
    cart = cart.filter(item => item.cancion_id !== id);
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  clearCart(): void {
    if (!this.isLocalStorageAvailable()) {
      return;
    }
    localStorage.removeItem(this.CART_KEY);
  }

  getNumeroWhatsapp():Observable<Parametro>{
    return this.http.get<Parametro>(`${this.API_URL}cancion/whatsapp/`);
  }

}