const button = document.getElementById('pkmn-srch');
const input = document.getElementById('input-pkmn')
const buscador = document.getElementById("buscador");
const imagenPkmn = document.getElementById("imagen-pkmn");
const nombreSpan = document.getElementById("nombre-pkmn-span");
const alturaSpan = document.getElementById("altura-pkmn-span");
const pesoSpan = document.getElementById("peso-pkmn-span");
const tipoSpan = document.getElementById("tipo-pkmn-span");
const pokemonSelect = document.getElementById("pokemonSelect");

fetch(`https://pokeapi.co/api/v2/pokemon?limit=1302`)
        .then(res => res.json())
        .then(data => {
            allPokemons = data
            console.log(allPokemons)
        })
        .catch(err => console.log(`Error al obtener los Pokémons`, err))

button.addEventListener('click', (e) => {
    pokemonSelect.innerHTML = '';
    const pokemonFiltro = input.value;
    const filtrados = allPokemons.results.filter(pokemon => pokemon.name.includes(pokemonFiltro.toLowerCase()))
    console.log(filtrados)

    filtrados.forEach(nombre => {
        const option = document.createElement('option');
        option.value = nombre.name;
        option.textContent = nombre.name;
        pokemonSelect.appendChild(option)
    })
})

pokemonSelect.addEventListener('change', () => {
    const seleccion = pokemonSelect.value;
    if (!seleccion) return;
    
    
    fetch(`https://pokeapi.co/api/v2/pokemon/${seleccion}`)
        .then(res => res.json())
        .then(data => {
            const nombre = data.name
            const altura = data.height
            const peso = data.weight
            const tipos = data.types

            console.log('Nombre:', nombre);
            console.log('Altura:', altura);
            console.log('Peso:', peso);
            tipos.forEach(tipo => {
                console.log('Tipo:', tipo.type.name);
            })
            console.log('Imagen:', data.sprites.front_default);

            imagenPkmn.src = data.sprites.front_default;
            nombreSpan.innerHTML = nombre
            alturaSpan.innerHTML = altura;
            pesoSpan.innerHTML = peso;

            let tiposStr = ''
            tipos.forEach(tipo => {tiposStr = tiposStr + ' ' + tipo.type.name})
            tipoSpan.innerHTML = tiposStr;

        })
        .catch(err => console.log(`Error al obtener el Pokémon`, err));
})
