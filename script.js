const SUPABASE_URL =
"https://DEINE_URL.supabase.co";


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




async function getAverageRating(id){


    const {data,error} =
    await supabaseClient
    .from("ratings")
    .select("rating")
    .eq("cocktail_id",id);



    if(error || data.length === 0){

        return "Keine Bewertungen";

    }



    const average =
    data.reduce(
        (sum,r)=>sum + Number(r.rating),
        0
    ) / data.length;



    return `
    ${renderStars(average)}
    <br>
    ${average.toFixed(1)} / 5
    `;

}




async function loadCocktails(){


    const response =
    await fetch("cocktails.json");


    const cocktails =
    await response.json();



    const container =
    document.getElementById("cocktails");



    for(const cocktail of cocktails){



        const rating =
        await getAverageRating(cocktail.id);



        container.innerHTML += `


        <a class="card"
        href="cocktail.html?id=${cocktail.id}">


            //<img src="${cocktail.image_url}">


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
            ${rating}
            </div>


        </a>


        `;


    }


}


loadCocktails();