// ===============================
// Test Cocktail Daten
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
// A-Raum Projektion
// ===============================


function projectA(c){


const f=c.features;


// Alkoholachse

let x=f.strong;



// frisch ↔ schwer

let y =
(f.sour+f.fruity)
-
(f.creamy+f.smoky+f.strong);



// fruchtig ↔ spirit-forward

let z =
f.fruity-f.spirit;



return {

x:x*5,

y:y*5,

z:z*5

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



// Text Renderer

const labelRenderer =
new THREE.CSS2DRenderer();


labelRenderer.setSize(
window.innerWidth,
window.innerHeight
);


labelRenderer.domElement.style.position="absolute";
labelRenderer.domElement.style.top="0";


document.body.appendChild(
labelRenderer.domElement
);




// Kamera Steuerung

const controls =
new THREE.OrbitControls(
camera,
renderer.domElement
);


controls.enableDamping=true;



// ===============================
// Farben
// ===============================


const colors={

Gin:0x55ff55,

Rum:0xffff55,

Whiskey:0xff5555,

Vodka:0x5555ff,

Aperol:0xff8800

};




// ===============================
// Sterne erstellen
// ===============================


cocktails.forEach(c=>{


const pos =
projectA(c);



const geometry =
new THREE.SphereGeometry(
0.18,
20,
20
);



const material =
new THREE.MeshBasicMaterial({

color:
colors[c.spirit] || 0xffffff

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



scene.add(sphere);



// Label

const div =
document.createElement("div");


div.className="label";

div.textContent=c.name;



const label =
new THREE.CSS2DObject(div);


label.position.y=0.3;


sphere.add(label);



});




// ===============================
// Animation
// ===============================


function animate(){


requestAnimationFrame(
animate
);


controls.update();


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