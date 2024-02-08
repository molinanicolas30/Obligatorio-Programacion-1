/* AUTOR: Nicolás Molina Giudice - 230333 */
window.addEventListener("load", inicio);
function inicio(){
	mostrarSoloUnaSeccion("gestion_Reclamos")
	//mostrarSoloUnaSeccion("restoReclamos")
	document.getElementById("bot1").addEventListener("click", function() { mostrarSoloUnaSeccion("gestion_Reclamos"); }); /* se pone de esta manera
	poque si ponemos solo mostrar al iniciarce ya se ejecuta por si solo haciendo que solo se muestre agregar empresa
	que es la ultima opcion en la funcion mostrar y para arreglar esto hay que usar una funcion anonima y entre {} 
	llamar a la funcion mostrar*/
	document.getElementById("bot2").addEventListener("click", function() { mostrarSoloUnaSeccion("reclamos_ingresados"); });
	document.getElementById("bot3").addEventListener("click", function() { mostrarSoloUnaSeccion("estadística"); });
	document.getElementById("bot4").addEventListener("click", function() { mostrarSoloUnaSeccion("agregar_empresa"); });
	document.getElementById("boton_degrade").addEventListener("click",permitirAbrirBotonReclamo);
	document.getElementById("boton_agregar_empresa").addEventListener("click", botonAgregarEmpresa);
	document.getElementById("boton_agregar_reclamo").addEventListener("click",botonAgregarReclamo);
	document.getElementById("boton_volver").addEventListener("click", function() { mostrarSoloUnaSeccion("gestion_Reclamos"); });
	document.getElementById("creci").addEventListener("click",ordenCreci);
	document.getElementById("decre").addEventListener("click",ordenDecre);
	document.getElementById("botonBuscador").addEventListener("click",mostrarBusqueda);
	
}  

// declaro las variables que traigo de clases
var sistemaDeReclamos = new Sistema();
var ordenCreciente = true;
var letraSeleccionada = "*";
var empresasConreclamos = [];
var empresas = sistemaDeReclamos.listaEmpresa
var reclamos = sistemaDeReclamos.listaReclamos

// oculta todas las secciones y muestra las que se les pase una id y en caso de ser estadistica o reclamos ingredaso se ejectan funciones
function mostrarSoloUnaSeccion(id){
	document.getElementById("gestion_Reclamos").style.display="none";
	document.getElementById("agregar_empresa").style.display="none";
	document.getElementById("estadística").style.display="none";
	document.getElementById("reclamos_ingresados").style.display="none";
	document.getElementById("agregar_Reclamo").style.display="none";
	// muestro el elemento con id
	document.getElementById(id).style.display="block";
	if (id === "reclamos_ingresados"){
		eliminar("reclamos_ingresados");
		h1VerReclamos();
		mostrarReclamos();
	}else{
		if(id === "estadística"){
			eliminarFilas()
			parrafosEstadistica()
			sistemaDeReclamos.empresasOrdenCreciente();
			eliminar("botones")
			agregarBotonConInicialEmpresa()
			botonAsteriscofuncion()
			mostrarRubrosConMaxRecl()
		}else{
			if(id === "gestion_Reclamos"){
				document.getElementById("restoReclamos").style.display="block";
			}
		}
	}
}

// a esta funcion se le proporciona una id de un contenedor y elimina a todos los "hijos"
function eliminar(id){
	let algunContenedor = document.getElementById(id);
	while (algunContenedor.firstChild) {
		algunContenedor.removeChild(algunContenedor.firstChild);
	}
}

