const puntajeDom = document.querySelector(".puntaje");
const contenedorGrilla = document.querySelector('.contenedor-grilla');
const contenedorModalTiempo = document.getElementById("contenedor-modal-tiempo")
const modalTiempo = document.getElementById("modal-tiempo");
const cerrarModalGameOver = document.getElementById("cerrar-modal-game-over");
const temporizador = document.getElementById("temporizador");
const botonEmpezar = document.getElementById("start");
const segundosHTML = document.getElementById("segundosHTML");
const minutosHTML = document.getElementById("minutosHTML");
const recordHTML = document.getElementById("record");



const width = 8;
const arrayDeEmojis = ["🪲", "🐞", "🪱", "🐜", "🦁", "🐝"];
let ijRepetidosFilas = [];
let ijRepetidosColumnas = [];
let arrayPosiciones = [];
let arrayIDs = [];
let clickHabilitado = true;
let puntaje = 0;
let puntajeAnterior = 0;


let intercambiarPosicionElementosEnMatriz = function (arr, x1, y1, x2, y2) {
  let temp = arr[x1][y1];
  arr[x1][y1] = arr[x2][y2];
  arr[x2][y2] = temp;
};


Array.prototype.swapMatriz = function (x1, y1, x2, y2) {
  intercambiarPosicionElementosEnMatriz(this, x1, y1, x2, y2);
};

const convertirAJSON = (array) => {
  let arrayConvertido = JSON.stringify(array);
  return arrayConvertido
}

const guardarEnLocalStorage = (array, clave) => {
  localStorage.setItem(clave, convertirAJSON(array))
}

const convertirDesdeJSON = (arrayJSON) => {
  let JSONConvertido = JSON.parse(arrayJSON)
  return JSONConvertido
}

const leerDesdeLocalStorage = (clave) => {
  const json = localStorage.getItem(clave);
  const array = convertirDesdeJSON(json);
  return array
}


let recordAlmacenado = leerDesdeLocalStorage ('record_usuario');



if (recordAlmacenado !== null) {
  recordHTML.textContent = recordAlmacenado
 
}



const obtenerEmojiRandom = () => {
  let emojiRandom = arrayDeEmojis[Math.trunc(Math.random() * arrayDeEmojis.length)]
  return emojiRandom
}

const generadorDeGrilla = (rows, columns) => {
  let grilla = [];
  for (let i = 0; i < rows; i++) {
    let subArray = [];
    for (let j = 0; j < columns; j++) {
      subArray.push(obtenerEmojiRandom())
    }
    grilla.push(subArray)
  }
  return grilla
}


const grillaVacia = () => {
  let grilla = [];
  for (let i = 0; i < width; i++) {
    let subArray = [];
    for (let j = 0; j < width; j++) {
      subArray.push(0)
    }
    grilla.push(subArray)
  }
  return grilla
}

let elementosABorrar = grillaVacia()


const matchesEnColumnas = (matriz) => {
  for (let j = 0; j < matriz[0].length; j++) {
    for (let i = 0; i < matriz.length - 2; i++) {
      if (matriz[i][j] === matriz[i + 1][j] && matriz[i][j] === matriz[i + 2][j]) {
        return true
      }
    }
  }
  return false
}

const matchesEnFila = (matriz) => {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length - 2; j++) {
      if (matriz[i][j] === matriz[i][j + 1] && matriz[i][j] === matriz[i][j + 2]) {
        return true
      }
    }
  }
  return false
}


const identificarTriosEnFilas = (matriz) => {
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length - 2; j++) {
        if (matriz[i][j] === matriz[i][j + 1] && matriz[i][j] === matriz[i][j + 2]) {
          elementosABorrar[i][j] = 1
          elementosABorrar[i][j+1] = 1
          elementosABorrar[i][j+2] = 1
        }
      }
    }
}

const identificarTriosEnColumnas = (matriz) => {
  for (let j = 0; j < matriz[0].length; j++) {
    for (let i = 0; i < matriz.length - 2; i++) {
      if (matriz[i][j] === matriz[i + 1][j] && matriz[i][j] === matriz[i + 2][j]) {
        elementosABorrar[i][j] = 1
        elementosABorrar[i+1][j] = 1
        elementosABorrar[i+2][j] = 1
      }
    }
  }
}


