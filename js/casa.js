class Producto {
  constructor(id, titulo, precio, description,puertas,Kms,potencia) {
    this.id = id;
    this.titulo = titulo;
    this.description = description;
    this.precio =+precio;
    this.puertas = puertas;
    this.Kms = Kms;
    this.potencia = potencia;
  }

  verify() {
    return this.checkTitulo();
  }

  checkTitulo() {
    return { success: true, rta: null };
  }
}

export { Producto };
