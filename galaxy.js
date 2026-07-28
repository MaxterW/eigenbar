// ============================================================
// Cocktail PCA Visualization - Refactored Version
// Teil 1/3
// ============================================================


// ============================================================
// DATEN UND INITIALITSATION
// ============================================================

let cocktails = [];

let featureNames = [
    "bitter",
    "süß",
    "frisch",
    "fruchtig",
    "trocken",
    "schwer",
    "floral",
    "rauchig",
    "herb",
    "tropisch",
    "würzig",
    "beerig",
    "cremig",
    "leicht",
    "vanillig",
    "nussig",
    "schokoladig",
    "kräftig",
    "sauer",
    "spicy"
];


let projectionA;


async function loadData(){

    const cocktailResponse =
        await fetch(
            "./data/cocktails_test.json"
        );

    cocktails =
        await cocktailResponse.json();



    const projectionResponse =
        await fetch(
            "./data/projectionA.json"
        );

    projectionA =
        await projectionResponse.json();



    init();

}

function init(){


    calculateFeatureMeans();


    createCocktailObjects();


    animate();


}


// ============================================================
// Feature Mittelwerte
// ============================================================

function calculateFeatureMeans(){

    featureMeans = {};

    featureNames.forEach(key=>{

        let sum = 0;

        cocktails.forEach(c=>{

            sum += c.features[key] || 0;

        });


        featureMeans[key] =
            sum / cocktails.length;

    });

}



// ============================================================
// PCA
// ============================================================


function cocktailToVector(cocktail){

    return featureNames.map(
        key => cocktail.features[key] || 0
    );

}



function PCA(dataVectors){


    let dimensions = dataVectors[0].length;
    let mean = new Array(dimensions).fill(0);


    dataVectors.forEach(v=>{

        for(let i=0;i<dimensions;i++){

            mean[i]+=v[i] / v.length;

        }

    });



    let C = Array.from(
            {length:dimensions},
            ()=>new Array(dimensions).fill(0)
        );



    dataVectors.forEach(v=>{


        let centered =
            v.map(
                (x,i)=>x-mean[i]
            );


        for(let i=0;i<dimensions;i++){

            for(let j=0;j<dimensions;j++){

                C[i][j]+=
                    centered[i]*
                    centered[j];

            }
        }

    });



    for(let i=0;i<dimensions;i++){

        for(let j=0;j<dimensions;j++){

            C[i][j]/=
                dataVectors.length-1;

        }

    }


    return getEigenvectors(C);

}




function getEigenvectors(A){


    let n=A.length;

    let vectors=[];


    let M =
        A.map(
            row=>row.slice()
        );



    for(let k=0;k<3;k++){


        let v = Array.from({length:n}, ()=>Math.random());


        for(let iteration=0;iteration<100;iteration++){

            let Av = new Array(n).fill(0);

            for(let i=0;i<n;i++){

                for(let j=0;j<n;j++){

                    Av[i]+=M[i][j]*v[j];

                }

            }

            let norm = Math.sqrt(Av.reduce((s,x)=>s+x*x,0));

            v = Av.map(x=>x/norm);

        }


        vectors.push(v);



        let lambda=0;


        for(let i=0;i<n;i++){

            for(let j=0;j<n;j++){

                lambda+=
                    v[i]*
                    M[i][j]*
                    v[j];

            }

        }



        for(let i=0;i<n;i++){

            for(let j=0;j<n;j++){

                M[i][j]-=
                    lambda*
                    v[i]*
                    v[j];

            }

        }

    }


    return vectors;

}



// ============================================================
// PCA Stabilisierung
// ============================================================


function alignAxis(reference, axis){


    let dot=0;


    for(let i=0;i<reference.length;i++){

        dot+=
            reference[i]*
            axis[i];

    }


    if(dot<0){

        return axis.map(
            x=>-x
        );

    }


    return axis;

}





function basisToProjection(basis){


    let projection={

        x:{},
        y:{},
        z:{}

    };



    ["x","y","z"].forEach(
        (axis,index)=>{


            featureNames.forEach(
                (feature,i)=>{


                    projection[axis][feature]=
                        basis[index][i];

                }
            );

        }
    );


    return projection;

}


// ============================================================
// KOORDINATEN TRANSFORMATION
// ============================================================



class CoordinateSpace {


    constructor(){

        this.origin =
            new THREE.Vector3();


        this.rotation =
            new THREE.Quaternion();


        this.scale=1;

    }


}





