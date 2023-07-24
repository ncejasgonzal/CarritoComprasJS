// Función para obtener el carrito del local storage
function obtenerCarrito() {
    let carrito = localStorage.getItem('carrito');
    if (carrito) {
        return JSON.parse(carrito);
    } else {
        return {};
    }
}

// Función para guardar el carrito en el local storage
function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar un producto al carrito
function agregarAlCarrito(nombreProducto, precioProducto) {
    let carrito = obtenerCarrito();

    if (carrito[nombreProducto]) {
        carrito[nombreProducto].cantidad++;
    } else {
        carrito[nombreProducto] = {
            precio: precioProducto,
            cantidad: 1
        };
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
    mostrarProductosCarrito();
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(nombreProducto) {
    let carrito = obtenerCarrito();

    if (carrito[nombreProducto]) {
        carrito[nombreProducto].cantidad--;
        if (carrito[nombreProducto].cantidad === 0) {
            delete carrito[nombreProducto];
        }
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();
    mostrarProductosCarrito();
}

// Función para calcular el total del carrito
function calcularTotalCarrito() {
    let carrito = obtenerCarrito();
    let total = 0;

    for (let producto in carrito) {
        total += carrito[producto].precio * carrito[producto].cantidad;
    }

    return total;
}

// Función para actualizar el contador del carrito en el DOM
function actualizarContadorCarrito() {
    let contadorCarrito = document.getElementById('contadorCarrito');
    let carrito = obtenerCarrito();
    let cantidadTotal = 0;

    for (let producto in carrito) {
        cantidadTotal += carrito[producto].cantidad;
    }

    contadorCarrito.innerText = cantidadTotal;
}

// Funcion para mostrar productos del carrito
function mostrarProductosCarrito() {
    console.log("Mostrando productos del carrito");
    let carrito = obtenerCarrito();
    let carritoItemsElement = document.getElementById('carrito-items-modal');
    let carritoTotalElement = document.getElementById('carrito-total-modal');
    carritoItemsElement.innerHTML = '';
    carritoTotalElement.innerHTML = '';

    let total = calcularTotalCarrito();
    carritoTotalElement.innerHTML = '';

    for (let producto in carrito) {
        let item = document.createElement('div');
        item.classList.add('carrito-item');

        let nombre = document.createElement('span');
        nombre.classList.add('carrito-nombre');
        nombre.textContent = 'Producto: ' + producto;

        let cantidad = document.createElement('span');
        cantidad.classList.add('carrito-cantidad');
        cantidad.textContent = 'Cantidad: ' + carrito[producto].cantidad;

        let precio = document.createElement('span');
        precio.classList.add('carrito-precio');
        precio.textContent = 'Precio: $' + carrito[producto].precio;

        let botonEliminar = document.createElement('button');
        botonEliminar.classList.add('btnEliminar');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', function () {
            eliminarDelCarrito(producto);
        });

        item.appendChild(nombre);
        item.appendChild(cantidad);
        item.appendChild(precio);
        item.appendChild(botonEliminar);

        carritoItemsElement.appendChild(item);
    }

    let totalElement = document.createElement('span');
    totalElement.classList.add('carrito-total');
    totalElement.textContent = 'Total: $' + total;

    carritoItemsElement.appendChild(totalElement);
}

// Función para cargar los productos desde el archivo JSON usando fetch
async function obtenerProductos() {
    try {
        const response = await fetch('../json/productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        const data = await response.json();
        return data.productos;
    } catch (error) {
        console.error(error);
        return []; 
    }
}

// Función para crear la card de un producto
function crearCardProducto(producto) {
    const card = document.createElement('div');
    card.classList.add('col-sm-12', 'col-md-6', 'col-lg-4');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card', 'estiloCard');
    cardInner.setAttribute('data-aos', 'zoom-in');

    cardInner.innerHTML = `
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
            <h2 class="card-title h4Index">${producto.nombre}</h2>
            <p class="card-text">${producto.descripcion}</p>
            <button class="btn btnAzul btnAgregarCarrito" dataNombreProducto="${producto.nombre}" dataPrecioProducto="${producto.precio}">
                Agregar al carrito
            </button>
        </div>
    `;

    card.appendChild(cardInner);

    return card;
}

// Función para cargar los productos en el DOM
async function cargarProductos() {
    const productContainer = document.getElementById('contenedorProductos');
    productContainer.innerHTML = ''; // Limpiar el contenedor de productos

    const productos = await obtenerProductos();

    productos.forEach(producto => {
        const cardProducto = crearCardProducto(producto);
        productContainer.appendChild(cardProducto);
    });
}

// Evento al hacer clic en el botón "Agregar al carrito"
let botonesAgregarCarrito = document.querySelectorAll('.btnAgregarCarrito');
botonesAgregarCarrito.forEach(function (boton) {
    boton.addEventListener('click', function () {
        let nombreProducto = boton.getAttribute('dataNombreProducto');
        let precioProducto = boton.getAttribute('dataPrecioProducto');

        agregarAlCarrito(nombreProducto, precioProducto);
        console.log("Se agregó el producto al carrito");
        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: 'El producto ha sido agregado al carrito con éxito',
            timer: 1200,
            showConfirmButton: false,
        });
    });
});

