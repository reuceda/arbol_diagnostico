// Definición de la clase Nodo
class Nodo {
    constructor(valor) {
        this.id = valor.id;
        this.parent_id = valor.parent_id;
        this.pregunta = valor.pregunta;
        this.si = valor.si;
        this.esdiagnostico = valor.esdiagnostico;
        this.izquierdo = null;
        this.derecho = null;
    }
}

// Definición de la clase Árbol Binario
class ArbolBinario {
    constructor() {
        this.raiz = null;
        this.nodoActual = null;
    }

    // Método para ingresar un nodo
    ingresarNodo(valor) {
        const nuevoNodo = new Nodo(valor);
        if (this.raiz === null) {
            this.raiz = nuevoNodo;
            this.nodoActual = nuevoNodo;
        } else {
            let nodos = this.inOrden();

            let nodoPadre;

            for (let i = 0; i < nodos.length; i++) {
                console.log(nodos[i].pregunta + " " + valor.parent_id);

                if (valor.parent_id !== null && nodos[i].id === valor.parent_id) {
                    nodoPadre = nodos[i];
                    break;

                }
            }

            this.#insertarRecursivo(nodoPadre ? nodoPadre : this.raiz, nuevoNodo);
        }
    }

    // Función para navegar a la izquierda
    irIzquierda() {
        if (this.nodoActual.izquierdo !== null) {
            this.nodoActual = this.nodoActual.izquierdo;
            return true; // Indicamos que se pudo mover a la izquierda
        }
        return false; // No hay hijo izquierdo
    }

    // Función para navegar a la derecha
    irDerecha() {
        if (this.nodoActual.derecho !== null) {
            this.nodoActual = this.nodoActual.derecho;
            return true; // Indicamos que se pudo mover a la derecha
        }
        return false; // No hay hijo derecho
    }

    #insertarRecursivo(nodoActual, nuevoNodo) {

        if (nuevoNodo.si == 0) {
            if (nodoActual.izquierdo === null) {
                nodoActual.izquierdo = nuevoNodo;
            } else {
                this.#insertarRecursivo(nodoActual.izquierdo, nuevoNodo);
            }
        } else {
            if (nodoActual.derecho === null) {
                nodoActual.derecho = nuevoNodo;
            } else {
                this.#insertarRecursivo(nodoActual.derecho, nuevoNodo);
            }
        }
    }

    // Recorridos
    preOrden() {
        const resultado = [];
        this.#preOrdenRecursivo(this.raiz, resultado);
        return resultado;
    }

    #preOrdenRecursivo(nodo, resultado) {
        if (nodo !== null) {
            resultado.push(nodo);
            this.#preOrdenRecursivo(nodo.izquierdo, resultado);
            this.#preOrdenRecursivo(nodo.derecho, resultado);
        }
    }

    inOrden() {
        const resultado = [];

        this.#inOrdenRecursivo(this.raiz, resultado);
        return resultado;
    }

    #inOrdenRecursivo(nodo, resultado) {
        if (nodo !== null) {
            this.#inOrdenRecursivo(nodo.izquierdo, resultado);
            resultado.push(nodo);
            this.#inOrdenRecursivo(nodo.derecho, resultado);
        }
    }

    postOrden() {
        const resultado = [];
        this.#postOrdenRecursivo(this.raiz, resultado);
        return resultado;
    }

    #postOrdenRecursivo(nodo, resultado) {
        if (nodo !== null) {
            this.#postOrdenRecursivo(nodo.izquierdo, resultado);
            this.#postOrdenRecursivo(nodo.derecho, resultado);
            resultado.push(nodo.valor);
        }
    }

    // Altura del árbol
    altura() {
        return this.#alturaRecursiva(this.raiz);
    }

    #alturaRecursiva(nodo) {
        if (nodo === null) return 0;
        const alturaIzquierda = this.#alturaRecursiva(nodo.izquierdo);
        const alturaDerecha = this.#alturaRecursiva(nodo.derecho);
        return Math.max(alturaIzquierda, alturaDerecha) + 1;
    }

    // Hijos de un nodo
    obtenerHijos(valor) {
        const nodo = this.#buscarNodo(this.raiz, valor);
        if (nodo) {
            return {
                izquierdo: nodo.izquierdo ? nodo.izquierdo.valor : null,
                derecho: nodo.derecho ? nodo.derecho.valor : null
            };
        } else {
            return null;
        }
    }

    #buscarNodo(nodoActual, valor) {
        if (nodoActual === null) return null;
        if (nodoActual.valor === valor) return nodoActual;
        return valor < nodoActual.valor
            ? this.#buscarNodo(nodoActual.izquierdo, valor)
            : this.#buscarNodo(nodoActual.derecho, valor);
    }
}