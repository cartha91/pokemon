document.getElementById('searchBar').addEventListener('input', function(e) {
    let searchText = e.target.value;

    fetch(`https://pokeapi.co/api/v2/pokemon/${searchText}`)
        .then(response => response.json())
        .then(data => {
            let pokemonContainer = document.getElementById('pokemonContainer');
            pokemonContainer.innerHTML = `
                <h2>${data.name}</h2>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <p>Height: ${data.height}</p>
                <p>Weight: ${data.weight}</p>
            `;
        })
        .catch(error => console.error(error));
    });      