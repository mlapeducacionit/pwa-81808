import Swal from 'sweetalert2'

import './style.css'
import handleHttp from './utils/handle-http';
import { guardarListaProductos, leerListaProductos } from './utils/handle-local-storage';

// ! ----------------------------------------
// ! Menú
// ! ----------------------------------------

const sidebar = document.getElementById('sidebar')
const overlay = document.getElementById('overlay')
const toogleButton = document.getElementById('toggle-sidebar')
const closeButton = document.getElementById('close-sidebar')

function openSidebar() {
    sidebar.classList.remove('-translate-x-full')
    overlay.classList.remove('hidden')
}

function closeSidebar() {
    sidebar.classList.add('-translate-x-full')
    overlay.classList.add('hidden')
}


toogleButton.addEventListener('click', openSidebar)
closeButton.addEventListener('click', closeSidebar)
overlay.addEventListener('click', closeSidebar)

// ! ----------------------------------------
// ! VARIABLES GLOBAL
// ! ----------------------------------------

const urlProductos = controlarAmbiente()

function controlarAmbiente() {
    console.log( import.meta.env.DEV ) // Si estoy en desarrollo o en producción (true o false)
    let apiUrl = ''
    if ( import.meta.env.DEV ) {
        console.log('Estoy en desarrollo')
        apiUrl = import.meta.env.VITE_API_PRODUCTOS // json-server
    } else {
        console.log('Estoy en producción')
        apiUrl = import.meta.env.VITE_API_PRODUCTOS_PROD // mockapi
    }

    return apiUrl
}


let listadoProductos = leerListaProductos()
/* let listadoProductos = [ */
/*     { id: "1", nombre: 'Carne', cantidad: 2, precio: 42.34 }, // 0 
    { id: "2", nombre: 'Leche', cantidad: 4, precio: 22.34 }, // 1 
    { id: "3", nombre: 'Pan', cantidad: 5, precio: 12.34 }, // 2
    { id: "4", nombre: 'Fideos', cantidad: 3, precio: 2.34 }, // 3 */
/* ] */

let crearLista = true
let ul = null

// ! ---------------------------------------
// ! Obtener todos los productos
// ! ---------------------------------------
async function obtenerTodosLosProductos() {

    try {

        /* CRUD -> R:READ -> Método GET */
        const productos = await handleHttp(urlProductos) 
        //console.log(productos)

        // Guardo la lista de productos actual en el localStorage (persisto en el navegador)
        guardarListaProductos(listadoProductos)
        
        listadoProductos = productos

    } catch (error) {
        listadoProductos = leerListaProductos()
        throw error
    }

}

// ! ---------------------------------------
// ! Render lista
// ! ---------------------------------------
function renderLista() {
    console.log('renderLista')

    //debugger
    if ( crearLista ) {
        ul = document.createElement('ul')
        ul.id = 'lista-productos'
    }

    
    ul.innerHTML = ''
    listadoProductos.forEach((prod, index) => {

        ul.innerHTML += `
            <li class="flex items-center justify-between bg-white rounded-lg shadow p-3 mb-2 hover:bg-gray-50 transition">
                <!-- Icono de producto -->
                <span class="flex items-center justify-center w-10 text-indigo-600">
                    <i class="material-symbols-outlined text-2xl">shopping_cart</i>
                </span>
                <!-- Nombre del producto -->
                <span class="flex-1 text-gray-800 font-medium truncate w-32">
                    ${prod.nombre}
                </span>
                <!-- Cantidad -->
                <span class="w-24">
                    <label for="lbl-cantidad-${prod.id}" class="block text-xs text-gray-500">Cantidad</label>
                    <input type="text" name="cantidad" id="lbl-cantidad-${prod.id}" value="${prod.cantidad}" class="i-cantidad mt-1 w-full border border-gray-300 rounded-md text-sm p-1 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </span>
                <!-- Precio -->
                <span class="w-24 ms-2">
                    <label for="lbl-precio-${prod.id}" class="block text-xs text-gray-500">Precio</label>
                    <input type="text" name="precio" id="lbl-precio-${prod.id}" value="${prod.precio}" class="i-precio mt-1 w-full border border-gray-300 rounded-md text-sm p-1 text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                </span>
                <!-- Borrar producto -->
                    <span class="w-12 flex justify-center">
                    <button
                        data-id="${prod.id}"
                        class="boton-borrado-por-id flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 shadow transition cursor-pointer ms-2"
                    >
                        <i class="material-symbols-outlined">remove_shopping_cart</i>
                    </button>
                </span>
            </li>
    
        `

        if ( crearLista ) {
            document.querySelector('#lista').appendChild(ul)
        }
        //console.log(prod)
        //console.log(index)

        crearLista = false
    })

}

// ! ---------------------------------------
// ! Configurar Listeners
// ! ---------------------------------------