const grillaSinMatches = (cantidad) => {
  let grilla = generadorDeGrilla(cantidad, cantidad, arrayDeEmojis);
  while (matchesEnFila(grilla) || matchesEnColumnas(grilla)) {
    grilla = generadorDeGrilla(cantidad, cantidad, arrayDeEmojis);
  }
  return grilla
}


grilla = grillaSinMatches(8)


const actualizarListaEmojis = () => {
  let listaEmoji = document.querySelectorAll('.lista-emoji')
  return listaEmoji
}

const crearGrillaEnHTML = (array) => {
  
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      const cuadrado = document.createElement('div');
      cuadrado.setAttribute('class', 'lista-emoji');
      cuadrado.setAttribute('data-x', i)
      cuadrado.setAttribute('data-y', j)
      cuadrado.setAttribute("id",i*width+j)
      cuadrado.style.position = "absolute";
      cuadrado.style.top = `${i * 70}px`
      cuadrado.style.left = `${j * 70}px`;
      cuadrado.style.cursor = "pointer";
      cuadrado.textContent = array[i][j];
      contenedorGrilla.appendChild(cuadrado);
    }
  }
}




// Variable hoisting

const emojisOnClick = () => {
  let listaEmoji = actualizarListaEmojis()
  listaEmoji.forEach((emoji) => {
    emoji.onclick = (e) => {
      if (!clickHabilitado) return;
      let x = emoji.dataset.x;
      let y = emoji.dataset.y;
      let id = e.target.getAttribute("id")
   
      if (arrayPosiciones.length == 4) {
        arrayPosiciones = []
      }
      if (arrayIDs.length == 2) {
        arrayIDs = []
      }
      arrayIDs.push(id)
      arrayPosiciones.push(x)
      arrayPosiciones.push(y)
      dosElementosCliqueados()
    }
  })
}

const imprimirGrillaLuegoDeAccion = () => {
  setTimeout (()=> {
    contenedorGrilla.innerHTML = "";
    crearGrillaEnHTML(grilla)
    emojisOnClick()
  },1500)
}


const cambiarPosicionCSS = (ax,ay,bx,by) => {
  let primerClick = document.getElementById(arrayIDs[0])
  let segundoClick = document.getElementById(arrayIDs[1])
  primerClick.style.top = `${bx * 70}px`;
  primerClick.style.left = `${by * 70}px`;
  segundoClick.style.top = `${ax * 70}px`;
  segundoClick.style.left = `${ay * 70}px`;
}



const dosElementosCliqueados = () => {
  if (arrayPosiciones.length == 4 && arrayIDs.length == 2) {
    clickHabilitado = false;
    let x1 = arrayPosiciones[0];
    let y1 = arrayPosiciones[1];
    let x2 = arrayPosiciones[2];
    let y2 = arrayPosiciones[3];
    if (movimientoPermitido()) {
      cambiarPosicionCSS(x1,y1,x2,y2)
      intercambiarPosicionElementosEnMatriz(grilla, x1, y1, x2, y2)
      
      if (!verificarSiHayMatches(grilla)) {
        clickHabilitado = false;

        setTimeout(()=> {
          cambiarPosicionCSS(x2,y2,x1,y1)
        },900)
        intercambiarPosicionElementosEnMatriz(grilla, x1, y1, x2, y2)
      }

      if (verificarSiHayMatches(grilla)) {

        let primerClick = document.getElementById(arrayIDs[0])
        let segundoClick = document.getElementById(arrayIDs[1])
        primerClick.setAttribute("id",arrayIDs[1])
        segundoClick.setAttribute("id",arrayIDs[0])
        vaciarMatches(grilla)
      }

    }
    else {
      clickHabilitado = true;
      console.log('movimiento no permitido')
    }
  }
}


const verificarSiHayMatches = (matriz) => {
  if (matchesEnColumnas(matriz) || matchesEnFila(matriz)) {
    return true
  }
  setTimeout(()=> {
    clickHabilitado = true;
  },1000)
  return false;
}

