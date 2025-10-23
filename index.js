// ----- DOM Elements -----
const elements = {
    button: document.getElementById('search__button'),
    input: document.getElementById('search__input'),
    select: document.getElementById('search__select'),
    image: document.getElementById('pokemon-image'),
    name: document.getElementById('pokemon-name'),
    height: document.getElementById('pokemon-height'),
    weight: document.getElementById('pokemon-weight'),
    type: document.getElementById('pokemon-type'),
    infoButton: document.querySelector('.extra__button'),
    infoLink: document.querySelector('.search__link'),
    volverButton: document.getElementById('volver__button')
};

let allPokemons = [];

// ----- Constants -----
const API_BASE = 'https://pokeapi.co/api/v2/pokemon';

// ----- Initialization -----
init();

function init() {
    if (elements.select) elements.select.hidden = true;
    if (elements.infoButton) elements.infoButton.hidden = true;

    // Solo busca todos los pokémon si hay buscador en la página
    if (elements.input || elements.select || elements.button) {
        fetchAllPokemons();
        setupEventListeners();
    }

    // Listener sólo si existe el botón de volver (en la página secundaria)
    if (elements.volverButton) {
        elements.volverButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Listener para el botón "Más información" si existe (en index)
    if (elements.infoButton) {
        elements.infoButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'fullinfo.html';
        });
    }
}

// ----- Fetch Functions -----
async function fetchAllPokemons() {
    try {
        const res = await fetch(`${API_BASE}?limit=1302`);
        const data = await res.json();
        allPokemons = data.results;
    } catch (err) {
        console.error('Error al obtener los Pokémons:', err);
    }
}

async function fetchPokemonDetails(name) {
    try {
        const res = await fetch(`${API_BASE}/${name}`);
        if (!res.ok) throw new Error('Pokémon no encontrado');
        const data = await res.json();
        renderPokemonDetails(data);
        return data;
    } catch (err) {
        console.error('Error al obtener el Pokémon:', err);
    }
}

// ----- Rendering -----
function renderPokemonOptions(filtered) {
    if (!elements.select) return; // Si no está presente, no hace nada

    elements.select.innerHTML = '';

    // Opción por defecto segura (siempre nueva instancia)
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Elige una opción';
    defaultOption.value = '';
    defaultOption.selected = true;
    elements.select.appendChild(defaultOption);

    if (filtered.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.textContent = 'Sin resultados';
        elements.select.appendChild(emptyOption);
        elements.select.hidden = false;
        return;
    }

    filtered.forEach(pkmn => {
        const option = document.createElement('option');
        option.value = pkmn.name;
        option.textContent = capitalize(pkmn.name);
        elements.select.appendChild(option);
    });

    elements.select.hidden = false;

    // Elimina cualquier listener previo para evitar duplicidades
    elements.select.onchange = function () {
        // Guarda el nombre del Pokémon seleccionado en localStorage
        const selectedName = elements.select.value;
        if (selectedName) {
            localStorage.setItem('selectedPokemonName', selectedName);
        }
    };
}

function renderPokemonDetails(data) {
    if (elements.image) elements.image.src = data.sprites.front_default || '';
    if (elements.name) elements.name.textContent = capitalize(data.name);
    if (elements.height) elements.height.textContent = `${data.height / 10} m`;
    if (elements.weight) elements.weight.textContent = `${data.weight / 10} kg`;
    if (elements.type) elements.type.textContent = data.types.map(t => capitalize(t.type.name)).join(', ');

    if (elements.infoLink) {
        elements.infoLink.setAttribute('href', 'fullinfo.html');
    }
    if (elements.infoButton) elements.infoButton.hidden = false;
}

// ----- Events -----
function setupEventListeners() {
    if (elements.button) {
        elements.button.addEventListener('click', handleSearch);
    }
    if (elements.input) {
        elements.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }
    if (elements.select) {
        elements.select.addEventListener('change', handleSelection);
    }
}

function handleSearch() {
    const query = elements.input.value.trim().toLowerCase();
    if (!query || !allPokemons.length) return;

    const filtered = allPokemons.filter(p => p.name.includes(query));
    renderPokemonOptions(filtered);
}

function handleSelection() {
    const selected = elements.select.value;
    if (selected) {
        fetchPokemonDetails(selected)
            .then(data => {
                // Guarda el Pokémon en localStorage al buscarlo
                localStorage.setItem('selectedPokemon', JSON.stringify(data));
            });
    }
}

// ----- Utilidades -----
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function mostrarInformacionExtendida() {
    const dataString = localStorage.getItem('selectedPokemon');
    if (!dataString) return;
    const data = JSON.parse(dataString);

    // Obtén los elementos del DOM a rellenar
    const image = document.getElementById('pokemon-image');
    const name = document.getElementById('pokemon-name');
    const height = document.getElementById('pokemon-height');
    const weight = document.getElementById('pokemon-weight');
    const type = document.getElementById('pokemon-type');

    // Elementos extra para info extendida
    const abilities = document.getElementById('pokemon-abilities');
    const stats = document.getElementById('pokemon-stats');
    const moves = document.getElementById('pokemon-moves');

    // Info básica
    if (image) image.src = data.sprites.front_default || '';
    if (name) name.textContent = capitalize(data.name);
    if (height) height.textContent = `${data.height / 10} m`;
    if (weight) weight.textContent = `${data.weight / 10} kg`;
    if (type) type.textContent = data.types.map(t => capitalize(t.type.name)).join(', ');

    // Info extendida
    if (abilities) abilities.textContent = data.abilities
        .map(a => capitalize(a.ability.name)).join(', ');

    if (stats) {
        stats.innerHTML = ''; // limpia la lista
        data.stats.forEach(s => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${capitalize(s.stat.name)}</strong>: ${s.base_stat}`;
            li.className = 'pokemon__stat-item';
            stats.appendChild(li);
        });
    }

    if (moves) moves.innerHTML = '<strong>Otros movimientos: </strong>' + data.moves
        .slice(0, 6) // Solo los 6 primeros para no saturar
        .map(m => capitalize(m.move.name)).join(', ');

    if (elements.volverButton) {
        elements.volverButton.addEventListener('click', () => {
            localStorage.removeItem('selectedPokemon'); // Borramos el Pokémon guardado
            window.location.href = 'index.html'; // Volvemos al inicio
        });
    }
}

window.addEventListener('DOMContentLoaded', mostrarInformacionExtendida);