// Evento al cargar la página
window.addEventListener('DOMContentLoaded', function () {
    actualizarContadorCarrito();
    cargarProductos();
});

// Función para abrir el modal del carrito
function abrirModalCarrito() {
    document.getElementById('modal-carrito').classList.add('show');
    document.body.classList.add('modal-open');
}

(function () {
    // Evento al hacer clic en el icono carrito
    let iconoCarrito = document.getElementsByClassName('carritoIcon')[0];
    iconoCarrito.addEventListener('click', function () {
        console.log('Clic en el icono carrito');
        let carrito = obtenerCarrito();
        if (!carrito || Object.keys(carrito).length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Carrito vacío',
                text: 'El carrito se encuentra vacío',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Cerrar el modal del carrito si está abierto
                let modalCarrito = document.getElementById('modal-carrito');
                let modalCarritoInstance = bootstrap.Modal.getInstance(modalCarrito);
                if (modalCarritoInstance._isShown) {
                    modalCarritoInstance.hide();
                }
            });
            return; // Salir del evento para evitar abrir el modal
        }
        mostrarProductosCarrito();
        abrirModalCarrito();
    });

    // Evento al hacer clic en el botón "Pagar" en el modal del carrito
    let btnPagar = document.getElementById('btn-pagar');
    btnPagar.addEventListener('click', function pagarClickHandler() {
        let carrito = obtenerCarrito();
        if (!carrito || Object.keys(carrito).length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Carrito vacío',
                text: 'El carrito se encuentra vacío',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                // Cerrar el modal del carrito si está abierto
                let modalCarrito = document.getElementById('modal-carrito');
                let modalCarritoInstance = bootstrap.Modal.getInstance(modalCarrito);
                if (modalCarritoInstance._isShown) {
                    modalCarritoInstance.hide();
                }
            });
            return; // Salir del evento para evitar abrir el modal de pago
        }
        // Cerrar el modal del carrito
        let modalCarrito = document.getElementById('modal-carrito');
        let modalCarritoInstance = bootstrap.Modal.getInstance(modalCarrito);
        modalCarritoInstance.hide();

        // Abrir el modal de pago
        let modalPago = document.getElementById('modal-pago');
        let modalPagoInstance = new bootstrap.Modal(modalPago);
        modalPagoInstance.show();
    });
})();

// Obtener referencia al elemento del formulario
const formPago = document.getElementById('form-pago');

// Obtén referencia al elemento del mensaje de validación
const mensajeValidacion = document.getElementById('mensaje-validacion');

// Función para mostrar el mensaje de validación en forma de SweetAlert
function mostrarMensajeValidacion(mensaje, exito = false) {
    if (exito) {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: mensaje,
            timer: 1200,
            showConfirmButton: false
        }).then(() => {
            // Vaciar el carrito y redireccionar a la página principal
            guardarCarrito({});
            localStorage.removeItem('carrito');
            window.location.href = '../index.html';
        });
    } else {
        let mensajeErrorHTML = '';
        if (Array.isArray(mensaje)) {
            mensajeErrorHTML = mensaje.join('<br>');
        } else {
            mensajeErrorHTML = mensaje;
        }

        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: mensajeErrorHTML,
            confirmButtonText: 'Aceptar'
        });
    }
}

