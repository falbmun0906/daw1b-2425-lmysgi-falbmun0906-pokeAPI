// ----- DOM Elements -----
const elements = {
    button: document.getElementById('search__button'),
    input: document.getElementById('search__input'),
    select: document.getElementById('search__select'),
    image: document.getElementById('pokemon-image'),
    name: document.getElementById('pokemon-name'),
    height: document.getElementById('pokemon-height'),
    weight: document.getElementById('pokemon-weight'),
    type: document.getElementById('pokemon-type')
};

let allPokemons = [];

// ----- Constants -----
const API_BASE = 'https://pokeapi.co/api/v2/pokemon';
const DEFAULT_OPTION = document.createElement('option');
DEFAULT_OPTION.textContent = 'Elige una opción';
DEFAULT_OPTION.value = '';
DEFAULT_OPTION.selected = true;
DEFAULT_OPTION.style.minHeight = '300px';

// ----- Initialization -----
init();

function init() {
    elements.select.hidden = true;
    fetchAllPokemons();
    setupEventListeners();
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
    } catch (err) {
        console.error('Error al obtener el Pokémon:', err);
    }
}

// ----- Rendering -----
function renderPokemonOptions(filtered) {
    elements.select.innerHTML = '';
    elements.select.appendChild(DEFAULT_OPTION);

    if (filtered.length === 0) {
        const emptyOption = document.createElement('option');
        emptyOption.textContent = 'Sin resultados';
        elements.select.appendChild(emptyOption);
        return;
    }

    filtered.forEach(pkmn => {
        const option = document.createElement('option');
        option.value = pkmn.name;
        option.textContent = capitalize(pkmn.name);
        elements.select.appendChild(option);
    });

    elements.select.hidden = false;
}

function renderPokemonDetails(data) {
    const { name, height, weight, sprites, types } = data;
    elements.image.src = sprites.front_default || '';
    elements.name.textContent = capitalize(name);
    elements.height.textContent = `${height / 10} m`;
    elements.weight.textContent = `${weight / 10} kg`;
    elements.type.textContent = types.map(t => capitalize(t.type.name)).join(', ');
}

// ----- Events -----
function setupEventListeners() {
    elements.button.addEventListener('click', handleSearch);
    elements.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    });
    elements.select.addEventListener('change', handleSelection);
}

function handleSearch() {
    const query = elements.input.value.trim().toLowerCase();
    if (!query) return;

    const filtered = allPokemons.filter(p => p.name.includes(query));
    renderPokemonOptions(filtered);
}

function handleSelection() {
    const selected = elements.select.value;
    if (selected) fetchPokemonDetails(selected);
}

// ----- Utilidades -----
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
