// Function to fetch Pokémon data
function fetchPokemonData(searchText) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${searchText}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No Pokémon found with the name "${searchText}"`);
            }
            return response.json();
        })
        .then(data => {
            console.log(JSON.stringify(data.moves))
            let pokemonContainer = document.getElementById('pokemonContainer');
            pokemonContainer.innerHTML = `
                <h2>${data.name}</h2>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <p><b>Height:</b> ${data.height}</p>
                <p><b>Weight:</b> ${data.weight}</p>
                <p><b>Base experience:</b> ${data.base_experience}</p>
                <p><b>Abilities:</b> ${data.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p><b>Types:</b> ${data.types.map(type => type.type.name).join(', ')}</p>
                <p><b>Moves:</b> ${data.moves.map(move => `<span>${move.move.name}</span>`).join()}</p>
            `;

            // Fetch the species to get the evolution chain URL
            return fetch(data.species.url);
        })
        .then(response => response.json())
        .then(data => {
            // Fetch the evolution chain
            return fetch(data.evolution_chain.url);
        })
        .then(response => response.json())
        .then(data => {
            let pokemonContainer = document.getElementById('pokemonContainer');
            let evolutionData = '';

            let evoChain = [];
            let evoData = data.chain;

            do {
                let numberOfEvolutions = evoData['evolves_to'].length;

                evoChain.push({
                    "species_name": evoData.species.name,
                    "min_level": !evoData['evolution_details'][0] ? 1 : evoData['evolution_details'][0]['min_level'],
                    "trigger_name": !evoData['evolution_details'][0] ? null : evoData['evolution_details'][0]['trigger']['name'],
                    "item": !evoData['evolution_details'][0] ? null : evoData['evolution_details'][0]['item']
                });

                if (numberOfEvolutions > 1) {
                    for (let i = 1; i < numberOfEvolutions; i++) {
                        evoChain.push({
                            "species_name": evoData.evolves_to[i].species.name,
                            "min_level": !evoData.evolves_to[i]['evolution_details'][0] ? 1 : evoData.evolves_to[i]['evolution_details'][0]['min_level'],
                            "trigger_name": !evoData.evolves_to[i]['evolution_details'][0] ? null : evoData.evolves_to[i]['evolution_details'][0]['trigger']['name'],
                            "item": !evoData.evolves_to[i]['evolution_details'][0] ? null : evoData.evolves_to[i]['evolution_details'][0]['item']
                        });
                    }
                }

                evoData = evoData['evolves_to'][0];

            } while (!!evoData && evoData.hasOwnProperty('evolves_to'));

            for (let i = 0; i < evoChain.length; i++) {
                evolutionData += `<p>${evoChain[i].species_name} evolves at level ${evoChain[i].min_level}`;
                if (evoChain[i].item) {
                    evolutionData += ` with a(n) ${evoChain[i].item.name}`;
                }
                evolutionData += `</p>`;
            }

            pokemonContainer.innerHTML += `<h3>Evolution Chain:</h3>${evolutionData}`;

            // Display all moves, six per line
            //let moves = data.moves ? data.moves.map(move => `<span>${move.move.name}</span>`) : [];

            let movesHTML = '<p><b>Moves:</b></p>';

            // for (let i = 0; i < moves.length; i += 6) {
            //     movesHTML += '<p>' + moves.slice(i, i + 6).join(', ') + '</p>';
            //     console.log(moves.slice(i, i + 6).join(', '))
            // }

            pokemonContainer.innerHTML += movesHTML;
        })
        .catch(error => {
            let pokemonContainer = document.getElementById('pokemonContainer');
            pokemonContainer.innerHTML = `<p>${error.message}</p>`;
            console.error(error);
        });
}

// Event listener for search button click
document.getElementById('searchButton').addEventListener('click', function () {
    let searchText = document.getElementById('searchBar').value;
    fetchPokemonData(searchText);
});

// Event listener for Enter key press in search bar
document.getElementById('searchBar').addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        let searchText = e.target.value;
        fetchPokemonData(searchText);
    }
});