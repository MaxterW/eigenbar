console.log("GALAXY JS GELADEN");


// ===============================
// Cocktail Daten
// ===============================

const cocktails = [

{
name:"Mojito",
spirit:"Rum",
features:{
sweet:.6,
sour:.8,
bitter:0,
fruity:.7,
floral:.2,
smoky:0,
herbal:.8,
creamy:0,
strong:.2,
spirit:.1
}
},

{
name:"Old Fashioned",
spirit:"Whiskey",
features:{
sweet:.5,
sour:0,
bitter:.6,
fruity:0,
floral:0,
smoky:.3,
herbal:.2,
creamy:0,
strong:.8,
spirit:.8
}
},

{
name:"Negroni",
spirit:"Gin",
features:{
sweet:.3,
sour:.1,
bitter:.9,
fruity:.2,
floral:.2,
smoky:0,
herbal:.7,
creamy:0,
strong:.7,
spirit:.8
}
},

{
name:"Daiquiri",
spirit:"Rum",
features:{
sweet:.5,
sour:.8,
bitter:0,
fruity:.5,
floral:.1,
smoky:0,
herbal:0,
creamy:0,
strong:.4,
spirit:.4
}
},

{
name:"Martini",
spirit:"Gin",
features:{
sweet:.1,
sour:0,
bitter:.3,
fruity:0,
floral:.5,
smoky:0,
herbal:.4,
creamy:0,
strong:.8,
spirit:1
}
},

{
name:"Moscow Mule",
spirit:"Vodka",
features:{
sweet:.4,
sour:.7,
bitter:0,
fruity:.3,
floral:0,
smoky:0,
herbal:0,
creamy:0,
strong:.3,
spirit:.2
}
},

{
name:"Manhattan",
spirit:"Whiskey",
features:{
sweet:.5,
sour:0,
bitter:.5,
fruity:.1,
floral:.2,
smoky:.2,
herbal:.5,
creamy:0,
strong:.8,
spirit:.8
}
},

{
name:"Aperol Spritz",
spirit:"Aperol",
features:{
sweet:.6,
sour:.4,
bitter:.5,
fruity:.6,
floral:.3,
smoky:0,
herbal:.2,
creamy:0,
strong:.2,
spirit:.2
}
},

{
name:"Penicillin",
spirit:"Whiskey",
features:{
sweet:.5,
sour:.5,
bitter:.2,
fruity:.4,
floral:0,
smoky:.9,
herbal:.2,
creamy:0,
strong:.7,
spirit:.7
}
},

{
name:"Cosmopolitan",
spirit:"Vodka",
features:{
sweet:.6,
sour:.7,
bitter:0,
fruity:.8,
floral:.2,
smoky:0,
herbal:0,
creamy:0,
strong:.4,
spirit:.3
}
}

];



// ===============================
// Projektion A-Raum
// ===============================

function projectA(c){

const f=c.features;


return {

x:f.strong*5,

y:
(
f.sour+
f.fruity-
f.creamy-
f.smoky
)*5,

z:
(
f.fruity-
f.spirit
)*5

};

}



// ===============================
// Three.js Setup
// ===============================

const scene =
new THREE.Scene();



const camera =
new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
);


camera.position.z=20;



const renderer =
new THREE.WebGLRenderer({
antialias:true
});


renderer.setSize(
window.innerWidth,
window.innerHeight
);


document.body.appendChild(
renderer.domElement
);



// ===============================
// Labels
// ===============================

const labelRenderer =
new THREE.CSS2DRenderer();


labelRenderer.setSize(
window.innerWidth,
window.innerHeight
);


labelRenderer.domElement.style.position="absolute";
labelRenderer.domElement.style.top="0";
labelRenderer.domElement.style.left="0";
labelRenderer.domElement.style.pointerEvents="none";


document.body.appendChild(
labelRenderer.domElement
);



// ===============================
// Controls
// ===============================

const controls =
new THREE.OrbitControls(
camera,
renderer.domElement
);


controls.enableDamping=true;


console.log(
"Controls:",
controls
);



// ===============================
// Transformation Variablen
// ===============================

let transforming = false;

let transformProgress = 0;

let startPositions = [];

let targetPositions = [];

let transformStartTime = 0;

const transformDuration = 3000; // Millisekunden



// ===============================
// Raycaster
// ===============================

const raycaster =
new THREE.Raycaster();


const mouse =
new THREE.Vector2();



// ===============================
// Koordinatenachsen
// ===============================

const axisLength=8;


function createAxis(start,end,color){

const line =
new THREE.Line(

new THREE.BufferGeometry()
.setFromPoints([
start,
end
]),

new THREE.LineBasicMaterial({
color:color
})

);

scene.add(line);

}



createAxis(
new THREE.Vector3(-axisLength,0,0),
new THREE.Vector3(axisLength,0,0),
0xff0000
);


