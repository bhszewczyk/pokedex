const pokedex = document.querySelector('.pokedex-container');
const startingOptionEl = document.querySelector('.filter');
const btn1gen = document.querySelector('.btn-fetch--1-gen');
const loaderOverlay = document.querySelector('.loader-overlay');

const COUNT_1_GEN = 151;

const colors = {
	grass: '#cdeac0',
	fire: '#f9c6c9',
	water: '#c6def1',
	poison: '#dbcdf0',
	electric: '#faedcb',
	ground: '#e2cfc4',
	normal: '#f8f7ff',
	flying: '#a0ced9',
	bug: '#acd8aa',
	fairy: '#f7aef8',
	fighting: '#ffac81',
	psychic: '#ffc2d1',
	rock: '#d2d2cf',
	steel: '#e2e2df',
	ice: '#ddfdfe',
	ghost: '#b9b5ff',
	dragon: '#9ba9ff',
};

btn1gen.addEventListener('click', showAll1stGen);

for (const color in colors) {
	const option = document.createElement('button');
	option.classList.add('btn');
	option.classList.add('btn-fetch');
	option.innerText = color;
	option.style.backgroundColor = colors[color];

	option.addEventListener('click', filterPokemon);

	startingOptionEl.append(option);
}

// get data for each pokemon from 1st gen
async function fetch1stGen() {
	for (let i = 1; i <= COUNT_1_GEN; i++) {
		await getPokemon(i);
	}
	loaderOverlay.remove();
}

// fetch pokemon data using id
async function getPokemon(id) {
	// check if its already in the local Storage
	if (localStorage.getItem(id)) {
		return;
	}

	// if not already in the local storage - fetch data
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const results = await fetch(url);
	const data = await results.json();

	// cache to the local storage
	cacheToLocalStorage(data);
}

// extract data needed and cache it to the local storage
function cacheToLocalStorage(data) {
	const { id, name, forms, sprites, types } = data;

	const pokemonData = {
		id: id,
		name: name,
		forms: forms,
		sprite: sprites.front_default,
		types: types,
	};

	localStorage.setItem(id, JSON.stringify(pokemonData));
}

// get cached data
function createPokeData() {
	let allPokemon = [];

	for (let i = 1; i <= COUNT_1_GEN; i++) {
		const currentPoke = localStorage.getItem(i);
		allPokemon.push(JSON.parse(currentPoke));
	}

	return allPokemon;
}

// reset html
function resetPokedex() {
	pokedex.innerHTML = '';
}

// prepare data for only chosen pokemon
async function filterPokemon(e) {
	resetPokedex();
	const clickedType = e.target.innerText;

	const filteredPoke = all1stGenPokemon.filter((obj) => {
		for (let i = 0; i < obj.types.length; i++) {
			if (obj.types[i].type.name === clickedType) {
				return obj;
			}
		}
	});

	filteredPoke.forEach((poke) => createPokemonCard(poke));
}

// create card for chosen pokemon
function createPokemonCard(pokemon) {
	// create card div element
	const cardEl = document.createElement('div');

	// set styling
	cardEl.classList.add('pokemon');

	// get pokemon types
	const pokeTypes = pokemon.types.map(
		(type) =>
			`<span style="background-color: ${colors[type.type.name]}">${
				type.type.name
			}</span>`
	);

	// create card html template
	const cardTemplate = `
	   <div class="img-container">
			<img
				src="${pokemon.sprite}"
						alt="${pokemon.name} image"
			/>
		</div>
		<div class="info">
			<span class="number">#${
				pokemon.id < 10
					? '00' + pokemon.id
					: pokemon.id >= 10 && pokemon.id < 100
					? '0' + pokemon.id
					: pokemon.id
			}</span>
			<h3 class="name">${pokemon.name}</h3>
			<small class="type">Type(s):${pokeTypes.join('')}</small>
		</div>
	`;

	// set html for the card
	cardEl.innerHTML = cardTemplate;

	// add cardEl to DOM
	pokedex.append(cardEl);
}

// create card for each pokemon from 1st generation
function showAll1stGen() {
	resetPokedex();
	all1stGenPokemon.forEach((poke) => createPokemonCard(poke));
}

// fetch data for the first time
fetch1stGen();
// create global variablewith pokemon data
const all1stGenPokemon = createPokeData();
