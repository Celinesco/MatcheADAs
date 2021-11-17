
const mainContainer = document.querySelector('.main-container');
const width = 8;
let cuadrados = []
const arrayDeEmojis = ["🐢","🐙","🦓","🐘","🐅","🐋"]


var swapArrayElements = function(arr, x1, y1, x2, y2) {
  var temp = arr[x1][y1];
  arr[x1][y1] = arr[x2][y2];
  arr[x2][y2] = temp;
};



Array.prototype.swap = function(x1,y1, x2,y2) {
  swapArrayElements(this, x1,y1,x2,y2);
};




const generadorDeGrilla = (rows,columns,array) => {
    let grilla = [];
    for (let i = 0; i < rows; i++) {
      let subArray = [];
      for (let j = 0; j < columns; j++) {
        subArray.push(array[Math.trunc(Math.random()*array.length)])
      }
      grilla.push(subArray)
    }
    return grilla
}



let matchesEnColumnas = (matriz) => {
    for (let j = 0; j < matriz[0].length; j++) {
      for (let i = 0; i < matriz.length-2; i++) {
        if (matriz[i][j] === matriz[i+1][j] && matriz[i][j] === matriz[i+2][j]) {
        return true
        }
      }
    }
    return false
  }
  
  
  let matchesEnFila = (matriz) => {
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length-2; j++) {
        if (matriz[i][j] === matriz[i][j+1] && matriz[i][j] === matriz[i][j+2]) {
          return true
        }
      }
    }
    return false
  }


let grillaSinMatches = (cantidad) => {
    let grilla = generadorDeGrilla(cantidad,cantidad,arrayDeEmojis);
    while (matchesEnFila(grilla) || matchesEnColumnas(grilla)) {
      grilla = generadorDeGrilla(cantidad,cantidad,arrayDeEmojis);
    }
    return grilla
  }
  
  
  grilla = grillaSinMatches(8)

  grillaEnUnSoloArray = []


  let convertirEnUnSoloArray = () => {
    grilla.forEach((subarray)=> {
      subarray.forEach((item)=> {
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
        cuadrado.setAttribute('fila', i)
        cuadrado.setAttribute('columna', j)
        cuadrado.textContent = array[i][j]
        cuadrado.style.cursor = "pointer"
        mainContainer.appendChild(cuadrado)
        cuadrados.push(cuadrado)
      }  
  }
 
 }


crearGrillaEnHTML(grilla)

// Variable hoisting



let arrayPosiciones = []



let emojisOnClick = () => {

  let listaEmoji = actualizarListaEmojis()
  listaEmoji.forEach((emoji) => {
    emoji.onclick = (e) => {
      
      let x = e.target.getAttribute('fila')
      let y = e.target.getAttribute('columna')

      if (arrayPosiciones.length == 4) {
        arrayPosiciones = []
      }
      arrayPosiciones.push(x)
      arrayPosiciones.push(y)

    dosElementosCliqueados()
    

    }

  })
}


  const dosElementosCliqueados = () => {
    if (arrayPosiciones.length == 4) {
      let x1 = arrayPosiciones[0]
      let y1 = arrayPosiciones[1]
      let x2 = arrayPosiciones[2]
      let y2 = arrayPosiciones[3]

      if (movimientoPermitido()) {
        swapArrayElements(grilla, x1, y1, x2, y2)
        mainContainer.innerHTML = " "
        crearGrillaEnHTML(grilla)
        emojisOnClick()
      }
      else {
       //aca en algún momento habrá que indicarles que vuelvan a su posición original 
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