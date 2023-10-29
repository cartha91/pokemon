document.getElementById('searchBar').addEventListener('input', function(e) {
    let searchText = e.target.value;

    fetch(`https://pokeapi.co/api/v2/pokemon/${searchText}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`No Pokémon found with the name "${searchText}"`);
            }
            return response.json();
        })
        .then(data => {
            let pokemonContainer = document.getElementById('pokemonContainer');
            pokemonContainer.innerHTML = `
                <h2>${data.name}</h2>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <p>Height: ${data.height}</p>
                <p>Weight: ${data.weight}</p>
            `;
        })
        .catch(error => {
            let pokemonContainer = document.getElementById('pokemonContainer');
            pokemonContainer.innerHTML = `<p>${error.message}</p>`;
            console.error(error);
        });
});