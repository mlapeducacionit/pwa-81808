
const CACHE_STATIC_NAME = 'static-v04'
const CACHE_INMUTABLE_NAME = 'inmutable-v04'
const CACHE_DYNAMIC_NAME = 'dynamic-v04'

self.addEventListener('install', (e) => {
    console.log('install') 
    //self.skipWaiting() // Agresiva
    // Es la fase de instalación del service worker. Se ejecuta una sola vez por versión.
    // * Preparar el entorno
    // * Abrir caches
    // * Precargar archivos críticos ( app shell )
    // * Validar que todo este OK antes activarse

    const cacheStatic = caches.open(CACHE_STATIC_NAME).then(cache => {
        console.log(cache)

        return cache.addAll(
            [
                '/index.html',
                '/icon512_maskable.png',
                '/icon512_rounded.png',
                '/screenshot-wide.jpg',
                '/screenshot.jpg'
            ]
        )
    })

    const cacheInmutable = caches.open(CACHE_INMUTABLE_NAME).then( cache => {
        console.log(cache)

        return cache.addAll(
            [
                'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
            ]
        )
    })

    // Es un función que espera a que todas las operaciones asincronicas culminen
    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) )
    
}) 
// Entre el install y activate -> waiting -> Lo que hace en esta etapa es cuando no quede nadie usando el viejo SW. activamos el nuevo.
self.addEventListener('activate', (e) => {
    console.log('activate')
    //self.clients.claim() // Algunas veces por más que que el service service worker se haya activado, no tiene el control de todas las pestaña.

    // Fase donde el SW toma control
    // * Limpiar caches viejos
    // * Migrar datos
    // * Reclamar a clientes (páginas abiertas)

    const cachesWhiteList = [
        CACHE_STATIC_NAME,
        CACHE_INMUTABLE_NAME,
        CACHE_STATIC_NAME
    ]

    console.log(cachesWhiteList)

    // Borrar todas las caches que no estén en la lista actual (versión actual)

    e.waitUntil(
        caches.keys().then(key => {
            console.log(key)
            return Promise.all(
                key.map ( key => {
                    if ( !cachesWhiteList.includes(key) ) {
                        return caches.delete(key)
                    }
                })
            )
        })
    )


})
// A partir del activate -> el fetch empieza interceptar y el push funciona. O sea que la cache y la red pasan por el service worker
self.addEventListener('fetch', (e) => {
    console.log('fetch')

    // En esta fase se interceptan todos los requests (peticiones) de la página controlar
    // * Cache first o Network-first
    // * Offline support
    // * Reescritura de requests

    //console.log(e)
    const { url, method } = e.request
    //console.log(url, method)

    const respuesta = caches.match(e.request).then(res => {

        if ( res ) {
            console.log('EXISTE: el recurso existe en la cache', url)
            return res
        } 
        console.warn('NO EXISTE: el recurso no existe en el cache', url)

        return fetch(e.request).then( nuevaRespuesta => {
            if ( method !== 'DELETE' && method !== 'PUT' ) {
                caches.open(CACHE_DYNAMIC_NAME).then( cache => {
                    cache.put(e.request, nuevaRespuesta)
                })
            }
            return nuevaRespuesta.clone()
        })

    })

    e.respondWith(respuesta)

})

self.addEventListener('push', (e) => {
    console.log('push')

    // En esta fase cuando se reciba una notificación push (incluso con la app cerrada)
    // O sea nos confirma que el SW funciona en segundo plano
    // * Mostrar notificaciones
    // * Actualizar datos en background

    const data = e.data.text()

    const title = 'Super lista'
    const options = {
        body: `Mensaje: ${data}`
    }

    e.waitUntil(self.registration.showNotification(title, options))
})