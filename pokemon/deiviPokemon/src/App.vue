<template>
    <div class="container">
        <div class="top-bar">
            <div class="navegador">
                <input type="text" v-model="buscar" placeholder="Nombre del pokemon o Id">
                <button @click="pokemon()">Buscar</button>
            </div>
        </div>
        
        <div class="content">
            <div class="infor" 
                 :class="{'multi-type': tipo.length > 1, 'single-type': tipo.length === 1}" 
                 :style="tipo.length === 1 ? {'--single-type-color': coloresTipo[tipo[0]]} : (tipo.length > 1 ? {'--color1': coloresTipo[tipo[0]], '--color2': coloresTipo[tipo[1]]} : {})">
                <h1>{{ nombre }}</h1>
                <img :src="imagen" class="img1">
            </div>

            <div class="datos">
                <p>#{{ id }}</p>
                <p>{{ altura }} m</p>
                <p>{{ peso }} Kg</p>
            </div>

            <div class="inforExtra">
                <div class="tipos">
                    <h1>TIPOS DEL POKEMON</h1>
                    <div class="tipos-container">
                        <p v-for="(t, index) in tipo" :key="index"
                            :style="{ backgroundColor: coloresTipo[t], color: 'white', padding: '5px 10px', borderRadius: '8px', display: 'inline-block', marginRight: '5px' }">
                            {{ t.toUpperCase() }}
                        </p>
                    </div>
                </div>
                <div class="debilidades">
                    <h1>DEBILIDADES DEL POKEMON</h1>
                    <div class="debilidades-container">
                        <p v-for="(d, index) in debilidades" :key="index"
                            :style="{ backgroundColor: coloresTipo[d] || '#888', color: 'white', padding: '5px 10px', borderRadius: '8px', display: 'inline-block', marginRight: '5px', marginBottom: '5px' }">
                            {{ d.toUpperCase() }}
                        </p>
                    </div>
                </div>
            </div>

            <div class="estadisticas">
                <h1>ESTADISTICAS</h1>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-name">HP</div>
                        <div class="stat-bar-container">
                            <div class="stat-bar hp-bar" :style="{ width: (hp / 255 * 100) + '%' }"></div>
                        </div>
                        <div class="stat-value">{{ hp }}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-name">ATTACK</div>
                        <div class="stat-bar-container">
                            <div class="stat-bar attack-bar" :style="{ width: (attack / 255 * 100) + '%' }"></div>
                        </div>
                        <div class="stat-value">{{ attack }}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-name">DEFENSE</div>
                        <div class="stat-bar-container">
                            <div class="stat-bar defense-bar" :style="{ width: (defense / 255 * 100) + '%' }"></div>
                        </div>
                        <div class="stat-value">{{ defense }}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-name">SPECIAL-ATTACK</div>
                        <div class="stat-bar-container">
                            <div class="stat-bar special-bar" :style="{ width: (special / 255 * 100) + '%' }"></div>
                        </div>
                        <div class="stat-value">{{ special }}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-name">SPECIAL-DEFENSE</div>
                        <div class="stat-bar-container">
                            <div class="stat-bar special-defense-bar" :style="{ width: (special_defense / 255 * 100) + '%' }"></div>
                        </div>
                        <div class="stat-value">{{ special_defense }}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-name">SPEED</div>
                        <div class="stat-bar-container">
                            <div class="stat-bar speed-bar" :style="{ width: (speed / 255 * 100) + '%' }"></div>
                        </div>
                        <div class="stat-value">{{ speed }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const coloresTipo = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
}

let nombre = ref("");
let imagen = ref("");
let id = ref("");
let altura = ref("");
let peso = ref("");
let tipo = ref([]);
let debilidades = ref([]);
let hp = ref("");
let attack = ref("");
let defense = ref("");
let special = ref("");
let special_defense = ref("");
let speed = ref("");
let buscar = ref("");

async function pokemon() {
    try {
        let nombrePokemon = buscar.value.trim() !== "" ? buscar.value.toLowerCase() : "25";

        const respuesta = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
        console.log(respuesta.data);

        nombre.value = respuesta.data.name;
        id.value = respuesta.data.id;
        imagen.value = respuesta.data.sprites.front_default;
        altura.value = respuesta.data.height / 10;
        peso.value = respuesta.data.weight / 10;
        tipo.value = respuesta.data.types.map(t => t.type.name);
        debilidades.value = [];

        for (const t of respuesta.data.types) {
            const tipoInfo = await axios.get(t.type.url);
            const debili = tipoInfo.data.damage_relations;
            debili.double_damage_from.forEach(d => {
                if (!debilidades.value.includes(d.name)) {
                    debilidades.value.push(d.name);
                }
            });
        }

        hp.value = respuesta.data.stats[0].base_stat;
        attack.value = respuesta.data.stats[1].base_stat;
        defense.value = respuesta.data.stats[2].base_stat;
        special.value = respuesta.data.stats[3].base_stat;
        special_defense.value = respuesta.data.stats[4].base_stat;
        speed.value = respuesta.data.stats[5].base_stat;

    } catch (error) {
        alert("Pokémon no encontrado. Intenta con otro nombre o ID.");
    }
}