function project(cocktail, projection){


    const f =
        cocktail.features;



    function calculate(axis){


        let result=0;


        for(const key in axis){

            result +=
                ((f[key]||0)
                -
                featureMeans[key])
                *
                axis[key];

        }


        return result;

    }



    return new THREE.Vector3(

        calculate(projection.x)*8,
        calculate(projection.y)*8,
        calculate(projection.z)*8

    );

}





function transformPoint(point, space){


    let result =
        point.clone();


    result.sub(
        space.origin
    );


    result.applyQuaternion(
        space.rotation
    );


    result.multiplyScalar(
        space.scale
    );


    return result;

}


// ============================================================
// LOKALE TRANSFORMATION
// ============================================================



function calculateLocalRotation(selectedCocktail){


    const selectedPosition = project(selectedCocktail, projectionA);
    let points=[];


    cocktails.forEach(c=>{


        let p =
            project(
                c,
                projectionA
            )
            .sub(
                selectedPosition
            );



        let distance =
            p.length();



        let sigma=0.8;


        let weight =
            Math.exp(
                -(distance*distance)
                /
                (2*sigma*sigma)
            );



        points.push({

            vector:[
                p.x,
                p.y,
                p.z
            ],

            weight

        });


    });


    const basis = PCA3D(points);


    return createRotationMatrix(
        basis
    );

}





function PCA3D(points){


    let C=[

        [0,0,0],
        [0,0,0],
        [0,0,0]

    ];



    points.forEach(p=>{


        for(let i=0;i<3;i++){

            for(let j=0;j<3;j++){

                C[i][j]+=
                    p.vector[i]*
                    p.vector[j]*
                    p.weight;

            }

        }


    });



    return getEigenvectors(C);

}





function createRotationMatrix(basis){



    const globalBasis=[

        [1,0,0],
        [0,1,0],
        [0,0,1]

    ];



    for(let i=0;i<3;i++){

        basis[i]=
            alignAxis(
                globalBasis[i],
                basis[i]
            );

    }



    let m =
        new THREE.Matrix4();



    m.makeBasis(

        new THREE.Vector3(
            basis[0][0],
            basis[0][1],
            basis[0][2]
        ),


        new THREE.Vector3(
            basis[1][0],
            basis[1][1],
            basis[1][2]
        ),


        new THREE.Vector3(
            basis[2][0],
            basis[2][1],
            basis[2][2]
        )

    );



    return m;

}





// ============================================================
// ZIELPOSITIONEN
// ============================================================



function calculateTargetPositions(
    selectedCocktail
){


    const selectedPos =
        project(selectedCocktail, projectionA);


    const rotation =
        new THREE.Quaternion()
            .setFromRotationMatrix(
                calculateLocalRotation(
                    selectedCocktail
                )
            );



    let targets={};



    cocktails.forEach(c=>{


        let p =
            project(c, projectionA).sub(selectedPos);

        p.applyQuaternion(rotation);


        let v1 =
            cocktailToVector(
                selectedCocktail
            );


        let v2 =
            cocktailToVector(c);



        let distance = 0;


        for(let i=0; i<v1.length; i++){

            distance +=
                (v1[i]-v2[i])**2;

        }


        distance =
            Math.sqrt(distance);



        let scale =
            1 +
            0.8 * distance;



        p.multiplyScalar(scale);



        targets[c.name]=p;


    });



    return targets;

}





// ============================================================
// THREE.JS SZENE
// ============================================================



const scene =
    new THREE.Scene();



scene.background =
    new THREE.Color(
        0x050505
    );



