const SUPABASE_URL =
"https://jnizemsqcwescmagohuw.supabase.co";


const SUPABASE_KEY =
"sb_publishable_yBd-5ZjZPVUJRyLqhyq4IA_nIfYZAAK";


const supabaseClient =
supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);



function renderStars(value){

    let stars = "";

    for(let i = 1; i <= 5; i++){

        if(value >= i){
            stars += "★";
        }

        else if(value >= i - 0.5){
            stars += "⯨";
        }

        else{
            stars += "☆";
        }
    }

    return stars;
}




async function getAllRatings(){

    const {data,error} =
    await supabaseClient
    .from("ratings")
    .select("cocktail_id,rating");


    if(error){
        console.log(error);
        return {};
    }


    let averages = {};


    data.forEach(r => {

        if(!averages[r.cocktail_id]){
            averages[r.cocktail_id] = [];
        }

        averages[r.cocktail_id].push(
            Number(r.rating)
        );

    });



    for(const id in averages){

        const values = averages[id];

        averages[id] =
        values.reduce((a,b)=>a+b,0)
        /
        values.length;

    }


    return averages;

}




async function loadCocktails(){


    const response =
    await fetch("cocktails.json");


    const cocktails =
    await response.json();


    const ratings =
    await getAllRatings();



    const container =
    document.getElementById("cocktails");



    for(const cocktail of cocktails){


        let ratingText =
        "Keine Bewertungen";


        if(ratings[cocktail.id]){

            ratingText =
            `
            ${renderStars(ratings[cocktail.id])}
            <br>
            ${ratings[cocktail.id].toFixed(1)} / 5
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


        ${ratingText}


        </a>

        `;


    }


}


loadCocktails();