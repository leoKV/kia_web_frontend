import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart/cart.service';
import { CancionDetailDTO } from '../models/cancion-detail.dto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit{
  canciones: CancionDetailDTO[] = [];

  constructor(private cartService: CartService){}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void{
    this.canciones = this.cartService.getCart();
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

  
}
