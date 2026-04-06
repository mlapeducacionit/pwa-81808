const listaProductos = 'lista'
function guardarListaProductos(lista) { // lista = []
    const prods = JSON.stringify(lista)
    window.localStorage.setItem(listaProductos, prods)
}

function leerListaProductos() {
    let lista = []
    let prods = window.localStorage.getItem(listaProductos)

    if (prods) {
        try {
            lista = JSON.parse(prods)
        } catch (error) {
            lista = []
            guardarListaProductos(lista)
        }
    }

    return lista

}

export {
    guardarListaProductos,
    leerListaProductos
}