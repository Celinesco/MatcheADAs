
const mainContainer = document.querySelector('.main-container');
const width = 8;
let cuadrados = []
const arrayDeEmojis = ["🐢", "🐙", "🦓", "🐘", "🐅", "🐋"]


let swapArrayElements = function (arr, x1, y1, x2, y2) {
  let temp = arr[x1][y1];
  arr[x1][y1] = arr[x2][y2];
  arr[x2][y2] = temp;
};



Array.prototype.swap = function(a,b) {
  swapCSS (this,a,b)
}



Array.prototype.swap = function (x1, y1, x2, y2) {
  swapArrayElements(this, x1, y1, x2, y2);
};






const generadorDeGrilla = (rows, columns, array) => {
  let grilla = [];
  for (let i = 0; i < rows; i++) {
    let subArray = [];
    for (let j = 0; j < columns; j++) {
      subArray.push(array[Math.trunc(Math.random() * array.length)])
    }
    grilla.push(subArray)
  }
  return grilla
}

let ijRepetidosFilas = []
let ijRepetidosColumnas = []

let matchesEnColumnas = (matriz) => {
  for (let j = 0; j < matriz[0].length; j++) {
    for (let i = 0; i < matriz.length - 2; i++) {
      if (matriz[i][j] === matriz[i + 1][j] && matriz[i][j] === matriz[i + 2][j] && matriz[i][j] != '') {
        if (ijRepetidosColumnas.length == 2) {
          ijRepetidosColumnas = []
        }
        ijRepetidosColumnas.push(i)
        ijRepetidosColumnas.push(j)
        return true
      }
    }
  }
  return false
}


let matchesEnFila = (matriz) => {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length - 2; j++) {
      if (matriz[i][j] === matriz[i][j + 1] && matriz[i][j] === matriz[i][j + 2]) {
        if (ijRepetidosFilas.length == 2) {
          ijRepetidosFilas = []
        }
        ijRepetidosFilas.push(i)
        ijRepetidosFilas.push(j)
        return true
      }
    }
  }
  return false
}


let grillaSinMatches = (cantidad) => {
  let grilla = generadorDeGrilla(cantidad, cantidad, arrayDeEmojis);
  while (matchesEnFila(grilla) || matchesEnColumnas(grilla)) {
    grilla = generadorDeGrilla(cantidad, cantidad, arrayDeEmojis);
  }
  return grilla
}


grilla = grillaSinMatches(8)

grillaEnUnSoloArray = []


let convertirEnUnSoloArray = () => {
  grilla.forEach((subarray) => {
    subarray.forEach((item) => {
      grillaEnUnSoloArray.push(item)
    })
  })

}



//  volverALaGrilla = () => {
//   let grillaTodaJunta = [];
//   for (let i = 0; i < 8; i++) {
//     let subArray = [];
//     for (let j = 0; j < 63; j++) {
//       subArray.push(grillaEnUnSoloArray[j])
//     }
//     grillaTodaJunta.push(subArray)
//   }
//   return grillaTodaJunta
//  }


let volverALaGrilla = () => {
  let arraySeparado = []
  let subArray = []

  for (let i = 0; i < 64; i++) {
    subArray.push(grillaEnUnSoloArray[i])
    if (subArray.length == 8) {
      arraySeparado.push(subArray)
      subArray = [];
    }
  }
  return arraySeparado
}

let actualizarListaEmojis = () => {
  const listaEmoji = document.querySelectorAll('.lista-emoji')
  return listaEmoji
}

let crearGrillaEnHTML = (array) => {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < width; j++) {
      const cuadrado = document.createElement('div');
      cuadrado.setAttribute('class', 'lista-emoji');
      // cuadrado.setAttribute('draggable', true)
      // cuadrado.setAttribute('id', i*width+j)
      cuadrado.setAttribute('data-x', i)
      cuadrado.setAttribute('data-y', j)
      cuadrado.setAttribute("id",i*width+j)
      cuadrado.style.position = "relative";
      cuadrado.style.top = `${i}px`
      cuadrado.style.left = `${j}px`;
      cuadrado.textContent = array[i][j];
      cuadrado.style.cursor = "pointer";
      mainContainer.appendChild(cuadrado);
      cuadrados.push(cuadrado);
    }
  }
}


crearGrillaEnHTML(grilla)

// Variable hoisting



//  let posicionVertical = e.target.style.top


let arrayPosiciones = []
let arrayIDs = []


let emojisOnClick = () => {

  let listaEmoji = actualizarListaEmojis()
  listaEmoji.forEach((emoji) => {
    emoji.onclick = (e) => {
      let x = emoji.dataset.x;
      let y = emoji.dataset.y;
      let id = e.target.getAttribute("id")
      console.log(emoji)
   
      if (arrayPosiciones.length == 4) {
        arrayPosiciones = []
      }

      if (arrayIDs.length == 2) {
        arrayIDs = []
      }

      arrayIDs.push(id)
      arrayPosiciones.push(x)
      arrayPosiciones.push(y)
      console.log(arrayIDs)
      dosElementosCliqueados()
    }
    
  })
}




const dosElementosCliqueados = () => {
  if (arrayPosiciones.length == 4 && arrayIDs.length == 2) {
    let x1 = arrayPosiciones[0];
    let y1 = arrayPosiciones[1];
    let x2 = arrayPosiciones[2];
    let y2 = arrayPosiciones[3];

    
    const cambiarPosicionCSS = () => {
      let primerClick = document.getElementById(arrayIDs[0])
      let segundoClick = document.getElementById(arrayIDs[1])
      console.log(primerClick)
      console.log(segundoClick)
      primerClick.style.top = `${x2}px`;
      primerClick.style.left = `${y2}px`;
      segundoClick.style.top = `${x1}px`;
      segundoClick.style.left = `${y1}px`;
    }
    


    if (movimientoPermitido()) {
      
      swapArrayElements(grilla, x1, y1, x2, y2)
      cambiarPosicionCSS()


      if(verificarSiHayMatches(grilla)) {
        hayMatches(grilla)
      }
      else {
        swapArrayElements(grilla, x1, y1, x2, y2)
      }
      mainContainer.innerHTML = ""
      crearGrillaEnHTML(grilla)
      emojisOnClick()

    }
    else {
      console.log('movimiento no permitido')
    }
  }
}



const verificarSiHayMatches = (matriz) => {
  if (matchesEnColumnas(matriz) || matchesEnFila(matriz)) {
    return true
  }
  else false
}


const hayMatches = (array) => {
  while (matchesEnFila(array)) {
    let i = ijRepetidosFilas[0]
    let j = ijRepetidosFilas[1]

    array[i][j] = ''
    array[i][j + 1] = ''
    array[i][j + 2] = ''

    rellenarCasillasVacias()

  }

  while (matchesEnColumnas(array)) {
    let i = ijRepetidosColumnas[0]
    let j = ijRepetidosColumnas[1]
    array[i][j] = ''
    array[i + 1][j] = ''
    array[i + 2][j] = ''

    rellenarCasillasVacias()
  }
}



let rellenarCasillasVacias = () => {
  for (let j = 0; j < 8; j++) {
    for (let vueltas = 0; vueltas < 8; vueltas++) {
      for (let i = 7; i >= 0; i--) {
        if (grilla[i][j] == '') {
          if (grilla[0][j] == '') {
            grilla[0][j] = arrayDeEmojis[Math.trunc(Math.random() * arrayDeEmojis.length)]
          }
          else {
            swapArrayElements(grilla, i, j, i - 1, j)
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




emojisOnClick()



  //va a recibir dos elementos, y tiene que intercambiar sus top y left. 






