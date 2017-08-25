var busquedaHorizontal=0,busquedaVertical=0,buscarNuevosDulces=0;
var arregloUno=[7],arregloDos=[7],maximo=0,miArreglo=0,intervalo=0;
var eliminar=0,nuevosDulces=0,tiempo=0,i=0,contadorTotal=0,espera=0,score=0;
var mov=0,min=2,seg=0;



/////////////FUNCIONES/////////////
function reloj(){
	if(seg!=0){
		seg=seg-1;}
	if(seg==0){
		if(min==0){
			clearInterval(eliminar);
			clearInterval(crearDulces);
			clearInterval(intervalo);
			clearInterval(tiempo);
			$(".panel-tablero").hide("drop","slow",panelFinal);
			$(".time").hide();}
		seg=59;
		min=min-1;}
	$("#timer").html("0"+min+":"+seg);
};


function panelFinal(){
	$( ".panel-score" ).animate({width:'100%'},3000);
	$(".termino").css({"display":"block","text-align":"center"});
};

function borrar(){
	for(var j=1;j<8;j++){
		$(".col-"+j).children("img").detach();}
};

function arrojarDulces(){
	i=i+1
	var numero=0;
	var imagen=0;
	$(".elemento").draggable({disabled:true}); // al comenzar el juego, no podras mover los dulces
	if(i<8){ // i es para recorrer los renglones
		for(var j=1;j<8;j++){ // for para recorrer columnas
			if($(".col-"+j).children("img:nth-child("+i+")").html()==null){ // hago referencia a la columna actual y si no tiene ningun hijo de tipo imagen
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>")// con prepend hacemos el efecto de cascada como que el dulce que se va agregando se vea antes
			}}}
	if(i==8){ // si ya estan llenos todos los renglones
	clearInterval(intervalo);   // parame el setInterval te agregar mas caramelos
	eliminar=setInterval(function(){
		eliminarDulces() // una vez agregados todos los dulces, empiezas a validar para ir eliminando los dulces
	},150);}
};

function eliminarDulces(){
	miArreglo=0;
	busquedaHorizontal=buscarHorizontal();
	busquedaVertical=buscarVertical();
	for(var j=1;j<8;j++){
		miArreglo=miArreglo+$(".col-"+j).children().length;} // guardamos cada hijo (renglon) de cada columna en matriz
	//Condicional si no encuentra 3 dulces o más, llamamos a la función para volver a completar el juego
	if(busquedaHorizontal==0 && busquedaVertical==0 && miArreglo!=49){ // si hay espacios en blanco y ya no hay combinaciones que eliminar
		clearInterval(eliminar); //paras el interval eliminar
		buscarNuevosDulces=0;
		nuevosDulces=setInterval(function(){  // damos inicio a un nuevo interval que nos dirige a la funcion nuevosdulces
			crearDulces()
		},600);}

	if(busquedaHorizontal==1||busquedaVertical==1){ // si me encontraste combinaciones
		$(".elemento").draggable({disabled:true});
		$(".activo").hide(function(){
			var scoretmp=$(".activo").length;
			$(".activo").remove("img");
			score=score+scoretmp*10;
			$("#score-text").html(score);//Cambiamos la puntuación
		});
	}
	if(busquedaHorizontal==0 && busquedaVertical==0 && miArreglo==49){ // si no encontraste combinaciones y el tablero esta lleno de dulces
		$(".elemento").draggable({ // todos los caramelos hasmelos dragables
			disabled:false,
			containment:".panel-tablero", // inicializamos el arrastre en el panel
			revert:true,// si esta en true, el elemento siempre se revertira volvera a su posicion inicial
			revertDuration:0, // tiemp oque se tarda en regresar
			snap:".elemento", // indicamos que todos los dulces arrastrables tendran bordes
			snapMode:"inner", // inicializamos el arraste con inner
			snapTolerance:40, //dimensiones en que se movera el dulce si son muy grandes o muy cortas , segun la sencibilidad del mouse
			start:function(event,ui){ // al dragabear el elemento, se activa la funcion que me suma movimientos
				mov=mov+1;
				$("#movimientos-text").html(mov);}
		});
	}
	$(".elemento").droppable({ // todos los elementos hasmelos droppables para si mismos
		drop:function (event,ui){ ///se activa cuando un arrastrable aceptado se deja caer en el drop
			var dropped=ui.draggable; //variable dropped sera igual al dulce que arrastraremos
			var droppedOn=this; //variable droppedOn sera el dulce fijo
			espera=0;
			do{
				espera=dropped.swap($(droppedOn));}
			while(espera==0);
			busquedaHorizontal=buscarHorizontal(); // si encuentras una combinacion horizontal me devuelves un 1
			busquedaVertical=buscarVertical();// si encuentras una combinacion vertical me devuelves un 1
			if(busquedaHorizontal==0 && busquedaVertical==0){
				dropped.swap($(droppedOn));}
			if(busquedaHorizontal==1 || busquedaVertical==1){
				clearInterval(nuevosDulces);
				clearInterval(eliminar);
				eliminar=setInterval(function(){
					eliminarDulces()
				},150);}},
	});
};

