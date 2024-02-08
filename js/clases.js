/* AUTOR: Nicolás Molina Giudice - 230333 */
class Sistema{
	constructor(){ 
		this.listaEmpresa = [];
		this.listaReclamos = [];
		this.listaRubrosCant = [];
	}
	
// esto crea objetos de los rubros para guardad las cantidades maximas de cada rubro
	agregarRubros(){
		let nombresRubros = [];
		nombresRubros = [];
		nombresRubros = ["Viajes", "Restaurantes", "Bancos", "Muebles", "Autos", "Servicios", "General"];
		let cant = 0;
		if(this.listaRubrosCant.length === 0){
			for(let i=0; i < nombresRubros.length; i++){
				let nombre = nombresRubros[i];
				this.agregarObjetoRubro(nombre, cant);
			}
		}
		for(let i = 0; i < this.listaRubrosCant.length; i++){
			let objRubro = this.listaRubrosCant[i];
			let cantidadTotal = 0;
			objRubro.cant = 0;
			for(let j = 0; j < this.listaEmpresa .length; j++){
				let empresa = this.listaEmpresa [j];
				if(objRubro.nombre === empresa.rubro){
					cantidadTotal += empresa.cantReclamos;
				}
			}
			objRubro.cant += cantidadTotal;
		}	
}

	agregarObjetoRubro(nombre, cant){
		var nuevoRubro = new reclMax(nombre, cant);
		this.agregarReclamoConCant(nuevoRubro);
	}


	agregarReclamoConCant(rubro){
		this.listaRubrosCant.push(rubro)
	}

// creo un array que guarda los rubros con mayor cantidad de reclamos
	maxCantReclamos() {
		let max = [];
		let cant = 0 ;
		for (let i = 0; i < this.listaRubrosCant.length; i++) {
			let rubro = this.listaRubrosCant[i];
			if (cant < rubro.cant && rubro.cant !== 0) {
				cant = rubro.cant;
				max = [rubro]; // Actualizar el array `max` con el nuevo reclamo con la cantidad máxima
			} else{
				if (cant === rubro.cant ) {
					max.push(rubro); // Agregar reclamo con la misma cantidad máxima a `max`
				}
			}
		  }
		  return max;
		}
	
	// genera el promedio de los reclamos con respecto a las empresas y sin decimales
	promedio(){
		let cant = 0;
		let resultado = 0;
		if(this.listaReclamos.length !== 0 ){
			if(this.listaReclamos[0].cantReclamos !== 0){
				for(let i=0; i < this.listaEmpresa.length; i++){
					cant += empresas[i].cantReclamos;
				}
			}
		resultado = cant/this.listaEmpresa.length;
		resultado = resultado.toFixed(0);
		}
			return resultado;
	}
	//verifica que no hayan 2 empresas con el mismo nombre y que no arranquen con *
	obtenerEmpresa(nombreEmp){
		let emp;
		for(let empresa of this.listaEmpresa){
			if(empresa.nombre === nombreEmp){
				emp = empresa;
			}
		}
		return emp;
	}
	// devuelve true o false si la empresa existe o no 
	existeEmpresa(nombre) {
		for (let i=0; i < this.listaEmpresa.length; i++){
			let nombreEmp = this.listaEmpresa[i].nombre
			if(nombre === nombreEmp){ 
				return true;
			}
		}
		return false
	}
	agregarReclamoConCant(rubro){
		this.listaRubrosCant.push(rubro)
	}
	agregarEmp(empresa){
		this.listaEmpresa.push(empresa);
	}
	agregarRecl(reclamo){
		this.listaReclamos.push(reclamo);
	}
	// ordena las empresas en orden creciente
	empresasOrdenCreciente(){
		return this.listaEmpresa.sort(function(a,b){
					return a.nombre.localeCompare(b.nombre);
		});
	}
	// ordena las empresas en orden decreciente
	empresasOrdenDecreciente(){
		return this.listaEmpresa.sort(function(a,b){
					return b.nombre.localeCompare(a.nombre);
		});
	}
	//devuelve un array de las iniciales de las emresas sin que sean repetidas creando una variable declarada con set
	inicialesEmpresas(){
		let iniSinRep = [];
		for(let i=0; i< this.listaEmpresa.length; i++){
			let emp = this.listaEmpresa[i].nombre.charAt(0).toUpperCase();
			iniSinRep.push(emp);
		}
		let inicialesSinRepetir = [...new Set(iniSinRep)];
		return inicialesSinRepetir;
	}
	
}

// esta es la case por la cual creo los objetos empresas
class Empresa{
    constructor (_nombre, _direccion, _rubro, _cantReclamos){
		this.nombre = _nombre;
		this.direccion = _direccion;
		this.rubro = _rubro;
		this.cantReclamos = _cantReclamos;
	}
}
// esta es la clase por a cuel creo los objetos reclamos
class Reclamo{
	constructor(_nombre, _empresa, _tituloReclamo, _reclamo, _numero, _cantReclamos){
		this.nombre = _nombre;
		this.empresa =  _empresa;
		this.tituloReclamo = _tituloReclamo;
		this.reclamo = _reclamo;
		this.numero = _numero;
		this.cantReclamos = _cantReclamos;
	}
}

// esta es la clase por la cual creo los objetos rubros 
class reclMax{
	constructor(_nombre, cant){
		this.nombre = _nombre;
		this.cant =  cant;
}
}

