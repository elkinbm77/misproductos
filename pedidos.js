document.addEventListener('DOMContentLoaded', () => {

    // Variables
    let sw1=0;
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Horno Samsum 1',
            precio: 350000,
            imagen: 'media/hn01.jpg'
        },
        {
            id: 2,
            nombre: 'Horno Samsum 2',
            precio: 380000,
            imagen: 'media/hn02.jpg'
        },
        {
            id: 3,
            nombre: 'lavadora Samsum 1',
            precio: 1000000,
            imagen: 'media/lv01.jpg'
        },
        {
            id: 4,
            nombre: 'lavadora Samsum 2',
            precio: 1200000,
            imagen: 'media/lv02.jpg'
        },
        {
            id: 5,
            nombre: 'Nevera Samsum 2',
            precio: 2000000,
            imagen: 'media/nv01.jpg'
        },
        {
            id: 6,
            nombre: 'Televisor Samsum 2',
            precio: 2200000,
            imagen: 'media/tv01.jpg'
        }


    ];

    let carrito = [];
    const divisa = ' $ -col';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const DOMbotonCancelar = document.querySelector('#boton-cancelar');
    const DOMbotonAprobar = document.querySelector('#boton-aprobar');

    const miLocalStorage = window.localStorage;

    // Funciones

    /**
    * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
    */
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
            // Estructura
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');
            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');
            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;
            // Boton 
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-success');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    /**
    * Evento para añadir un producto al carrito de la compra
    */
    function anyadirProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
         var titulo="Pedido en curso";
         document.getElementById('subtitulo').innerHTML=titulo;
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /**
    * Dibuja todos los productos guardados en el carrito
    */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            if (sw1==1){
              //  alert("aprobado");
            //---
            var img = document.createElement('img');
            img.classList.add('img-fluid');
            img.setAttribute('src', `${miItem[0].imagen}`);
            miNodo.appendChild(img);
            //---

            } else{
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);   
            }


            DOMcarrito.appendChild(miNodo);
        });
        // Renderizamos el precio total en el HTML
        DOMtotal.textContent = calcularTotal();
    }

    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();

    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    /**
    * Varia el carrito y vuelve a dibujarlo
    */
    function vaciarCarrito() {
        sw1 =0;
        // Limpiamos los productos guardados
        var titulo="Iniciar pedido";
        document.getElementById('subtitulo').innerHTML=titulo;
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.clear();
        document.getElementById('boton-aprobar').disabled = false;
        document.getElementById('boton-cancelar').disabled = false;

    }

    function cancelarCarrito() {
        sw1 =0;
        alert("Su pedido fue cancelado?");
         var titulo="Iniciar pedido";
         document.getElementById('subtitulo').innerHTML=titulo;
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.clear();

    }

    function aprobarCarrito() {
         alert("Su pedido fue aprobado!");
         var titulo="Resumen PEDIDO APROBADO";
         document.getElementById('subtitulo').innerHTML=titulo;

         //alert(sw1);
         sw1 =1;
         //alert(sw1);
        // Limpiamos los productos guardados
        //carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        //localStorage.clear();
        document.getElementById('boton-aprobar').disabled = true;
        document.getElementById('boton-cancelar').disabled = true;

    }

    function guardarCarritoEnLocalStorage () {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
            // Carga la información
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMbotonCancelar.addEventListener('click', cancelarCarrito);
    DOMbotonAprobar.addEventListener('click', aprobarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});