// esta funcion lo que hace es eliminar todas las filas de una tabla
function eliminarFilas(){
	let tabla = document.getElementById("filasTablas");
	while (tabla.rows.length > 0) {
		tabla.deleteRow(0);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////// PANTALLA PRINCIPAL ///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//verifica que hayan empresas a las cuales hacer reclamos
function permitirAbrirBotonReclamo(){
	if(empresas.length === 0){
		alert("No hay empresas a la cual hacer reclamos, muchas gracias.");
		
	}else{
		document.getElementById("restoReclamos").style.display="none";
		document.getElementById("agregar_Reclamo").style.display="block";
	}
	agregarEmpresasAcombo()
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////// AGREGAR EMPRESA ///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//agrega el objeto de la empresa y lo agrega a una lista
function agregarEmpresa(nombre, direccion, rubro, cantReclamos) {
	var nuevaEmp = new Empresa(nombre, direccion, rubro, cantReclamos);
	sistemaDeReclamos.agregarEmp(nuevaEmp);
}
// extrae los datos del usuario y crea un objeto con los datos de una empresa
function botonAgregarEmpresa(){
	let nombre = document.getElementById("nombreEmpresa").value.trim();
	let direccion = document.getElementById("direccion").value.trim();
	let rubro = document.getElementById("rubro").value;
	cantReclamos = 0;
	if(nombre[0] === "*"){
		alert("El nombre de la empresa no puede empezar con:  *")
		return;
	}
	if(rubro === ""||nombre === ""||direccion === ""){
		alert("Por favor, completa todos los campos.")
		return;
	}
	if(sistemaDeReclamos.existeEmpresa(nombre)){
		alert("Ya existe una empresa registrada a ese nombre: " + nombre + ".");
		return;
	}
	agregarEmpresa(nombre, direccion, rubro, cantReclamos);
	
	let fNombre = document.getElementById("nombreEmpresa");
	fNombre.value = "";
	let fDireccion =document.getElementById("direccion");
	fDireccion.value = "";
	let rRubro = document.getElementById("rubro");
	rRubro.value = "";
	  // alert("La empresa -"+nombre+"- fue registrada correctamente.");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////// ESTADISTICA ////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// esta funcion genera los botones que al precionarlo muestran todas las empresas que comiences con la letra del boton
function agregarBotonConInicialEmpresa() {
  // elimina todos loe elementos botón de un contenedor
	eliminar("botones");
	let iniciales = sistemaDeReclamos.inicialesEmpresas();
	for(let i=0; i < iniciales.length; i++){
		let letraEmpresa = iniciales[i];
		let botonLetra = document.createElement("button");
		botonLetra.innerHTML = letraEmpresa;
		botonLetra.className = "botonesInicialesEmpresas";
		botonLetra.setAttribute("type", "button");
		botonLetra.onclick = function (){soloEmpConInicial(letraEmpresa);};
		let contenedor = document.getElementById("botones");
		contenedor.appendChild(botonLetra);
	}
	// esta funcione dentro de este if no se ejecuta hasta que halla por lo menos una empresa registrada
	if(empresas.length !== 0){
		botonAsterisco();
	}
}

// esta funcion elimina la tabla y la vuelve a poner pero en orden creciente
function soloEmpConInicial(letraEmpresa){
	eliminar("unicap")
	parrafoInicial(letraEmpresa)
	eliminarFilas()
	let empresasOrdenadas = sistemaDeReclamos.empresasOrdenCreciente();
	let tabla = document.getElementById("filasTablas");
	// Obtener la lista de empresas ordenadas en orden Creciente
	for(let i=0; i < empresasOrdenadas.length; i++){
		if(letraEmpresa === empresas[i].nombre.charAt(0).toUpperCase()){
			let empresa = empresasOrdenadas[i];
			let nombre = empresa.nombre;
			let direccion = empresa.direccion;
			let rubro = empresa.rubro;
			let cantRecl = empresa.cantReclamos;
			
			let fila = tabla.insertRow(); // Crear una fila
			let columna1 = fila.insertCell(); // Crear una columna
			columna1.innerHTML = nombre;
			let columna2 = fila.insertCell();
			columna2.innerHTML = direccion;
			let columna3 = fila.insertCell();
			columna3.innerHTML = rubro;
			let columna4 = fila.insertCell();
			columna4.innerHTML = cantRecl;
		}
	}	
	// esto es para que el boton de orden creciente este siempre en checked cuando se cambia de letra o se pone *
	document.getElementById("creci").checked = true;
    document.getElementById("decre").checked = false;
}
// agrega una tabla con todas las empresas en orden decreciente
function agregarATablaEnOrdDecre(){
	let tabla = document.getElementById("filasTablas");
  while (tabla.rows.length > 0) {
    tabla.deleteRow(0);
  }
  // Obtener la lista de empresas ordenadas en orden decreciente
  let empresasOrdenadas = sistemaDeReclamos.empresasOrdenDecreciente();
  for (let i = 0; i < empresasOrdenadas.length; i++) {
    let empresa = empresasOrdenadas[i];
    let nombre = empresa.nombre;
    let direccion = empresa.direccion;
    let rubro = empresa.rubro;
	let cantRecl = empresa.cantReclamos;

    let fila = tabla.insertRow(); // Crear una fila
    let columna1 = fila.insertCell(); // Crear una columna
    columna1.innerHTML = nombre;
    let columna2 = fila.insertCell();
    columna2.innerHTML = direccion;
    let columna3 = fila.insertCell();
    columna3.innerHTML = rubro;
    let columna4 = fila.insertCell();
	columna4.innerHTML = cantRecl;
  }
}

// crea el boton asterisco que muestra todas las empresas
function botonAsterisco(){
	let asterisco = document.createElement("button");
	asterisco.innerHTML = "*";
	asterisco.className = "botonesInicialesEmpresas";
	asterisco.setAttribute("type", "button");
	asterisco.onclick = function (){ botonAsteriscofuncion();};
	let contenedor = document.getElementById("botones");
	contenedor.appendChild(asterisco);
}
// es la funcion del boton asterisco
function botonAsteriscofuncion(){
	eliminarFilas()
	parrafoTodasLasEmpresas("Todas las empresas que estan Registradas son:")
	let tabla = document.getElementById("filasTablas");
	let empresasOrdenadas = sistemaDeReclamos.empresasOrdenCreciente();
	for(let i=0; i < empresasOrdenadas.length; i++){
		let empresa = empresasOrdenadas[i];
		let nombre = empresa.nombre;
		let direccion = empresa.direccion;
		let rubro = empresa.rubro;
		let cantRecl = empresa.cantReclamos;

		let fila = tabla.insertRow(); // Crear una fila
		let columna1 = fila.insertCell(); // Crear una columna
		columna1.innerHTML = nombre;
		let columna2 = fila.insertCell();
		columna2.innerHTML = direccion;
		let columna3 = fila.insertCell();
		columna3.innerHTML = rubro;
		let columna4 = fila.insertCell();
		columna4.innerHTML = cantRecl;
	}
// esto hace que los radios botones por mas que lo pongas en decreciente y cambies de inicial de letra para buscar otras empresas cambien siempre a creciente sin importan nada
	document.getElementById("creci").checked = true;
    document.getElementById("decre").checked = false;
}

// esta funcion ordena la tabla que este en el momento en orden creciente y esta ligada al radio boton correspondiente
function ordenCreci(){
	let columna = 0
	let bodyTabla = document.getElementById("filasTablas");
	let filas = Array.from(bodyTabla.getElementsByTagName("tr"));
	filas.sort((a, b) => {
		let valorA = a.cells[columna].textContent;
		let valorB = b.cells[columna].textContent;
		return valorA.localeCompare(valorB);	
	});
	filas.forEach((filas) => {
	bodyTabla.appendChild(filas);
	});
}

// esta funcion ordena la tabla que este en el momento en orden decreciente y esta ligada al radio boton correspondiente
function ordenDecre(){
	let columna = 0 // es la columna que a partir de ella quiero ordenar las filas en este caso la 0 que es de nombres
	let bodyTabla = document.getElementById("filasTablas"); // es la id del tbody 
	let filas = Array.from(bodyTabla.getElementsByTagName("tr"));// crea un nuevo array con array.form() pero ordenado de los elementos que esten en la tabla
	filas.sort((a, b) => {
		let valorA = a.cells[columna].textContent;
		let valorB = b.cells[columna].textContent;
		return valorB.localeCompare(valorA);	
	});
	filas.forEach((filas) => { // esto lo que hace el forEach es que por todas las filas le hace un apenchild, como un for mejorado
	bodyTabla.appendChild(filas);
	});
}

// este parrafo es el mismo que el de arriba solo que es para todas las empresas
function parrafoTodasLasEmpresas(string){
	let contendorParrafo = document.getElementById("unicap");
	eliminar("unicap");
	let parrafo =  document.createElement("p"); 
	parrafo.textContent = string;
	parrafo.className="parrafoTitTabla";
	contendorParrafo.appendChild(parrafo);
}

// este parrafo es el de arriba de la tabla que indica que es lo que muestr la tabla
function parrafoInicial(letraEmpresa){
	let contendorParrafo = document.getElementById("unicap");
	eliminar("unicap");
	let parrafo =  document.createElement("p"); 
	parrafo.textContent = "Empresas que empiezan con " + letraEmpresa;
	parrafo.className="parrafoTitTabla";
	contendorParrafo.appendChild(parrafo);
}

// modifica los parrafos de estadistica
function parrafosEstadistica(){
	let promedioReclamos = sistemaDeReclamos.promedio();
	if(empresas.length === 0 ){
		document.getElementById("promedioEmp").innerHTML = "No hay empresas Registradas";
	}else{
	document.getElementById("promedioEmp").innerHTML = "El promedio de reclamos es " + promedioReclamos;
	}
	let cantEmpresas = empresas.length
	document.getElementById("totalEmpRegi").innerHTML = "El total  de empresas registradas es: " + cantEmpresas +".";
	parrafoSinReclamos(empresasConreclamos)
}

// esta funcion crea los o el parrafo que va a contener las empresas sin reclamos
function parrafoSinReclamos(empresasConreclamos){
	eliminar("sinReclamos")
	let pSinReclamos = document.getElementById("sinReclamos");
	let UL = document.getElementById("sinReclamos");
	let cant = 0
	for(let i=0; i < empresas.length; i++){
		if(empresas[i].cantReclamos != 0){
			cant += 1;
		}
	}
	if(empresas.length === 0){
		let pConRecl = document.createElement("li");
		pConRecl.innerHTML = "Sin Datos."
		UL.appendChild(pConRecl)
	}else{
		if(cant === empresas.length && cant !== 0){
			let pConRecl = document.createElement("li");
			pConRecl.innerHTML = "Todas las empresas registradas tienen Reclamos.";
			UL.appendChild(pConRecl);
		}else{
			for(let i=0; i < empresas.length; i++){
			let empresa = empresas[i].nombre;
				if(!empresasConreclamos.includes(empresa)){
					let esaEmpresa = empresas[i].nombre;
					let esaDireccion = empresas[i].direccion;
					let eseRubro = empresas[i].rubro;
					let pConRecl = document.createElement("li");
					pConRecl.innerHTML = esaEmpresa + " (" + esaDireccion  + ") Rubro: " + eseRubro;
					UL.appendChild(pConRecl);
				}
			}
		}
	}
}

//muestra los reclamos con mayor cantidad de reclamos en el DOM
function mostrarRubrosConMaxRecl(){
	sistemaDeReclamos.agregarRubros()
	eliminar("rubroMax");
	let arrayRubrosConMasRecl = sistemaDeReclamos.maxCantReclamos();
	let ulP= document.getElementById("rubroMax");
	
	if(empresas.length === 0){
		let liP = document.createElement("li");
		liP.innerHTML = "Sin Datos";
		ulP.appendChild(liP);
		
	}else{
		if(arrayRubrosConMasRecl[0].cant === 0){
			let liP = document.createElement("li");
			liP.innerHTML = "No hay Reclamos"
			ulP.appendChild(liP);
		}else{
			for(let i=0; i < arrayRubrosConMasRecl.length; i++){
				let liP = document.createElement("li");
				let rubro = arrayRubrosConMasRecl[i].nombre
				let cant = arrayRubrosConMasRecl[i].cant
				liP.innerHTML = rubro + ": cantidad " + cant;
				ulP.appendChild(liP);
			}
		}
		
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////// AGREGAR RECLAMO///////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// crea el titulo de la seccion de ver reclamos
function h1VerReclamos(){
	let seccionReclamos = document.getElementById("reclamos_ingresados");
	let h1Reclamos = document.createElement("h1");
	h1Reclamos.className = "reclamos_ingresados";
	h1Reclamos.innerHTML = "Reclamos ingresados (los más recientes primero)";
	seccionReclamos.appendChild(h1Reclamos);
}

// esto agrega las empresas creadas al combo de agregar reclamo
function agregarEmpresasAcombo(){
	let combo = document.getElementById("empresa");
	while (combo.options.length > 0) {
      combo.remove(0);
    }
	let opcion = document.createElement("option");
		opcion.text = "Seleccione una opcion";
		opcion.value = "";
		combo.appendChild(opcion);
	for(i=0; i < empresas.length; i++){
		let opcion = document.createElement("option");
		opcion.text = empresas[i].nombre;
		opcion.value = empresas[i].nombre;
		combo.appendChild(opcion);
	}
}

// esta funcion extrae lo sdatos que el suario inserta en los formularios para hacer un reclamo a alguna empresa y los extrae
function botonAgregarReclamo(){
	let nombre = document.getElementById("nombreUsu").value.trim();
	let nombreEmp = document.getElementById("empresa").value;
	let tituloReclamo = document.getElementById("titReclamo").value.trim();
	let reclamo = document.getElementById("descripcion_reclamo").value.trim();
	// esto evita que el usuario no complete los formiarios
	if( nombre === "" || reclamo === "" || tituloReclamo === "" || nombreEmp === ""){
		alert("Complete todos los Campos");
		return;
	}
	let empresa = sistemaDeReclamos.obtenerEmpresa(nombreEmp);
	let numero = reclamos.length + 1;
	let cantReclamos = 1;
	empresa.cantReclamos += 1;
	
	// crea el objeto reclamo y lo agrega a la lista de reclamos
	agregarReclamo(nombre, empresa, tituloReclamo, reclamo, numero, cantReclamos);
	//estrae los nombres de las empresas con reclamos para despues compararla con la lista empresas para ver si hay alguna empresa sin reclamos
	empresasConreclamos.push(empresa.nombre);
	let rNombre = document.getElementById("nombreUsu");
	rNombre.value = "";
	let rEmpresa = document.getElementById("empresa");
	rEmpresa.value = "";
	let rTituloReclamo = document.getElementById("titReclamo");
	rTituloReclamo.value = "";
	let rReclamo = document.getElementById("descripcion_reclamo");
	rReclamo.value = "";

}

// agrega los objetos reclamos a la listaReclamos
function agregarReclamo(nombre, empresa, tituloReclamo, reclamo, numero, cantReclamos){
	var nuevoReclamo = new Reclamo(nombre, empresa, tituloReclamo, reclamo, numero, cantReclamos);
	sistemaDeReclamos.agregarRecl(nuevoReclamo);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////// VER RECLAMOS ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//esta funcion agrega a la pagina todos los reclamos hechos
function mostrarReclamos(){

	for(let i=reclamos.length -1; i >= 0; i--){
		let reclamoR = reclamos[i]
		let nombre = reclamoR.nombre;
		let empresa = reclamoR.empresa;
		let tituloReclamo = reclamoR.tituloReclamo;
		let reclamo = reclamoR.reclamo;
		let numero = reclamoR.numero;
		let idParrafo = "recl_" + numero;
		let seccionReclamos = document.getElementById("reclamos_ingresados");
		//crea el h3 de la seccion ver reclamos
		let tituloH3 = document.createElement("h3");
		tituloH3.textContent = "Reclamo No." + numero ;
		seccionReclamos.appendChild(tituloH3);
		
		
		// crea el form que esta anclado auna clase que lo vuelve un cuadrado blanco
		let formReclamos = document.createElement("form");
		formReclamos.className = "cuadradoBlanco";
		seccionReclamos.appendChild(formReclamos);
		
		// crea el parrafo donde va el nombre del usuario con el titulo del reclamo resaltado de rosa 
		let parrafo1 = document.createElement("p");
		parrafo1.innerHTML = nombre + ": <span class='sub1'>" + tituloReclamo + "</span>"; 
		formReclamos.appendChild(parrafo1);
		
		// crea el parrafo done va el nombre de la empresa resaltado de verde
		let parrafo2 = document.createElement("p");
		parrafo2.innerHTML = "Empresa: <span class='sub2'>" + empresa.nombre + "</span>";
		formReclamos.appendChild(parrafo2);
		
		// crea el parrafo donde va la descripcion del reclamo
		let parrafo3 = document.createElement("p");
		parrafo3.innerHTML = reclamo;
		formReclamos.appendChild(parrafo3);
		
		let divPB = document.createElement("div");
		divPB.className = "botCantRecl";
		divPB.id = numero;
		formReclamos.appendChild(divPB);
		// crea el parrafo donde va el boton y el texto con el tontador
		let botonMePaso = document.createElement("button");
		botonMePaso.innerHTML = "¡A mí también me pasó!";
		botonMePaso.setAttribute("type", "button");
		divPB.appendChild(botonMePaso);
		botonMePaso.onclick = function (){botonDeReclamos(empresa, idParrafo, reclamoR);};
		let parrafo4 = document.createElement("p");
		parrafo4.id = idParrafo
		parrafo4.innerHTML = "contador: " + reclamoR.cantReclamos;
		divPB.appendChild(parrafo4);
	}
}
// esta funcion esta asociada a los botones de los reclamos hechos para agregar cantidad de relcamos a la empresa y al reclamo mismo
function botonDeReclamos(empresa, idParrafo, reclamoR){
			
	empresa.cantReclamos ++;

	reclamoR.cantReclamos ++;
	
		let parrafo = document.getElementById(idParrafo);
		parrafo.innerHTML = "contador: " + reclamoR.cantReclamos;
} 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////// BUSCADOR DE RECLAMOS ////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// muestra los relcamos tienen coincidencias en el buscador
function mostrarBusqueda(){
	let busq = buscadorLupita();
	if(busq[0] === -1){
		alert("Primero ingrese lo que desea buscar, muchas gracias");
		return;
	}
	
	if(busq.length === 0){
		alert("No hay ninguna coincidencia, muchas gracias.");
	}else{
		document.getElementById("gestion_Reclamos").style.display="none";
		document.getElementById("estadística").style.display="none";
		document.getElementById("reclamos_ingresados").style.display="none";
		document.getElementById("agregar_Reclamo").style.display="none";
		document.getElementById("agregar_empresa").style.display="none";
		// muestro el elemento con id
		document.getElementById("reclamos_ingresados").style.display="block";
		eliminar("reclamos_ingresados");
		h1VerReclamos();
		for(let i=busq.length -1; i >= 0; i--){
			recl = busq[i];
			let nombre = recl.nombre;
			let empresa = recl.empresa;
			let tituloReclamo = recl.tituloReclamo;
			let reclamo = recl.reclamo;
			let numero = recl.numero;
			//let cantReclamosRec = reclamoR.cantReclamos;
			let seccionReclamos = document.getElementById("reclamos_ingresados");
			let idP = "parr_" + (numero + 1);
			//crea el h3 de la seccion ver reclamos
			let tituloH3 = document.createElement("h3");
			tituloH3.textContent = "Reclamo No." + numero ;
			seccionReclamos.appendChild(tituloH3);
			
			// crea el form que esta anclado auna clase que lo vuelve un cuadrado blanco
			let formReclamos = document.createElement("form");
			formReclamos.className = "cuadradoBlanco";
			seccionReclamos.appendChild(formReclamos);
			
			// crea el parrafo donde va el nombre del usuario con el titulo del reclamo resaltado de rosa 
			let parrafo1 = document.createElement("p");
			parrafo1.innerHTML = nombre + ": <span class='sub1'>" + tituloReclamo + "</span>"; 
			formReclamos.appendChild(parrafo1);
			
			// crea el parrafo done va el nombre de la empresa resaltado de verde
			let parrafo2 = document.createElement("p");
			parrafo2.innerHTML = "Empresa: <span class='sub2'>" + empresa.nombre + "</span>";
			formReclamos.appendChild(parrafo2);
			
			// crea el parrafo donde va la descripcion del reclamo
			let parrafo3 = document.createElement("p");
			parrafo3.innerHTML = reclamo;
			formReclamos.appendChild(parrafo3);
			
			let divPB = document.createElement("div");
			divPB.className = "botCantRecl";
			divPB.id = numero;
			formReclamos.appendChild(divPB);
			// crea el parrafo donde va el boton y el texto con el tontador
			let botonMePaso = document.createElement("button");
			botonMePaso.innerHTML = "¡A mí también me pasó!";
			botonMePaso.setAttribute("type", "button");
			divPB.appendChild(botonMePaso);
			botonMePaso.onclick = function (){botonDeReclamos2(empresa, idP, recl);};
			let parrafo4 = document.createElement("p");
			parrafo4.id = idP
			parrafo4.innerHTML = "contador: " + recl.cantReclamos;
			divPB.appendChild(parrafo4);
		}
	}
	
}
// busca lo que el usuario pone en la lupita y si existe hace un pusha un array
function buscadorLupita() {
  let string = document.getElementById("buscador").value.toLowerCase();
  let busqueda = [];
  if(string === ""){
	  busqueda = [-1];
  }else{
	for (let i = 0; i < reclamos.length; i++) {
		let reclamo = reclamos[i];
		if (reclamo.nombre.includes(string) || reclamo.empresa.nombre.includes(string) || reclamo.tituloReclamo.includes(string) || reclamo.reclamo.includes(string)) {
			busqueda.push(reclamo);
		}
    }
  }
	return busqueda;
}
// esta fucnion agrega cantidad en reclamos y en empresa cuando el usuario busca algun reclamo en especifico
function botonDeReclamos2(empresa, idP, recl){
			
	empresa.cantReclamos ++;

	recl.cantReclamos ++;
	
		let parrafo = document.getElementById(idP);
		parrafo.innerHTML = "contador: " + recl.cantReclamos;
} 

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////// FIN ///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////