let hayMatches = (matchesEnColumnas(grilla) || matchesEnFila(grilla))


const desvanecerEmoji = (emoji) => {
  setTimeout(() => {
    emoji.style.transitionProperty = "opacity";
    emoji.style.opacity = "0"
  }, 700)
}



const vaciarMatches = (matriz) => {

    identificarTriosEnFilas(grilla)
    identificarTriosEnColumnas(grilla)
  
    puntajeAnterior = puntaje;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++) {
        if (elementosABorrar[i][j] === 1) {
          puntaje += 1 * 10
          matriz[i][j] = null;
          let emoji1 = document.getElementById(i * width + j)
          desvanecerEmoji(emoji1)
        }
      }
    }
   
    imprimirPuntaje()
    rellenarCasillasVacias()
    elementosABorrar = grillaVacia()
    imprimirGrillaLuegoDeAccion()

    setTimeout (()=> {
      if(verificarSiHayMatches(grilla)) {
        vaciarMatches(grilla)
      }
    },1500)
}



const imprimirPuntaje = () => {
  let puntajeActualSinResto = puntaje - puntaje%100;
  let puntajeAnteriorSinResto = puntajeAnterior - puntajeAnterior%100;

    if( puntajeActualSinResto != puntajeAnteriorSinResto ) {
      puntajeDom.style.color = "green";
      setTimeout (() => {
        puntajeDom.style.color = "white"
      },800)
  
    }

 
  puntajeDom.innerHTML = puntaje
  puntajeDom.style.fontSize = "50px"
  setTimeout (() => {
    puntajeDom.style.fontSize = "40px"
  },800)
}



//estas dos funciones me parece que deberia separarlas para poder poner la animacion

let rellenarCasillasVacias = () => {
  for (let j = 0; j < 8; j++) {
    for (let vueltas = 0; vueltas < 8; vueltas++) {
      for (let i = 7; i >= 0; i--) {
        if (grilla[i][j] === null) {
          if (grilla[0][j] === null) {
            grilla[0][j] = obtenerEmojiRandom()
          }
          else {
            intercambiarPosicionElementosEnMatriz(grilla, i, j, i - 1, j)
          }
        }
      }
    }
  }
}


let movimientoPermitido = () => {
  let x1 = arrayPosiciones[0]
  let y1 = arrayPosiciones[1]
  let x2 = arrayPosiciones[2]
  let y2 = arrayPosiciones[3]

  if (Math.abs(x1 - x2) + Math.abs(y1 - y2) == 1) {
    return true
  }
  else {
    return false
  }
}


cerrarModalGameOver.onclick = () => {
  modalTiempo.classList.add("cerrar-modal")
  setTimeout (()=> {
    contenedorModalTiempo.classList.add("ishidden")
  },700)
  contenedorGrilla.innerHTML = ""
  crearGrillaEnHTML(grilla)
}



const activarTemporizador = () => {
  
  let minutos = 1;
  let segundos = 30;
 
  let tiempo = setInterval(()=> {
   
    if(segundos == 0) {
      minutos -= 1;
      segundos = 60;
    }
    segundos --;
    minutosHTML.textContent = minutos
    if (segundos < 10) {
      segundosHTML.textContent = `0${segundos}`
    }
     else {
      segundosHTML.textContent = segundos
     }
  
    if (minutos == 0  && segundos == 0) {
      clearInterval(tiempo)
      contenedorModalTiempo.classList.remove("ishidden")
      modalTiempo.classList.remove("cerrar-modal")
      guardarPuntajeLocalStorage()
    }
  },1000)
} 


const guardarPuntajeLocalStorage = () => {
  if (leerDesdeLocalStorage("record_usuario") < puntaje) {
    guardarEnLocalStorage(puntaje, "record_usuario")
    recordHTML.textContent = puntaje
  }
}




botonEmpezar.onclick = () => {
  contenedorGrilla.innerHTML = "";
  crearGrillaEnHTML(grilla);
  emojisOnClick();
  activarTemporizador();
  
}