const camera =
    new THREE.PerspectiveCamera(
        60,
        window.innerWidth /
        window.innerHeight,
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


// ============================================================
// LABELS
// ============================================================



const labelRenderer =
    new THREE.CSS2DRenderer();



labelRenderer.setSize(
    window.innerWidth,
    window.innerHeight
);



labelRenderer.domElement.style.position =
    "absolute";


labelRenderer.domElement.style.top =
    "0";


labelRenderer.domElement.style.pointerEvents =
    "none";



document.body.appendChild(
    labelRenderer.domElement
);




// ============================================================
// CONTROLS
// ============================================================


const controls =
    new THREE.OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping=true;



scene.add(
    new THREE.AxesHelper(10)
);




// ============================================================
// COCKTAIL OBJEKTE
// ============================================================



const cocktailObjects=[];


function createCocktailObjects(){

    cocktails.forEach(cocktail=>{


        const geometry =
            new THREE.SphereGeometry(
                0.3,
                20,
                20
            );



        const color =
            cocktail.spirit==="Gin"
            ?
            0x55aaff

            :

            cocktail.spirit==="Whiskey"
            ?
            0xffaa44

            :

            0xffff88;



        const material =
            new THREE.MeshBasicMaterial({
                color
            });



        const sphere =
            new THREE.Mesh(
                geometry,
                material
            );



        sphere.position.copy(
            project(
                cocktail,
                projectionA
            )
        );



        sphere.userData.cocktail =
            cocktail;


        sphere.userData.isCocktail=true;



        scene.add(
            sphere
        );



        cocktailObjects.push(
            sphere
        );



        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            cocktail.name;



        div.style.color =
            "white";



        const label =
            new THREE.CSS2DObject(
                div
            );



        label.position.y=0.4;



        sphere.add(
            label
        );


    });
}




// ============================================================
// CLICK SYSTEM
// ============================================================



const raycaster =
    new THREE.Raycaster();


const mouse =
    new THREE.Vector2();





window.addEventListener(
    "click",
    event=>{


        mouse.x =
            (event.clientX /
            window.innerWidth)
            *2-1;


        mouse.y =
            -(event.clientY /
            window.innerHeight)
            *2+1;



        raycaster.setFromCamera(
            mouse,
            camera
        );



        const hits =
            raycaster.intersectObjects(
                cocktailObjects
            );



        if(hits.length){


            const cocktail =
                hits[0]
                .object
                .userData
                .cocktail;



            startCocktailTransition(
                cocktail
            );


        }


    }
);


// ============================================================
// ANIMATION SYSTEM
// ============================================================
//
// Jede Animation besitzt:
// - Startzustand
// - Endzustand
// - Dauer
// - eigene Interpolation





class Animation {


    constructor({

        object,
        start,
        end,
        duration = 1000,
        easing = Animation.smooth

    }){


        this.object = object;


        this.start =
            start.clone();


        this.end =
            end.clone();


        this.duration =
            duration;


        this.elapsed=0;


        this.easing =
            easing;


        this.finished=false;

    }




    update(delta){


        if(this.finished)
            return;



        this.elapsed +=
            delta * 1000;



        let t =
            Math.min(
                this.elapsed /
                this.duration,
                1
            );



        t =
            this.easing(t);



        this.object.position.lerpVectors(

            this.start,

            this.end,

            t

        );



        if(this.elapsed>=this.duration){

            this.object.position.copy(
                this.end
            );


            this.finished=true;

        }


    }



    static linear(t){

        return t;

    }



    static smooth(t){

        return t*t*(3-2*t);

    }



}





// ============================================================
// GLOBALER ANIMATION MANAGER
// ============================================================



class Animator {


    constructor(){

        this.animations=[];

    }




    add(animation){

        this.animations.push(
            animation
        );

    }





    update(delta){


        this.animations.forEach(
            animation=>{

                animation.update(
                    delta
                );

            }
        );



        this.animations =
            this.animations.filter(
                a=>!a.finished
            );

    }


}




const animator =
    new Animator();





// ============================================================
// TRANSITION START
// ============================================================
//
// Erzeugt nur Animationen.
// Keine Animation steckt hier.
//




function startCocktailTransition(
    selectedCocktail
){



    const targets =
        calculateTargetPositions(
            selectedCocktail
        );




    cocktailObjects.forEach(
        object=>{


            const name =
                object
                .userData
                .cocktail
                .name;



            animator.add(

                new Animation({

                    object,


                    start:
                        object.position.clone(),


                    end:
                        targets[name].clone(),


                    duration:
                        1800,


                    easing:
                        Animation.smooth

                })

            );


        }
    );



}





// ============================================================
// CLOCK
// ============================================================


const clock =
    new THREE.Clock();




// ============================================================
// RENDER LOOP
// ============================================================



function animate(){


    requestAnimationFrame(
        animate
    );



    const delta =
        clock.getDelta();



    controls.update();



    animator.update(
        delta
    );



    renderer.render(
        scene,
        camera
    );



    labelRenderer.render(
        scene,
        camera
    );


}



loadData();




// ============================================================
// RESIZE
// ============================================================



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