import { Casa } from "./casa.js";
import { leer, escribir, limpiar, jsonToObject, objectToJson } from "./local-storage-async.js";
import { mostrarSpinner, ocultarSpinner } from "./spinner.js";

const KEY_STORAGE = "casas";
const items = []; // array vacio
const formulario = document.getElementById("form-item");

document.addEventListener("DOMContentLoaded", onInit); // importante no poner parentesis, es un callback

function onInit() {
  loadItems();

  escuchandoFormulario();
  escuchandoBtnDeleteAll();
}

async function loadItems() {
  mostrarSpinner();
  let str = await leer(KEY_STORAGE);
  ocultarSpinner();

  const objetos = jsonToObject(str) || [];
  
  objetos.forEach(obj => {
    const model = new Casa(
        obj.id,
        obj.titulo,
        obj.precio
    );
  
    items.push(model);
  });

  rellenarTabla();
}

/**
 * Quiero que obtenga el elemento del DOM table
 * luego quiero agregarle las filas que sean necesarias
 * se agregaran dependiendo de la cantidad de items que poseo
 */
function rellenarTabla() {
    const tabla = document.getElementById("table-items");
    let tbody = tabla.getElementsByTagName('tbody')[0];
  
    tbody.innerHTML = ''; // Me aseguro que esté vacio, hago referencia al agregar otro

    const celdas = ["id", "titulo", "precio"];

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");

        celdas.forEach((celda) => {
            let nuevaCelda = document.createElement("td");
            nuevaCelda.textContent = item[celda];

            nuevaFila.appendChild(nuevaCelda);
        });

        // Agregar la fila al tbody
        tbody.appendChild(nuevaFila);
    });
  }

function escuchandoFormulario() {
  formulario.addEventListener("submit", async (e) => {
    // Luego del primer parcial, comenzaremos a enviar los datos a un externo
    // evito el comportamiento que realiza por defecto
    e.preventDefault();

    var fechaActual = new Date();

    const model = new Casa(
      fechaActual.getTime(),
      formulario.querySelector("#titulo").value,
      formulario.querySelector("#precio").value
    );

    const respuesta = model.verify();

    if (respuesta.success) {
      items.push(model);
      const str = objectToJson(items);
      
      try {
        await escribir(KEY_STORAGE, str);

        actualizarFormulario();
        rellenarTabla();
      }
      catch (error) {
        alert(error);
      }
    }
    else {
      alert(respuesta.rta);
    }
  });
}

function actualizarFormulario() {
  formulario.reset();
}

function escuchandoBtnDeleteAll() {
  const btn = document.getElementById("btn-delete-all");

  btn.addEventListener("click", async (e) => {

    const rta = confirm('Desea eliminar todos los Items?');

    if(rta) {
      items.splice(0, items.length);

      try {
        await limpiar(KEY_STORAGE);
        rellenarTabla();
      }
      catch (error) {
        alert(error);
      }
    }
  });
}
