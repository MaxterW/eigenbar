const SUPABASE_URL =
"https://jnizemsqcwescmagohuw.supabase.co";

const SUPABASE_KEY =
"sb_publishable_yBd-5ZjZPVUJRyLqhyq4IA_nIfYZAAK";

const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let allCocktails = [];
let averageRatings = {};


function renderStars(value){

    let stars = "";

    for(let i = 1; i <= 5; i++){

        if(value >= i){

            stars += `<span class="full-star">★</span>`;

        }

        else if(value >= i - 0.5){

            stars += `<span class="half-star">★</span>`;

        }

        else{

            stars += `<span class="empty-star">★</span>`;

        }

    }

    return stars;

}





async function loadRatings(){


    const {data,error} =
    await supabaseClient
    .from("ratings")
    .select("cocktail_id,rating");


    if(error){

        console.error(error);
        return {};

    }


    const ratings = {};


    data.forEach(r => {

        if(!ratings[r.cocktail_id]){

            ratings[r.cocktail_id] = [];

        }

        ratings[r.cocktail_id].push(
            Number(r.rating)
        );

    });


    Object.keys(ratings).forEach(id => {

        const values = ratings[id];

        ratings[id] =
            values.reduce((a,b)=>a+b,0)
            / values.length;

    });


    return ratings;

}





function createFilters(){


    const categorySelect =
    document.getElementById("categoryFilter");


    const flavorContainer =
    document.getElementById("flavorFilter");



    if(categorySelect){

        const categories =
        [...new Set(
            allCocktails.map(c=>c.category)
        )];


        categories.forEach(category=>{

            categorySelect.innerHTML +=
            `
            <option value="${category}">
            ${category}
            </option>
            `;

        });

    }




    if(flavorContainer){


        const flavors =
        [...new Set(

            allCocktails.flatMap(
                c=>c.flavor_profile || []
            )

        )].sort();



        flavors.forEach(flavor=>{


            flavorContainer.innerHTML +=
            `

            <label class="flavor-option">

            <input
            type="checkbox"
            class="flavorCheckbox"
            value="${flavor}"
            checked
            >

            <span>${flavor}</span>

            </label>

            `;


        });


    }


}





function applyFilters(){


    let filtered = [...allCocktails];



    const search =
    document
    .getElementById("search")
    ?.value
    .toLowerCase()
    .trim();



    if(search){

        filtered =
        filtered.filter(c=>

            c.name
            .toLowerCase()
            .includes(search)

        );

    }



    const category =
    document
    .getElementById("categoryFilter")
    ?.value;



    if(category){

        filtered =
        filtered.filter(c=>

            c.category === category

        );

    }



    const alcohol =
    Number(

        document
        .getElementById("alcoholFilter")
        ?.value ?? 100

    );



    filtered =
    filtered.filter(c=>

        c.alcohol_pc <= alcohol

    );



    const selectedFlavors =
    [
        ...document
        .querySelectorAll(".flavorCheckbox:checked")
    ]
    .map(cb=>cb.value);



    if(
    selectedFlavors.length > 0
    ){

    filtered =
    filtered.filter(c=>

        c.flavor_profile?.some(
            flavor =>
            selectedFlavors.includes(flavor)
        )

    );

    }



    displayCocktails(filtered);

}





function displayCocktails(cocktails){


    const container =
    document.getElementById("cocktails");


    container.innerHTML = "";



    cocktails.forEach(cocktail=>{


        let ratingHTML =
        "Keine Bewertungen";


        if(averageRatings[cocktail.id]){

            ratingHTML = `

            ${renderStars(
                averageRatings[cocktail.id]
            )}

            <br>

            ${averageRatings[cocktail.id].toFixed(1)} / 5

            `;

        }



        container.innerHTML += `

        <a class="card"
        href="cocktail.html?id=${cocktail.id}">


            <h2>
            ${cocktail.name}
            </h2>


            <p>

            ${cocktail.ingredients
            .map(i=>i.name)
            .join(", ")}

            </p>


            <p>

            ${cocktail.category}
            |
            ${cocktail.alcohol_pc} %

            </p>


            <div>

            ${ratingHTML}

            </div>


        </a>

        `;

    });

}


function updateFlavorCounter(){

    const boxes =
    document.querySelectorAll(
        ".flavorCheckbox"
    );


    const checked =
    document.querySelectorAll(
        ".flavorCheckbox:checked"
    );


    const button =
    document.getElementById(
        "flavorToggle"
    );


    const container =
    document.getElementById(
        "flavorFilterContainer"
    );


    if(button){

        const arrow =
        container &&
        !container.classList.contains("hidden")
        ? "▲"
        : "▼";


        button.innerHTML =
        `
        Geschmacksprofile
        (${checked.length}/${boxes.length})
        ${arrow}
        `;

    }

}


async function init(){


    const response =
    await fetch("cocktails.json");


    allCocktails =
    await response.json();


    // Sofort anzeigen
    displayCocktails(allCocktails);



    // Danach Bewertungen nachladen
    try {

        averageRatings =
        await loadRatings();


        displayCocktails(allCocktails);


    }

    catch(error){

        console.error(
            "Bewertungen konnten nicht geladen werden:",
            error
        );

    }



    createFilters();

    updateFlavorCounter();



    document
    .getElementById("search")
    ?.addEventListener(
        "input",
        applyFilters
    );


    document
    .getElementById("categoryFilter")
    ?.addEventListener(
        "change",
        applyFilters
    );


    document
    .getElementById("flavorFilter")
    ?.addEventListener(
        "change",
        applyFilters
    );


    document
    .getElementById("alcoholFilter")
    ?.addEventListener(
        "input",
        e=>{

            document
            .getElementById("alcoholValue")
            .textContent =
            e.target.value + " %";


            applyFilters();

        }
    );

    document
    .querySelectorAll(".flavorCheckbox")
    .forEach(box=>{

        box.addEventListener(
            "change",
            ()=>{

                updateFlavorCounter();

                applyFilters();

            }
        );

    });

    document
    .getElementById("selectAllFlavors")
    ?.addEventListener(
    "click",
    ()=>{


    document
    .querySelectorAll(".flavorCheckbox")
    .forEach(box=>{

        box.checked=true;

    });

    updateFlavorCounter();

    applyFilters();


    });





    document
    .getElementById("deselectAllFlavors")
    ?.addEventListener(
    "click",
    ()=>{


    document
    .querySelectorAll(".flavorCheckbox")
    .forEach(box=>{

        box.checked=false;

    });

    updateFlavorCounter();

    applyFilters();


    });


    const flavorToggle =
    document.getElementById(
        "flavorToggle"
    );


    const flavorContainer =
    document.getElementById(
        "flavorFilterContainer"
    );



    flavorToggle.addEventListener(
    "click",
    ()=>{


        flavorContainer.classList.toggle(
            "hidden"
        );


    });

}



init();