function configurarListeners() {
    // ! Ingreso del producto nuevo
    document.getElementById('btn-entrada-producto').addEventListener('click', async function() {
        console.log('btn-entrada-producto')

        //const input = this.parentElement.children[0].children[1]
        const input = document.querySelector('#ingreso-producto')
        //console.dir(input)

        let producto = input.value
        console.log(producto)
        // Date.now() -> Genera un timestamp -> marca de tiempo -> Son milisegundos desde 1 de enero de 1970
        // https://www.unixtimestamp.com/
        if (producto) {
            const nuevoProducto = { nombre: producto, cantidad: 1, precio: 0 }

            const options = {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(nuevoProducto)
            }

            try {

                const productoCreado = await handleHttp(urlProductos, options)
                listadoProductos.push(productoCreado)
                
                renderLista()
                input.value = ''

            } catch (error) {
                throw error
            }

        }


    })

    // ! Borrado total de productos
    document.getElementById('btn-borrar-productos').addEventListener('click', () => {
        console.log('btn-borrar-productos')
        
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No vas a poder volver atrás",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
            }).then((result) => {
            if (result.isConfirmed) {
                if(listadoProductos.length) {

                    listadoProductos.forEach( async producto => {

                        try {
                            //console.log(producto)

                            const urlEliminacion = urlProductos + producto.id
                            //console.log(urlEliminacion)

                            const options = {
                                method: 'DELETE'
                            }

                            await handleHttp(urlEliminacion, options)
                            
                        } catch (error) {
                            
                        }

                    })


                    listadoProductos = []
                    renderLista()
                }
            }
            });
        
    })

    // ! Eventos para los botones de borrado individual
    document.getElementById('lista-productos').addEventListener('click', function(e) {
        //console.dir(e.target)
        //const idProductoABorrar = e.target.parentElement.dataset.id
        const elemento = e.target.parentElement
        //console.log(elemento)
        if ( elemento.classList.contains('boton-borrado-por-id') ) {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "No vas a poder volver atrás",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
                }).then(async (result) => {

                    if (result.isConfirmed) {

                        try {

                            const urlBorrado = urlProductos + elemento.dataset.id

                            const options = {
                                method: 'DELETE'
                            }

                            await handleHttp(urlBorrado, options)

                            const indiceProducto = listadoProductos.findIndex(prod => prod.id === elemento.dataset.id)
                            console.log(indiceProducto)
                            listadoProductos.splice(indiceProducto, 1)
                            renderLista()
                            
                        } catch (error) {
                            throw error
                        }

                }
            });
        } /* else {
            console.warn('No hago nada.')
        } */

    })

    // ! Eventos edición de productos
    document.getElementById('lista-productos').addEventListener('change', async function(e) {
        // console.log(e.target)

        const elemento = e.target

        if ( e.target.classList.contains('i-precio')) {
            // console.log(elemento)
            const boton = elemento.parentElement.parentElement.querySelector('button')
            const id = boton.dataset.id
            const index = listadoProductos.findIndex(prod => prod.id === id)
            const productoEncontrado = listadoProductos[index]
            console.log(id)
            let valor = elemento.value
            valor = Number(valor)
            let nombre = elemento.name
            
            try {
                const urlEdicion = urlProductos + id
                console.log(urlEdicion)
                
                const options = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify( { ...productoEncontrado, [nombre]: valor } )
                }

                await handleHttp(urlEdicion, options)
                
            } catch (error) {
                throw error
            }
            
        }

        if ( e.target.classList.contains('i-cantidad')) {
             // console.log(elemento)
            const boton = elemento.parentElement.parentElement.querySelector('button')
            const id = boton.dataset.id
            console.log(id)
            const index = listadoProductos.findIndex(prod => prod.id === id)
            const productoEncontrado = listadoProductos[index]
            let valor = elemento.value
            valor = Number(valor)
            let nombre = elemento.name
            
            try {
                const urlEdicion = urlProductos + id
                console.log(urlEdicion)
                
                const options = {
                    method: 'PUT',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify( { ...productoEncontrado, [nombre]: valor } )
                }

                await handleHttp(urlEdicion, options)
                
            } catch (error) {
                throw error
            }
        }

    })
}

// ! ---------------------------------------
// ! Registrar Service Worker
// ! ---------------------------------------
// https://developer.mozilla.org/en-US/docs/Web/API
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API



async function registrarServiceWorker() {
    console.log('Se está registrando el SW...')

    if ( 'serviceWorker' in navigator ) {
        console.log('Está disponible el SW')
        try {
            const reg = await window.navigator.serviceWorker.register('/sw.js')
            console.log('El service se registro correctamente...', reg)

            // Pedimos permiso para que l sistema operativo nos envíe notificaciones
            // https://developer.mozilla.org/en-US/docs/Web/API/Notification
            
            window.Notification.requestPermission( async result => {
                if ( result === 'granted' ) {
                    console.log('El usuaro acepto las notificaciones')
                    const registration = await window.navigator.serviceWorker.ready
                    console.log(registration)
                    //registration.showNotification('Gracias por permitir las notificaciones!')
                } else {
                    console.error('El usuario no acepto recibir notificaciones')
                }
            })


        } catch (error) {
            console.error('Error al registrar el service worker', error)
        }

    } else {
        console.error('serviceWorker no está disponible en navigator')
    }
}

async function start() {    
    try {
        await obtenerTodosLosProductos()
        registrarServiceWorker()
        renderLista()
        configurarListeners()
    } catch (error) {
        console.error(error)
    }
}

// ! DOMContentLoaded <--- Me asegura que todo el DOM este cargado antes de ejecutar una acción
document.addEventListener('DOMContentLoaded', start)