onMounted(() => {
    pokemon();
});
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

body {
    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
    min-height: 100vh;
    padding: 0;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    width: 100vw;
    height: 100vh;
    margin: 0;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
}

.top-bar {
    position: fixed;
    top: 15px;
    right: 35px;
    width: 100%;
    height: 80px;
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    align-items: center;
} 

.navegador {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 15px 30px;
    border-radius: 50px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    max-width: 500px;
    width: 100%;
}

.navegador:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.navegador input {
    border: none;
    background: transparent;
    padding: 12px 15px;
    outline: none;
    width: 100%;
    font-size: 18px;
    color: #fff;
    transition: all 0.4s ease;
}

.navegador input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.navegador button {
    background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
    border: none;
    color: white;
    padding: 12px 30px;
    border-radius: 30px;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 1px;
    transition: all 0.3s ease;
    margin-left: 15px;
    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
    white-space: nowrap;
}

.navegador button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(245, 87, 108, 0.6);
}


.content {
    width: 100%;
    height: 100%;
    padding-top: 100px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr ;
    grid-template-rows: 1fr;
    grid-gap: 25px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 30px;
}

.infor {
    grid-column: 1;
    grid-row: 1;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 25px;
    padding: 30px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    text-align: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: slideInLeft 0.6s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}


.infor.single-type {
    border: 3px solid var(--single-type-color);
    box-shadow: 0 0 20px var(--single-type-color);
}


.infor.multi-type::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(45deg, var(--color1), var(--color2), var(--color1));
    background-size: 400% 400%;
    border-radius: 30px;
    z-index: -1;
    animation: gradientMove 5s ease infinite;
}

@keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.infor:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

