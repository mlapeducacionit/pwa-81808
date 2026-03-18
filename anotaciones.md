# Empezando con un proyecto Javascript Vanilla (Vite)

> Interactiva

```sh
npm create vite@latest ./
``` 

> Rápida

```sh
npm create vite@latest ./ -- --template vanilla
``` 

# Progresive Web App (PWA)
Es una aplicación web que combina la accesibilidad de los sitios web con las funciones de una aplicación nativa.

* Funcionamiento sin conexión internet
* Notificación push
* Instalación en patalla de inicio, sin pasar por las tiendas de aplicaciones.

## CheatSheet Tailwind

<https://nerdcave.com/tailwind-cheat-sheet>
<https://tailwindcss.com/docs/installation/using-vite>

## Para seguir trabajando con un proyecto VITE

### 1. Instalar las dependencias (package.json)
Es importante tener en el directorio que estoy el archivo package.json


```sh
npm install
```

### 2. Arranco el servidor de desarrollo

```sh
npm run dev
```

# Trabajo de backend (REST API)

## CRUD

## Protocolo HTTP

* C:Create -> Método POST (Guardando/Creando un producto)

    * Una petición verbo POST -> http://localhost:8080/productos/
    * Producto (body -> cuerpo de la petición)

* R:Read -> Método GET (Obteniendo/leyendo uno o varios productos)

    * Todos los productos -> Una petición verbo GET -> http://localhost:8080/productos/
    * Un producto -> Una petición verbo GET -> http://localhost:8080/productos/id

* U:Update -> Método PUT (Editando/actualizando un producto)

    * Una petición verbo PUT -> http://localhost:8080/productos/id
    * Producto editado (body -> cuerpo de la petición)

* D:Delete -> Método DELETE (Borrando/eliminando un producto)

    * Producto que quiero eliminar -> Una petición verbo DELETE -> http://localhost:8080/productos/id

## Desarrollo local -> json-server

<https://www.npmjs.com/package/json-server>

1. Instalar

```sh
npm i json-server -D
```

2. Crear el archivo db.json dentro de la carpeta 'data'

```json
{
    "productos": [
        { "id": "1", "nombre": "Carne", "cantidad": 2, "precio": 42.34 }, 
        { "id": "2", "nombre": "Leche", "cantidad": 4, "precio": 22.34 }, 
        { "id": "3", "nombre": "Pan", "cantidad": 5, "precio": 12.34 }, 
        { "id": "4", "nombre": "Fideos", "cantidad": 3, "precio": 2.34 }
    ]
}
```

3. Agregar al package.json el script

```json

```

4. Levantar el servidor backend

```sh
npm run server
```

## Desarrollo nube -> mockapi

# Variables de entorno en VITE

<https://vite.dev/guide/env-and-mode>

# Extensión para visualizar los json de una mejor manera

<https://chromewebstore.google.com/detail/json-viewer-pro/eifflpmocdbdmepbjaopkkhbfmdgijcc>

# Service Worker
En los proyecto donde no se utilice VITE el archivo del service worker va en la raíz del proyecto. En un proyecto tipo Vite el service worker se coloca dentro del directorio /public

# manifest.json
Para decirle al navegador como tiene que tratar tu app. Sin el manifest la app en realidad es simplemente una página web

## Generador de manifest

<https://app-manifest.firebaseapp.com/>
<https://progressier.com/pwa-manifest-generator>

## Keys (Claves) manifest

* **theme_color**: Define el color principal. Barra del superior del navegador. Barra Android. Color del marco cuando la appa esta abierta.

* **background_color**: Color de fondo antes de que cargue la aplicación. Splash Screen. Pantalla inicial dal abrir PWA.


* **icons**: Define los iconos de la app.
    * Maskable -> El ícono se adapta a cualquier forma (Cículo, spquirkle). En Android evita recortes malos.
    * any -> Ícono normal, sin adaptación. Se usa donde no hay mascaras.

* **orientation**: Controla como puede rotar la app.
    * any -> Rota libreremente.
    * portratit
    * landscape

* **display**: Esta propiedad define si tu app parece una app o una web.
    * browser -> web común
    * standone -> modo app real
    * fullscren -> pantalla completa
    * minimal-ui -> medio camino entre (browser y standalone)

* **dir**: Dirección del texto
    * ltr -> izquierda a derecha
    * rtl -> derecha a izquierda
    * auto -> el navegador decide

* **lang**: Idioma principal de la app

<https://web.dev/articles/add-manifest?hl=es-419>

* **name**: Nombre completo de la app

* **short_name**: Nombre corto de la app