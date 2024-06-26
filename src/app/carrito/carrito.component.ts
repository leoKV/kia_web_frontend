import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { CancionDetailDTO } from '../models/cancion-detail.dto';
import Swal from 'sweetalert2';
import { WHATSAPP_API } from '../constantes/api-whatsapp';
import { Parametro } from '../models/parametro';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit{
  canciones: CancionDetailDTO[] = [];
  numero: Parametro | undefined;
  private orderChecked: boolean = false;

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.loadCart();
    this.loadNumeroWhatsapp();
  }

  loadCart(): void{
    this.canciones = this.cartService.getCart();
  }

  loadNumeroWhatsapp():void{
    this.cartService.getNumeroWhatsapp().subscribe((data:Parametro) =>{
      this.numero = data;
    });
  }

  removeFromCart(cancion: CancionDetailDTO): void{
    Swal.fire({
      title: "¿Quieres eliminar este karaoke del carrito?",
      text: "Si lo eliminas se removera de tu lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2ecc71",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.removeFromCart(cancion.cancion_id);
        this.loadCart();
        Swal.fire({
          title: "Eliminado!",
          text: "El karaoke se ha eliminado del carrito.",
          icon: "success"
        });
      }
    });

  }

  sendCartByWhatsApp():void{
    if (this.canciones.length > 0) {
      let mensaje = 'Lista de pedidos:\n';
      this.canciones.forEach((cancion, index) => {
        mensaje += `${index + 1}.- ID: ${cancion.cancion_id} - Nombre: ${cancion.cancion_nombre} - Artista: ${cancion.artista}\n`;
      });
      const NUMERO_WHATSAPP = this.numero?.p_Valor;
      const url = `${WHATSAPP_API}?phone=${NUMERO_WHATSAPP}&text=${encodeURIComponent(mensaje)}`;
      window.open(url, '_blank');
      this.orderChecked = false;
    }
  }

  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): void {
    if (!this.orderChecked && this.canciones.length > 0){
      this.orderChecked = true;
      Swal.fire({
        title: "¿Pudiste realizar el pedido?",
        text: "Si lo lograste, se limpiará el carrito.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#2ecc71",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, lo hice",
        cancelButtonText: "No, regresar"
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartService.clearCart();
          this.loadCart();
          Swal.fire({
            title: "¡Pedido realizado!",
            text: "Tu carrito ha sido limpiado.",
            icon: "success"
          });
        }
      });
    }
  }

}