// Función para ocultar el mensaje de validación
function ocultarMensajeValidacion() {
    let mensajeElement = document.getElementById('mensaje-validacion');
    mensajeElement.innerHTML = '';
    mensajeElement.classList.remove('error');
    mensajeElement.classList.remove('exito');
}

// Evento de envío del formulario de pago
formPago.addEventListener('submit', function (event) {
    event.preventDefault();

    const numeroTarjeta = document.getElementById('numeroTarjeta').value;
    const nombreTitular = document.getElementById('nombreTitular').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;

    const tarjetaValida = /^[\d\s]{12,}$/.test(numeroTarjeta);
    const nombreValido = /^[a-zA-Z\s]+$/.test(nombreTitular);

    // Validar fecha de vencimiento (solo mes y año)
    const partesFecha = fechaVencimiento.split('/');
    const mesVencimiento = parseInt(partesFecha[0], 10);
    const anoVencimiento = parseInt(partesFecha[1], 10);

    // Obtener fecha actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // Mes del año
    const anoActual = fechaActual.getFullYear() % 100; // Obtener los últimos 2 dígitos del año

    // Verificar si la fecha de vencimiento es válida
    const fechaVencimientoValida =
        anoVencimiento > anoActual || (anoVencimiento === anoActual && mesVencimiento >= mesActual);

    const tipoTarjeta = document.getElementById('tipoTarjeta').value;
    const cuotasSelect = document.getElementById('cuotas');
    const cuotasSeleccionadas = parseInt(cuotasSelect.value);
    const cuotasValidas =
        (tipoTarjeta === 'debito' && (cuotasSeleccionadas === 1)) ||
        (tipoTarjeta === 'credito' && cuotasSeleccionadas > 0);

    if (tarjetaValida && nombreValido && fechaVencimientoValida && cuotasValidas) {
        const mensajeExito = '¡Felicitaciones! Has realizado la compra con éxito.';
        mostrarMensajeValidacion(mensajeExito, true);
        guardarCarrito({});
        localStorage.removeItem('carrito'); // Limpiar el carrito en el local storage
        actualizarContadorCarrito();
    } else {
        let mensajesError = [];

        if (!tarjetaValida) {
            mensajesError.push('Número de tarjeta inválido. Debe tener al menos 12 dígitos.');
        }

        if (!nombreValido) {
            mensajesError.push('Nombre del titular inválido. Debe contener solo letras y espacios.');
        }

        if (!fechaVencimientoValida) {
            mensajesError.push('Fecha de vencimiento inválida. Debe ser mayor o igual a la fecha actual.');
        }

        if (!cuotasValidas) {
            mensajesError.push('Selección de cuotas inválida. Revise la selección de tipo de tarjeta.');
        }

        mostrarMensajeValidacion(mensajesError);
    }
});

//CLASE 15 PROMESAS, THEN, CATCH, FETCH.
// ASI ES COMO DEBEMOS MOSTRAR LAS CARDS EN EL DOM, ELIMINANDO LAS CARDS QUE YA TENEMOS CREADAS
// EN NUESTRO HTML. PASAR LA INFO A UN ARCHIVO JSON Y LLAMARLO DESDE EL JS PARA MOSTRARLO EN EL DOM
// function getStarWarsCharacters(){
//     return fetch('https://swapi.dev/api/people/')
//         .then(response => response.json())
//         .then(data => {
//             const characters = data.results;

//             characters.forEach(character => {
//                 const characterDiv = document.createElement('div');
//                 characterDiv.classList.add('producto');

//                 characterDiv.innerHTML = `
//                 <div class='card'>
//                     <h3>${character.name}</h3>
//                     <p>height:${character.height}</p>
//                     <p>Mass:${character.mass}</p>
//                     <p>Genero:${character.gender}</p>
//                     <button class="agregar-carrito">Agregar al carrito</button>
//                 </div>
//                 `
//                 productContainer.appendChild(characterDiv)
//             });
//         })
//         .catch(err => console.error(err));
// }