//Funcion swap para el intercambio de dulces
jQuery.fn.swap=function(b){
	b=jQuery(b)[0];
	var a=this[0];
	var t=a.parentNode.insertBefore(document.createTextNode(''),a);
	b.parentNode.insertBefore(a,b);
	t.parentNode.insertBefore(b,t);
	t.parentNode.removeChild(t);
	return this;
};

function buscarVertical(){
	var busVerti=0;
	for(var l=1;l<6;l++){
	for(var k=1;k<8;k++){
		var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src");
		var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src");
		var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src");
		if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
			$(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo");
			$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo");
			$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo");
			busVerti=1;
			}
		}
	}
		return busVerti;
};


function buscarHorizontal(){
	var busHori=0;
	for(var j=1;j<8;j++){
		for(var k=1;k<6;k++){
		var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src");
		var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src");
		var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src");
		if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
			$(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
			$(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
			$(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
			busHori=1;
			}
		}
	}
			return busHori;
};


function crearDulces(){
	$(".elemento").draggable({disabled:true});
	$("div[class^='col']").css("justify-content","flex-start")
	for(var j=1;j<8;j++){
		arregloUno[j-1]=$(".col-"+j).children().length;} // guardamos la longitud de hijos por cada columna
	if(buscarNuevosDulces==0){
		for(var j=0;j<7;j++){
			arregloDos[j]=(7-arregloUno[j]);}
		maximo=Math.max.apply(null,arregloDos);
		contadorTotal=maximo;}
	if(maximo!=0){
		if(buscarNuevosDulces==1){
			for(var j=1;j<8;j++){
				if(contadorTotal>(maximo-arregloDos[j-1])){
					$(".col-"+j).children("img:nth-child("+(arregloDos[j-1])+")").remove("img");}}
		}
		if(buscarNuevosDulces==0){
			buscarNuevosDulces=1;
			for(var k=1;k<8;k++){
				for(var j=0;j<(arregloDos[k-1]-1);j++){
					$(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>");}}
		}
		for(var j=1;j<8;j++){
			if(contadorTotal>(maximo-arregloDos[j-1])){
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>");}
		}
	}
	if(contadorTotal==1){
		clearInterval(nuevosDulces);
		eliminar=setInterval(function(){
			eliminarDulces()
		},150);
	}
	contadorTotal=contadorTotal-1;
};




$(function(){
	$(".btn-reinicio").click(function(){
		i=0;
		score=0;
		mov=0;
		$(".panel-score").css("width","25%");
		$(".panel-tablero").show();
		$(".time").show();
		$("#score-text").html("0");
		$("#movimientos-text").html("0");
		$(this).html("Reiniciar")
		clearInterval(intervalo);
		clearInterval(eliminar);
		clearInterval(crearDulces);
		clearInterval(tiempo);
		min=2;
		seg=0;
		borrar();
		intervalo=setInterval(function(){
			arrojarDulces()
		},1000);
		tiempo=setInterval(function(){
			reloj()
		},1000);
	});

})