createAxis(
new THREE.Vector3(0,-axisLength,0),
new THREE.Vector3(0,axisLength,0),
0x00ff00
);


createAxis(
new THREE.Vector3(0,0,-axisLength),
new THREE.Vector3(0,0,axisLength),
0x0000ff
);



const origin =
new THREE.Mesh(

new THREE.SphereGeometry(
0.12,
16,
16
),

new THREE.MeshBasicMaterial({
color:0xffffff
})

);


scene.add(origin);

// ===============================
// Labels
// ===============================


function createLabel(text,position){


const div =
document.createElement("div");


div.className="label";

div.textContent=text;



const label =
new THREE.CSS2DObject(div);


label.position.copy(position);


scene.add(label);


}



createLabel(
"X",
new THREE.Vector3(axisLength+0.5,0,0)
);


createLabel(
"Y",
new THREE.Vector3(0,axisLength+0.5,0)
);


createLabel(
"Z",
new THREE.Vector3(0,0,axisLength+0.5)
);




// ===============================
// Farben nach Spirituose
// ===============================


const colors={

Gin:0x55ff55,

Rum:0xffff55,

Whiskey:0xff5555,

Vodka:0x5555ff,

Aperol:0xff8800

};




// ===============================
// Cocktails erzeugen
// ===============================


cocktails.forEach(c=>{


const pos =
projectA(c);



const geometry =
new THREE.SphereGeometry(
0.25,
20,
20
);



const material =
new THREE.MeshBasicMaterial({

color:
colors[c.spirit] || 0xffffff,

transparent:true,

opacity:1

});



const sphere =
new THREE.Mesh(
geometry,
material
);



sphere.position.set(
pos.x,
pos.y,
pos.z
);



sphere.userData.isCocktail=true;

sphere.userData.cocktail=c;



scene.add(sphere);



// Label

const div =
document.createElement("div");


div.className="label";


div.textContent=c.name;



const label =
new THREE.CSS2DObject(div);


label.position.y=0.35;


sphere.add(label);



});




// ===============================
// Klickerkennung
// ===============================


renderer.domElement.addEventListener(
"click",
(event)=>{


mouse.x =
(event.clientX /
window.innerWidth)*2-1;


mouse.y =
-(event.clientY /
window.innerHeight)*2+1;



raycaster.setFromCamera(
mouse,
camera
);



const intersects =
raycaster.intersectObjects(
scene.children
);



for(let hit of intersects){


if(hit.object.userData.isCocktail){


transformToCocktail(
hit.object
);


break;

}


}


});





// ===============================
// Transformation
// ausgewählter Cocktail -> Ursprung
// ===============================


function transformToCocktail(selected){


console.log(
"Ausgewählt:",
selected.userData.cocktail.name
);



startPositions=[];

targetPositions=[];



const center =
selected.position.clone();



scene.children.forEach(obj=>{


if(obj.userData.isCocktail){


startPositions.push({

object:obj,

position:
obj.position.clone()

});



targetPositions.push({

object:obj,

position:
obj.position.clone()
.sub(center)

});


}


});


transformProgress = 0;

transformStartTime = performance.now();

transforming = true;


}





// ===============================
// Animation
// ===============================


function animate(){


requestAnimationFrame(
animate
);



controls.update();




// -------------------------------
// Raum Transformation
// -------------------------------


if(transforming){


const elapsed =
performance.now()
-
transformStartTime;



transformProgress =
Math.min(
elapsed / transformDuration,
1
);



// kubische Ease-In-Out Funktion

const eased =
transformProgress < 0.5

?

16 *
Math.pow(transformProgress,5)

:

1 -
Math.pow(
-2 * transformProgress + 2,
5
) / 2;



for(
let i=0;
i<startPositions.length;
i++
){


startPositions[i]
.object
.position
.lerpVectors(

startPositions[i].position,

targetPositions[i].position,

eased

);


}



if(transformProgress >= 1){

transforming=false;

}


}


// -------------------------------
// Kameraabhängige Größe
// -------------------------------


scene.children.forEach(obj=>{


if(obj.userData.isCocktail){



const distance =
camera.position.distanceTo(
obj.position
);



const scale =
THREE.MathUtils.clamp(

1-distance/35,

0.25,

1

);



obj.scale.setScalar(
scale
);



obj.material.opacity =
THREE.MathUtils.clamp(

1-distance/35,

0.15,

1

);



}


});




renderer.render(
scene,
camera
);



labelRenderer.render(
scene,
camera
);



}


animate();





// ===============================
// Resize
// ===============================


window.addEventListener(
"resize",
()=>{


camera.aspect =
window.innerWidth /
window.innerHeight;


camera.updateProjectionMatrix();



renderer.setSize(
window.innerWidth,
window.innerHeight
);



labelRenderer.setSize(
window.innerWidth,
window.innerHeight
);



});