.infor h1 {
    color: #fff;
    margin-bottom: 25px;
    text-transform: capitalize;
    font-size: 32px;
    font-weight: 700;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.img1 {
    width: 200px;
    height: 200px;
    object-fit: contain;
    transition: all 0.5s ease;
    filter: drop-shadow(0 15px 20px rgba(0, 0, 0, 0.5));
}

.img1:hover {
    transform: scale(1.15) rotate(5deg);
}

.datos {
    grid-column: 2;
    grid-row: 1;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 25px;
    padding: 30px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: slideInUp 0.7s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.datos:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

.datos p {
    margin: 15px 0;
    font-size: 22px;
    color: #fff;
    padding: 15px 20px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    font-weight: 500;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.datos p:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(10px);
}

.inforExtra {
    grid-column: 3;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.tipos, .debilidades {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 25px;
    padding: 25px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: slideInRight 0.8s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.tipos:hover, .debilidades:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

.tipos h1, .debilidades h1 {
    color: #fff;
    margin-bottom: 15px;
    font-size: 18px;
    text-align: center;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.tipos-container, .debilidades-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
}

.debilidades-container p {
    margin: 0;
    padding: 8px 15px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    font-weight: 500;
    color: #fff;
    font-size: 16px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.debilidades-container p:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
}

.estadisticas {
    grid-column: 1 / -1;
    grid-row: 2;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 25px;
    padding: 30px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: slideInUp 0.9s ease-out;
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow-y: auto;
    max-height: 100%;
}

.estadisticas:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

.estadisticas h1 {
    color: #fff;
    margin-bottom: 25px;
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}

.stat-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.stat-name {
    width: 180px;
    font-weight: 600;
    color: #fff;
    font-size: 18px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.stat-bar-container {
    flex: 1;
    height: 25px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    overflow: hidden;
    margin: 0 20px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
}

.stat-bar {
    height: 100%;
    border-radius: 15px;
    transition: width 1.5s ease;
    position: relative;
    overflow: hidden;
}

.stat-bar::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.stat-value {
    width: 50px;
    text-align: right;
    font-weight: 600;
    color: #fff;
    font-size: 18px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.hp-bar { background: linear-gradient(90deg, #ff6b6b, #ee5a24); }
.attack-bar { background: linear-gradient(90deg, #feca57, #ff9ff3); }
.defense-bar { background: linear-gradient(90deg, #48dbfb, #0abde3); }
.special-bar { background: linear-gradient(90deg, #ff9ff3, #f368e0); }
.special-defense-bar { background: linear-gradient(90deg, #1dd1a1, #10ac84); }
.speed-bar { background: linear-gradient(90deg, #feca57, #ff6348); }

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
@media (max-width: 499px) and (min-width: 300px) {
    .content {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto;
        height: auto; 
        padding: 60px 15px 15px; 
    }
    
    .infor {
        margin-top:20px;
        grid-column: 1;
        grid-row: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .datos {
        grid-column: 1;
        grid-row: 2;
    }
    
    .inforExtra {
        grid-column: 1;
        grid-row: 3;
        flex-direction: column;
    }
    
    .tipos, .debilidades {
        width: 100%;
        margin: 0 0 15px 0; 
    }
    
    .estadisticas {
        grid-column: 1;
        grid-row: 4;
        height: auto; 
        max-height: none; 
        padding: 20px 15px; 
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .stat-name {
        width: 120px;
        font-size: 14px;
    }
    
    .stat-bar-container {
        margin: 0 10px;
    }
    
    .stat-value {
        font-size: 14px;
    }
    
    .infor h1 {
        font-size: 24px;
    }
    
    .img1 {
        width: 120px;
        height: 120px;
        display: block; 
        margin: 0 auto; 
    }
    
    .datos p {
        font-size: 18px;
        padding: 10px 15px;
    }
    
    .tipos h1, .debilidades h1 {
        font-size: 16px;
    }
    
    .estadisticas h1 {
        font-size: 22px;
    }
    
    .navegador {
        max-width: 300px;
        padding: 10px 15px;
    }
    
    .navegador input {
        font-size: 14px;
        padding: 8px 10px;
    }
    
    .navegador button {
        padding: 8px 15px;
        font-size: 12px;
        margin-left: 10px;
    }
    
    .top-bar {
        right: 15px;
        height: 60px; 
    }
    
    .infor, .datos, .tipos, .debilidades, .estadisticas {
        padding: 20px;
    }
    

    .stat-item {
        margin-bottom: 15px;
    }
    
    .stat-bar {
        min-width: 50px; 
    }
}



@media (max-width: 900px) and (min-width: 500px) {
    .content {
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto auto auto;
        height: auto;  
        padding-top: 80px; 
    }
    
    .infor {
        margin-top:30px;
        grid-column: 1;
        grid-row: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    
    .datos {
        margin-top:45px;
        grid-column: 2;
        grid-row: 1;
    }
    
    .inforExtra {
        grid-column: 1 / -1;
        grid-row: 2;
        flex-direction: row;
        justify-content: space-between;
    }
    
    .tipos, .debilidades {
        flex: 1;
        margin: 0 10px;
    }
    
    .estadisticas {
        grid-column: 1 / -1;
        grid-row: 3;
        height: auto; 
        max-height: none; 
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .stat-name {
        width: 150px;
        font-size: 16px;
    }
    
    .infor h1 {
        font-size: 28px;
    }
    
    .img1 {
        width: 150px;
        height: 150px;
        display: block; 
        margin: 0 auto;
    }
    
    .navegador {
        max-width: 400px;
    }
    
    .navegador input {
        font-size: 16px;
    }
    
    .navegador button {
        padding: 10px 20px;
        font-size: 14px;
    }
}
 

@media (max-width: 1300px) and (min-width: 901px) {
    .content {
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto auto;
        padding-left: 25px;
        padding-right: 25px;
        grid-gap: 20px;
    }
    
    .infor {
        grid-column: 1;
        grid-row: 1; 
    }
    
    .datos {
        grid-column: 2;
        grid-row: 1;
    }
    
    .inforExtra {
        grid-column: 3;
        grid-row: 1;
        flex-direction: column;
    }
    
    .tipos, .debilidades {
        width: 100%;
        margin-bottom: 15px;
    }
    
    .estadisticas {
        grid-column: 1 / -1;
        grid-row: 2;
        height: 280px;
        
    }
    
    .stats-grid {
        grid-template-columns: 1fr 1fr;
    }
    
    .infor h1 {
        font-size: 28px;
    }
    
    .img1 {
        width: 180px;
        height: 180px;
    }
    
    .datos p {
        font-size: 20px;
        padding: 12px 18px;
    }
    
    .tipos h1, .debilidades h1 {
        font-size: 16px;
    }
    
    .estadisticas h1 {
        font-size: 24px;
    }
    
    .stat-name {
        width: 160px;
        font-size: 16px;
    }
    
    .stat-value {
        font-size: 16px;
    }
    
    .navegador {
        max-width: 450px;
    }
    
    .navegador input {
        font-size: 16px;
    }
    
    .navegador button {
        padding: 10px 25px;
        font-size: 14px;
    }
    
    .top-bar {
        right: 25px;
    }
}
</style>