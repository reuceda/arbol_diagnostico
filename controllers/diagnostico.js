
const url = "http://localhost:8080/api/arbol_desicion/";

init();

function init() {
    cargarpreguntas();
    document.getElementById('evaluar').addEventListener('click', function () {
        document.getElementById('boton-si').style.display = 'inline-block';
        document.getElementById('boton-no').style.display = 'inline-block';
        document.getElementById('evaluar').style.display = 'none';

        mostrarPregunta()
    });
}

const arbolb = new ArbolBinario();

let sii; //bandera para saber si viene de un si o de un no, se necesita para cuando se va crear una pregunta nueva o un diagnostico

async function cargarpreguntas() {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (response.ok) {
            // Crear los nodos a partir de los datos recibidos
            const nodos = data.map(item => new Nodo(item));

            // Insertar los nodos en el árbol
            nodos.forEach(nodo => arbolb.ingresarNodo(nodo));

            console.log('Árbol cargado:', arbolb);  // Verifica si el árbol se ha cargado correctamente

        } else {
            alert('Error al cargar los nodos: ' + error);
        }
    } catch (error) {
        console.error('Error al cargar los nodos try:', error);
        alert('Hubo un error' + error);
    }
}

function mostrarPregunta() {
    if (arbolb.nodoActual !== null) {

        let pregunta = arbolb.nodoActual.pregunta;

        if (!arbolb.nodoActual.esdiagnostico) {
            console.log(arbolb.pregunta);
            document.getElementById("pregunta-actual").textContent = pregunta;

        } else {
            document.getElementById("resultado").textContent = `El diagnóstico es: ${pregunta}`;
            document.getElementById('resultado-area').style.display = 'inline-block';
            document.getElementById("pregunta-actual").textContent = 'Es correcto el diagnóstico?';
        }

    } else {
        const modal = new bootstrap.Modal(document.getElementById('modalCrearPregunta'));
        modal.show();
    }
}

// este es el si del modal de pregunta
document.getElementById("boton-si").addEventListener("click", function () {
    sii = true;
    if (arbolb.irDerecha()) {
        mostrarPregunta();  // Mostrar la siguiente pregunta
    } else {
        if (arbolb.nodoActual.esdiagnostico) {
            if (document.getElementById("pregunta-actual").textContent == 'Desea cambiar el diagnóstico?') {
                const modal = new bootstrap.Modal(document.getElementById('modalCrearDiagnostico'));
                modal.show();
            } else {
                alert("Gracias");
            }
        }

        if (document.getElementById("pregunta-actual").textContent == 'Desea emitir un diagnóstico?') {
            const modal = new bootstrap.Modal(document.getElementById('modalCrearDiagnostico'));
            modal.show();
        } else {
            document.getElementById("pregunta-actual").textContent = 'Desea emitir un diagnóstico?';
        }

    }
});

// este es el no del modal de pregunta
document.getElementById("boton-no").addEventListener("click", function () {
    sii = false;
    if (arbolb.irIzquierda()) {
        mostrarPregunta();  // Mostrar la siguiente pregunta
    } else {
        if (document.getElementById("pregunta-actual").textContent == 'Es correcto el diagnóstico?') {
            document.getElementById("pregunta-actual").textContent = 'Desea cambiar el diagnóstico?';
        } else {
            const modal = new bootstrap.Modal(document.getElementById('modalCrearPregunta'));
            modal.show();
        }
    }
});

//crear el diagnostivo en la base de datos
document.getElementById("creardiagnostico").addEventListener("click", async function () {

    try {
        if (document.getElementById("pregunta-actual").textContent == 'Desea cambiar el diagnóstico?') {
            alert('crear diagnóstico');
            const response = await fetch(`${url}${arbolb.nodoActual.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pregunta: document.getElementById("diagnostico").value,
                }),
            });
            alert(`${url}${arbolb.nodoActual.id}`);
            //const data = await response.json();
            if (response.ok) {
                alert('El diagnóstico se ha modificado.')
                return;
            } else {
                alert('Error al modificar el diagnóstico.');
            }
        } else {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    parent_id: arbolb.nodoActual ? arbolb.nodoActual.id : null,
                    pregunta: document.getElementById("diagnostico").value,
                    si: sii,
                    esdiagnostico: true,
                }),
            });

            //const data = await response.json();
            if (response.ok) {
                alert('El diagnóstico se ha creado.')
                const modal = new bootstrap.Modal(document.getElementById('modalCrearDiagnostico'));
                modal.hide();
            } else {
                alert('Error al guardar la pregunta nueva.');
            }
        }

    } catch (error) {
        console.error('Error al cargar los nodos:', error);
        alert('Hubo un error: ' + error);
    }

});

//crear pregunta nueva
document.getElementById("crearpregunta").addEventListener("click", async function () {

    //esto para saber si estamos eliminando el diagnostico para poner mas preguntas
    if (document.getElementById("pregunta-actual").textContent == 'Desea cambiar el diagnóstico?') {

        try {
            const response = await fetch(`${url}${arbolb.nodoActual.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pregunta: document.getElementById("nuevapregunta").value,
                    esdiagnostico: false
                }),
            });

            //const data = await response.json();
            if (response.ok) {
                console.log('El diagnóstico se ha eliminado.')
                const modal = new bootstrap.Modal(document.getElementById('modalCrearPregunta'));
                modal.hide();
                return;
            } else {
                alert('Error al modificar el diagnóstico.');
            }
            parentid = arbolb.nodoActual.parent_id
        } catch (e) {
            console.error('Error al cargar los nodos:', error);
            alert('Hubo un error');
        }
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parent_id: arbolb.nodoActual ? arbolb.nodoActual.id : null,
                pregunta: document.getElementById("nuevapregunta").value,
                si: sii,
                esDiagnostico: false,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('La pregunta se ha creado.')
        } else {
            alert('Error al guardar la pregunta nueva.');
        }
    } catch (error) {
        console.error('Error al cargar los nodos:', error);
        alert('Hubo un error');
    }

});
