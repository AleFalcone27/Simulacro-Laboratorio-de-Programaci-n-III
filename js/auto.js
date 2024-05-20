class Producto {
  constructor(titulo, precio, descripcion, puertas, kms, potencia, tipo) {
    this.id = Math.random();
    this.titulo = this.checkTitulo(titulo);
    this.descripcion = descripcion;
    this.precio = precio;
    this.puertas = this.checkPuertas(puertas);
    this.kms = kms;
    this.potencia = potencia;
    this.tipo = tipo;
  }

  checkTitulo(titulo) {
    if (titulo.length < 30){
      return titulo;
    }
    else
    {
      return "Titulo no valido";
    }
  }

  checkPuertas(puertas) {
    if (puertas < 7){
      return puertas;
    }
    else
    {
      return 0;
    }
  }


}
export { Producto };
