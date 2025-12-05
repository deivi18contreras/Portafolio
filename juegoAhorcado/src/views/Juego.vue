<template>
  <q-page class="juego-page">
    <div class="info-row ">
      <h1>Juego del Ahorcado</h1>
      <div class="subtitles">
        <h2>Categoría: {{ categoria || '—' }}</h2>
        <h2>Nivel: {{ nivel || '—' }}</h2>
      </div>
      <div class="timer">⏱ Tiempo: {{ tiempo }}s</div>
    </div>

    <div class="contenido">

     
      <div class="robot">
        <img :src="base" class="parte base" />
        <img v-if="fallos >= 1" :src="cabeza" class="parte cabeza" />
        <img v-if="fallos >= 2" :src="torso" class="parte torso" />
        <img v-if="fallos >= 3" :src="brazoIzquierdo" class="parte brazo-izq" />
        <img v-if="fallos >= 4" :src="brazoDerecho" class="parte brazo-der" />
        <img v-if="fallos >= 5" :src="cadera" class="parte cadera" />
        <img v-if="fallos >= 6" :src="piernaIzquierda" class="parte pierna-izq" />
        <img v-if="fallos >= 7" :src="piernaDerecha" class="parte pierna-der" />
      </div>

      <div class="panel-derecho">
        <div v-if="mostrarPista" class="pista">
          💡 Pista: {{ pista }}
        </div>

        <div class="palabra">
          <span v-if="!palabra">Cargando...</span>
          <span v-else>{{ palabraMostrada }}</span>
        </div>

        <div class="letras">
          <button v-for="l in letras" :key="l" :disabled="usadas.includes(l) || terminado" @click="intentar(l)">
            {{ l.toUpperCase() }}
          </button>
        </div>

        <h3>Fallos: {{ fallos }} / 7</h3>

        <div v-if="ganaste" class="win">🎉 ¡Ganaste!</div>
        <div v-if="perdiste" class="lose">❌ La palabra era {{ palabra }}</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

import base from "../assets/base.png";
import cabeza from "../assets/cabeza.png";
import torso from "../assets/torso.png";
import brazoIzquierdo from "../assets/brazoIzquierdo.png";
import brazoDerecho from "../assets/brazoDerecho.png";
import cadera from "../assets/cadera.png";
import piernaIzquierda from "../assets/piernaIzquierda.png";
import piernaDerecha from "../assets/piernaDerecha.png";

const palabrasAhorcado = {
    animales: {
      facil: [
        { palabra: "perro", pista: "El mejor amigo del hombre" },
        { palabra: "gato", pista: "Animal doméstico que maúlla" },
        { palabra: "lobo", pista: "Pariente salvaje del perro" },
        { palabra: "vaca", pista: "Da leche" },
        { palabra: "panda", pista: "Oso blanco y negro" },
        { palabra: "tigre", pista: "Felino con rayas naranjas" },
        { palabra: "raton", pista: "Pequeño roedor" },
        { palabra: "pato", pista: "Ave que hace 'cuac'" },
        { palabra: "pez", pista: "Vive en el agua" },
        { palabra: "oso", pista: "Animal grande que hiberna" },
        { palabra: "zorro", pista: "Rojo y muy astuto" },
        { palabra: "rana", pista: "Amfibio verde que salta" },
        { palabra: "burro", pista: "Famoso por ser terco" },
        { palabra: "cebra", pista: "Rayas blancas y negras" },
        { palabra: "leon", pista: "Rey de la selva" },
        { palabra: "pezon", pista: "Ops, corrige si quieres 😂" },
        { palabra: "cabra", pista: "Trepa montañas con facilidad" },
        { palabra: "puma", pista: "Felino ágil americano" },
        { palabra: "pollo", pista: "Ave amarilla común en granjas" },
        { palabra: "zorra", pista: "Hembra del zorro" }
      ],

      medio: [
        { palabra: "aguila", pista: "Ave con excelente visión" },
        { palabra: "camello", pista: "Tiene jorobas" },
        { palabra: "hipopotamo", pista: "Animal grande que vive en ríos" },
        { palabra: "orangutan", pista: "Gran simio pelirrojo" },
        { palabra: "pantera", pista: "Felino negro" },
        { palabra: "pinguino", pista: "Ave que no vuela y vive en frío" },
        { palabra: "jaguar", pista: "Felino grande de América" },
        { palabra: "colibri", pista: "Ave diminuta que aletea rápido" },
        { palabra: "mantarraya", pista: "Nada como si volara bajo el agua" },
        { palabra: "delfin", pista: "Muy inteligente y vive en el mar" },
        { palabra: "avestruz", pista: "Ave más grande, no vuela" },
        { palabra: "camaleon", pista: "Cambia de color" },
        { palabra: "alce", pista: "Ciervo de gran tamaño" },
        { palabra: "tortuga", pista: "Caparazón protector" },
        { palabra: "serpiente", pista: "Reptil sin patas" },
        { palabra: "halcon", pista: "Cazador aéreo muy rápido" },
        { palabra: "bufalo", pista: "Animal robusto con cuernos" },
        { palabra: "koala", pista: "Duerme casi todo el día" },
        { palabra: "medusa", pista: "Flota y puede picar" },
        { palabra: "cocodrilo", pista: "Reptil peligroso de ríos" }
      ],

      dificil: [
        { palabra: "ornitorrinco", pista: "Mamífero con pico" },
        { palabra: "axolote", pista: "Salamandra mexicana que siempre sonríe" },
        { palabra: "okapi", pista: "Parecido a jirafa pero rayado como cebra" },
        { palabra: "narval", pista: "Ballena con colmillo largo" },
        { palabra: "quokka", pista: "Animal australiano que 'sonríe'" },
        { palabra: "caracal", pista: "Felino con orejas puntiagudas" },
        { palabra: "gnu", pista: "Antílope africano" },
        { palabra: "pangolin", pista: "Mamífero con escamas" },
        { palabra: "cacomixtle", pista: "Mamífero nocturno mexicano" },
        { palabra: "galago", pista: "Pequeño primate saltador" },
        { palabra: "ocelote", pista: "Felino manchado" },
        { palabra: "alceblanco", pista: "Raro tipo de alce" },
        { palabra: "dragondemar", pista: "Pez con forma de planta" },
        { palabra: "equidna", pista: "Mamífero que pone huevos" },
        { palabra: "urogalos", pista: "Ave galliforme del norte" }
      ]
    },
    paises: {
      facil: [
        { palabra: "colombia", pista: "Café y sabor latino" },
        { palabra: "mexico", pista: "Tacos y mariachi" },
        { palabra: "peru", pista: "Machu Picchu" },
        { palabra: "chile", pista: "País largo y angosto" },
        { palabra: "argentina", pista: "Tierra del tango" },
        { palabra: "brasil", pista: "Carnaval y samba" },
        { palabra: "canada", pista: "Mucho frío y arce" },
        { palabra: "espana", pista: "Paella y flamenco" },
        { palabra: "japon", pista: "Samuráis y anime" },
        { palabra: "china", pista: "Gran Muralla" },
        { palabra: "italia", pista: "Pizza y pasta" },
        { palabra: "egipto", pista: "Faraones y pirámides" },
        { palabra: "alemania", pista: "Ingeniería y cerveza" },
        { palabra: "francia", pista: "Torre Eiffel" },
        { palabra: "india", pista: "Taj Mahal" },
        { palabra: "rusia", pista: "País más grande del mundo" },
        { palabra: "corea", pista: "K-pop y tecnología" },
        { palabra: "portugal", pista: "Famoso por su vino" },
        { palabra: "grecia", pista: "Cuna de la filosofía" },
        { palabra: "cuba", pista: "Isla del Caribe" }
      ],

      medio: [
        { palabra: "nigeria", pista: "País más poblado de África" },
        { palabra: "finlandia", pista: "Tierras de mil lagos" },
        { palabra: "suecia", pista: "IKEA y ABBA" },
        { palabra: "noruega", pista: "Famosa por sus fiordos" },
        { palabra: "polonia", pista: "Varsovia es su capital" },
        { palabra: "marruecos", pista: "Mercados y desierto" },
        { palabra: "ucrania", pista: "País grande de Europa del este" },
        { palabra: "turquia", pista: "Entre Asia y Europa" },
        { palabra: "vietnam", pista: "Conocido por su comida callejera" },
        { palabra: "australia", pista: "Canguros y koalas" },
        { palabra: "singapur", pista: "Una isla-ciudad futurista" },
        { palabra: "hungria", pista: "Su capital tiene baños termales" },
        { palabra: "belgica", pista: "Famosa por chocolate y waffles" },
        { palabra: "holanda", pista: "Tulipanes y molinos" },
        { palabra: "etiopia", pista: "Café y maratones" },
        { palabra: "pakistan", pista: "Himalaya y cultura islámica" },
        { palabra: "islandia", pista: "Volcanes y auroras" },
        { palabra: "malasia", pista: "Torres Petronas" },
        { palabra: "jordania", pista: "Ciudad de Petra" },
        { palabra: "filipinas", pista: "Archipiélago con miles de islas" }
      ],

      dificil: [
        { palabra: "azerbaiyan", pista: "País del Cáucaso con mucho petróleo" },
        { palabra: "kirguistan", pista: "Montañoso en Asia Central" },
        { palabra: "uzbekistan", pista: "Ruta de la Seda" },
        { palabra: "tanzania", pista: "Monte Kilimanjaro" },
        { palabra: "mauritania", pista: "Gran parte es desierto" },
        { palabra: "papuanuevaguinea", pista: "Muchos idiomas y selvas" },
        { palabra: "liechtenstein", pista: "Pequeño principado europeo" },
        { palabra: "luxemburgo", pista: "País pequeño muy rico" },
        { palabra: "eslovenia", pista: "Tiene el lago Bled" },
        { palabra: "eslovaquia", pista: "Europa central, castillos y montes" },
        { palabra: "montenegro", pista: "País costero en los Balcanes" },
        { palabra: "barbados", pista: "Isla natal de Rihanna" },
        { palabra: "butan", pista: "Reino en el Himalaya" },
        { palabra: "brunei", pista: "Pequeño y muy petrolero" },
        { palabra: "samoa", pista: "Islas del Pacífico Sur" }
      ]
    },



    transporte: {
      facil: [
        { palabra: "bus", pista: "Transporte público grande" },
        { palabra: "taxi", pista: "Carro amarillo en muchas ciudades" },
        { palabra: "tren", pista: "Corre sobre rieles" },
        { palabra: "metro", pista: "Tren subterráneo" },
        { palabra: "bici", pista: "Tiene dos ruedas y pedales" },
        { palabra: "barco", pista: "Navega por el agua" },
        { palabra: "canoa", pista: "Bote pequeño que se rema" },
        { palabra: "moto", pista: "Vehículo de dos ruedas con motor" },
        { palabra: "lancha", pista: "Barca pequeña con motor" },
        { palabra: "avion", pista: "Vuelo comercial o privado" },
        { palabra: "yate", pista: "Barco lujoso" },
        { palabra: "camion", pista: "Vehículo grande para carga" },
        { palabra: "tractor", pista: "Máquina usada en campos" },
        { palabra: "helice", pista: "Parte que impulsa aviones pequeños" },
        { palabra: "cohete", pista: "Va al espacio" },
        { palabra: "globo", pista: "Vuelo aerostático" },
        { palabra: "patin", pista: "Tiene ruedas pequeñas" },
        { palabra: "trineo", pista: "Se usa sobre nieve" },
        { palabra: "kayak", pista: "Embarcación ligera" },
        { palabra: "ferrocarril", pista: "Sistema completo de trenes" }
      ],
      medio: [
        { palabra: "gondola", pista: "Barca típica de Venecia" },
        { palabra: "funicular", pista: "Vehículo que sube montañas con cable" },
        { palabra: "dirigible", pista: "Aeronave gigante con gas" },
        { palabra: "catamaran", pista: "Barco con dos cascos" },
        { palabra: "triciclo", pista: "Vehículo de tres ruedas" },
        { palabra: "patineta", pista: "Tabla con ruedas" },
        { palabra: "bicicleta", pista: "Vehículo de dos ruedas sin motor" },
        { palabra: "caravana", pista: "Casa rodante" },
        { palabra: "limusina", pista: "Vehículo largo y elegante" },
        { palabra: "remolque", pista: "Se engancha para transportar cosas" },
        { palabra: "anfibio", pista: "Va por tierra y agua" },
        { palabra: "planeador", pista: "Vuela sin motor" },
        { palabra: "motocross", pista: "Moto de terreno difícil" },
        { palabra: "transbordo", pista: "Cambio de vehículo en viaje" },
        { palabra: "carretilla", pista: "Usada en construcción" },
        { palabra: "monopatin", pista: "Otra forma de decir patineta" },
        { palabra: "carruaje", pista: "Tirado por caballos" },
        { palabra: "scooter", pista: "Pequeña moto urbana" },
        { palabra: "hidroavion", pista: "Aterriza en agua" },
        { palabra: "semirremolque", pista: "Parte de un camión de carga" }
      ],
      dificil: [
        { palabra: "transatlantico", pista: "Barco gigante de pasajeros" },
        { palabra: "helicoidal", pista: "Movimiento usado en hélices" },
        { palabra: "zeppelin", pista: "Aeronave enorme del siglo XX" },
        { palabra: "motoniveladora", pista: "Maquinaria pesada vial" },
        { palabra: "retroexcavadora", pista: "Equipo grande para excavar" },
        { palabra: "transbordador", pista: "Nave espacial para tripulación" },
        { palabra: "anfibologico", pista: "Algo que puede ir en distintos medios" },
        { palabra: "veleroplano", pista: "Avión que usa velas" },
        { palabra: "autogiro", pista: "Aeronave con rotor libre" },
        { palabra: "monociclo", pista: "Con una sola rueda" },
        { palabra: "trolebus", pista: "Bus eléctrico con cables" },
        { palabra: "motonieve", pista: "Vehículo para nieve" },
        { palabra: "maglev", pista: "Tren de levitación magnética" },
        { palabra: "palanquin", pista: "Transporte antiguo cargado por personas" },
        { palabra: "deslizador", pista: "Vehículo que se impulsa sobre agua/hielo" }
      ]
    },

    carros: {
      facil: [
        { palabra: "sedan", pista: "Carro común de cuatro puertas" },
        { palabra: "taxi", pista: "Transporte público" },
        { palabra: "jeep", pista: "Vehículo fuerte para montaña" },
        { palabra: "buggy", pista: "Carro para arena" },
        { palabra: "fiesta", pista: "Modelo famoso de Ford" },
        { palabra: "logan", pista: "Modelo popular de Renault" },
        { palabra: "aveo", pista: "Modelo famoso de Chevrolet" },
        { palabra: "clio", pista: "Modelo pequeño de Renault" },
        { palabra: "gol", pista: "Modelo clásico de Volkswagen" },
        { palabra: "focus", pista: "Modelo de Ford" },
        { palabra: "duster", pista: "SUV de Renault" },
        { palabra: "camion", pista: "Vehículo de carga" },
        { palabra: "pickup", pista: "Carro con platón" },
        { palabra: "coupe", pista: "Carro deportivo de dos puertas" },
        { palabra: "honda", pista: "Marca japonesa" },
        { palabra: "nissan", pista: "Marca japonesa" },
        { palabra: "mazda", pista: "Marca japonesa" },
        { palabra: "tesla", pista: "Carros eléctricos" },
        { palabra: "kia", pista: "Marca coreana" },
        { palabra: "hyundai", pista: "Marca coreana" }
      ],
      medio: [
        { palabra: "corvette", pista: "Deportivo clásico estadounidense" },
        { palabra: "mustang", pista: "Icónico carro de Ford" },
        { palabra: "camaro", pista: "Deportivo de Chevrolet" },
        { palabra: "cayenne", pista: "SUV de Porsche" },
        { palabra: "polo", pista: "Modelo compacto de VW" },
        { palabra: "twingo", pista: "Modelo urbano pequeño" },
        { palabra: "sandero", pista: "Modelo económico popular" },
        { palabra: "mercedes", pista: "Marca de lujo" },
        { palabra: "bugatti", pista: "Marca de hiperautos" },
        { palabra: "lamborghini", pista: "Marca de superdeportivos" },
        { palabra: "ferrari", pista: "Marca italiana famosa" },
        { palabra: "maserati", pista: "Marca italiana de lujo" },
        { palabra: "alfaromeo", pista: "Marca deportiva italiana" },
        { palabra: "volkswagen", pista: "Famosa marca alemana" },
        { palabra: "subaru", pista: "Marca reconocida por AWD" },
        { palabra: "koenigsegg", pista: "Marca sueca de hiperautos" },
        { palabra: "mclaren", pista: "Deportivos ingleses" },
        { palabra: "rollsroyce", pista: "Marca ultra lujosa" },
        { palabra: "bentley", pista: "Marca inglesa de lujo" },
        { palabra: "aston", pista: "Aston Martin (abreviado)" }
      ],
      dificil: [
        { palabra: "aventador", pista: "Modelo top de Lamborghini" },
        { palabra: "chiron", pista: "Hiperauto de Bugatti" },
        { palabra: "huayra", pista: "Superdeportivo de Pagani" },
        { palabra: "agera", pista: "Modelo famoso de Koenigsegg" },
        { palabra: "senna", pista: "McLaren de homenaje" },
        { palabra: "reventon", pista: "Lambo edición limitada" },
        { palabra: "superleggera", pista: "Versión ligera de Lamborghini" },
        { palabra: "speedtail", pista: "Híbrido de McLaren" },
        { palabra: "centodieci", pista: "Bugatti edición limitada" },
        { palabra: "jesko", pista: "Koenigsegg avanzado" },
        { palabra: "zonda", pista: "Modelo icónico de Pagani" },
        { palabra: "miura", pista: "Clásico Lamborghini" },
        { palabra: "diablo", pista: "Superdeportivo de los 90s" },
        { palabra: "murcielago", pista: "Modelo legendario de Lamborghini" },
        { palabra: "countach", pista: "Famoso superauto retro" }
      ]
    },

    deportes: {
      facil: [
        { palabra: "futbol", pista: "Deporte más popular del mundo." },
        { palabra: "tenis", pista: "Se juega con raquetas y una pelota amarilla." },
        { palabra: "boxeo", pista: "Deporte de combate con guantes." },
        { palabra: "ajedrez", pista: "Deporte mental con tablero y piezas." },
        { palabra: "natacion", pista: "Se practica en una piscina." },
        { palabra: "baloncesto", pista: "Balón y aro" },
        { palabra: "ciclismo", pista: "Deporte en bicicleta." },
        { palabra: "voley", pista: "Dos equipos separados por una red." },
        { palabra: "gimnasia", pista: "Deporte de equilibrio y acrobacias." },
        { palabra: "golf", pista: "Se usa un palo para golpear una pelota pequeña." },
        { palabra: "karate", pista: "Arte marcial" },
        { palabra: "rugby", pista: "Contacto y try" },
        { palabra: "surf", pista: "Sobre olas" },
        { palabra: "patinaje", pista: "Hielo o ruedas" },
        { palabra: "esgrima", pista: "Con espadas" },
        { palabra: "billar", pista: "Tacos y bolas" },
        { palabra: "pesca", pista: "Actividad y deporte" },
        { palabra: "bowling", pista: "Derribar pinos" },
        { palabra: "halterofilia", pista: "Levantar pesas" },
        { palabra: "pingpong", pista: "Tenis de mesa" }
      ],
      medio: [
        { palabra: "handball", pista: "Similar a fútbol pero con manos." },
        { palabra: "waterpolo", pista: "Deporte acuático por equipos." },
        { palabra: "taekwondo", pista: "Arte marcial coreano." },
        { palabra: "remo", pista: "Remar en bote" },
        { palabra: "parkour", pista: "Superar obstáculos" },
        { palabra: "triatlon", pista: "Nadar, pedalear y correr." },
        { palabra: "softbol", pista: "Versión del béisbol con pelota grande." },
        { palabra: "kickboxing", pista: "Golpes y patadas" },
        { palabra: "escalada", pista: "Subir paredes" },
        { palabra: "crossfit", pista: "Entrenamiento functional" },
        { palabra: "motocross", pista: "Motos en tierra" },
        { palabra: "skateboard", pista: "Tabla con ruedas" },
        { palabra: "beisbol", pista: "Bate y guante" },
        { palabra: "esqui", pista: "Nieve y esquís" },
        { palabra: "bmx", pista: "Bicicleta acrobática" },
        { palabra: "rafting", pista: "Descenso en ríos" },
        { palabra: "maraton", pista: "42 kilómetros" },
        { palabra: "hockey", pista: "Stick y disco/bola" },
        { palabra: "lacrosse", pista: "Balón en red pequeña" },
        { palabra: "triathlon", pista: "Otra forma de triatlón" }
      ],
      dificil: [
        { palabra: "windsurf", pista: "Tabla con vela" },
        { palabra: "biatlon", pista: "Esquí y tiro" },
        { palabra: "criquet", pista: "Muy popular en India" },
        { palabra: "curling", pista: "Piedras en hielo" },
        { palabra: "parapente", pista: "Volar con vela" },
        { palabra: "ultramaraton", pista: "Más que un maratón" },
        { palabra: "decatlon", pista: "Diez pruebas" },
        { palabra: "skyrunning", pista: "Correr en altura" },
        { palabra: "breakdance", pista: "Baile deportivo" },
        { palabra: "enduro", pista: "Motociclismo de resistencia" }
      ]
    },

    geografia: {
      facil: [
        { palabra: "rio", pista: "Curso natural de agua." },
        { palabra: "lago", pista: "Cuerpo de agua dulce." },
        { palabra: "mar", pista: "Gran extensión de agua salada." },
        { palabra: "isla", pista: "Territorio rodeado de agua." },
        { palabra: "bosque", pista: "Zona con muchos árboles." },
        { palabra: "desierto", pista: "Lugar muy seco y arenoso." },
        { palabra: "valle", pista: "Terreno entre montañas." },
        { palabra: "colina", pista: "Elevación suave del terreno." },
        { palabra: "volcan", pista: "Montaña que expulsa lava." },
        { palabra: "oceano", pista: "Cuerpo de agua más grande." },
        { palabra: "playa", pista: "Lugar con arena junto al mar." },
        { palabra: "selva", pista: "Región tropical con mucha vegetación." },
        { palabra: "ciudad", pista: "Zona urbana con muchos edificios." },
        { palabra: "pueblo", pista: "Comunidad pequeña y tranquila." },
        { palabra: "campo", pista: "Zona rural con naturaleza." },
        { palabra: "costa", pista: "Donde el mar toca la tierra." },
        { palabra: "cumbre", pista: "Pico de una montaña." },
        { palabra: "gruta", pista: "Cueva natural." },
        { palabra: "bahia", pista: "Entrada del mar rodeada por tierra." },
        { palabra: "clima", pista: "Condiciones atmosféricas" }
      ],
      medio: [
        { palabra: "archipielago", pista: "Conjunto de islas." },
        { palabra: "cordillera", pista: "Cadena de montañas." },
        { palabra: "peninsula", pista: "Tierra rodeada por agua 3 lados." },
        { palabra: "altiplano", pista: "Meseta de gran altura." },
        { palabra: "glaciar", pista: "Masa de hielo que se desplaza." },
        { palabra: "meseta", pista: "Zona elevada y plana." },
        { palabra: "tundra", pista: "Región fría sin árboles." },
        { palabra: "sismologia", pista: "Estudio de terremotos." },
        { palabra: "erosion", pista: "Desgaste del suelo." },
        { palabra: "humedal", pista: "Terreno inundado." },
        { palabra: "delta", pista: "Desembocadura ramificada" },
        { palabra: "meridiano", pista: "Línea norte-sur" },
        { palabra: "paralelo", pista: "Línea este-oeste" },
        { palabra: "altitud", pista: "Altura respecto al mar" },
        { palabra: "latitud", pista: "Distancia al ecuador" },
        { palabra: "cartografia", pista: "Hacer mapas" },
        { palabra: "monzon", pista: "Vientos estacionales" },
        { palabra: "catarata", pista: "Cascada grande" },
        { palabra: "isoterma", pista: "Línea de igual temperatura" },
        { palabra: "bioma", pista: "Gran comunidad ecológica" }
      ],
      dificil: [
        { palabra: "permafrost", pista: "Suelo congelado permanentemente." },
        { palabra: "antropoceno", pista: "Era marcada por impacto humano." },
        { palabra: "isotermas", pista: "Líneas de igual temperatura." },
        { palabra: "paleoclima", pista: "Climas antiguos." },
        { palabra: "orogenesis", pista: "Formación de montañas." },
        { palabra: "litosfera", pista: "Capa sólida superior." },
        { palabra: "tectonica", pista: "Movimiento de placas." },
        { palabra: "albedo", pista: "Reflexión solar." },
        { palabra: "hidrosfera", pista: "Conjunto de aguas del planeta." },
        { palabra: "endorreico", pista: "Ríos que no llegan al mar." },
        { palabra: "estuario", pista: "Encuentro agua dulce-salada." },
        { palabra: "barlovento", pista: "Lado al que llega el viento." },
        { palabra: "sotavento", pista: "Lado protegido del viento." }
      ]
    },

    comida: {
      facil: [
        { palabra: "pizza", pista: "Comida italiana con queso y salsa." },
        { palabra: "hamburguesa", pista: "Pan, carne y acompañantes." },
        { palabra: "arroz", pista: "Grano blanco muy consumido." },
        { palabra: "pollo", pista: "Carne blanca muy común." },
        { palabra: "pan", pista: "Acompaña la mayoría de comidas." },
        { palabra: "pasta", pista: "Creación italiana de harina." },
        { palabra: "sopa", pista: "Comida líquida caliente." },
        { palabra: "manzana", pista: "Fruta roja o verde." },
        { palabra: "platano", pista: "Fruta larga amarilla." },
        { palabra: "queso", pista: "Derivado de la leche." },
        { palabra: "huevo", pista: "Alimento ovalado de gallina." },
        { palabra: "cafe", pista: "Bebida de granos tostados." },
        { palabra: "ensalada", pista: "Mezcla fresca de verduras." },
        { palabra: "agua", pista: "Bebida esencial para la vida." },
        { palabra: "limonada", pista: "Bebida refrescante amarilla." },
        { palabra: "empanada", pista: "Masa rellena frita o al horno." },
        { palabra: "arepa", pista: "Comida típica de maíz." },
        { palabra: "fresas", pista: "Frutas rojas pequeñas." },
        { palabra: "torta", pista: "Dulce para celebraciones." },
        { palabra: "salchipapa", pista: "Papas fritas con salchicha." }
      ],
      medio: [
        { palabra: "sushi", pista: "Comida japonesa con arroz y pescado." },
        { palabra: "ramen", pista: "Sopa japonesa con fideos." },
        { palabra: "ceviche", pista: "Plato de pescado cocinado en limón." },
        { palabra: "asado", pista: "Carne preparada a la parrilla." },
        { palabra: "lasagna", pista: "Capas de pasta con queso." },
        { palabra: "risotto", pista: "Arroz cremoso italiano." },
        { palabra: "gnocchi", pista: "Pasta de papa italiana." },
        { palabra: "paella", pista: "Plato español con arroz y mariscos." },
        { palabra: "falafel", pista: "Croquetas de garbanzo." },
        { palabra: "shawarma", pista: "Carne en pan árabe." },
        { palabra: "brownie", pista: "Pastel de chocolate." },
        { palabra: "tamal", pista: "Masa envuelta en hoja." },
        { palabra: "empanadilla", pista: "Versión española de empanada." },
        { palabra: "banoffee", pista: "Postre de banana y toffee." },
        { palabra: "alfajor", pista: "Dulce argentino con dulce de leche." },
        { palabra: "mozzarella", pista: "Queso italiano suave." },
        { palabra: "ratatouille", pista: "Platillo francés de vegetales." },
        { palabra: "birria", pista: "Platillo mexicano de carne cocida." },
        { palabra: "tiramisu", pista: "Postre italiano con café." },
        { palabra: "guacamole", pista: "Crema de aguacate." }
      ],
      dificil: [
        { palabra: "kimchi", pista: "Col fermentada coreana." },
        { palabra: "sashimi", pista: "Pescado crudo sin arroz." },
        { palabra: "souffle", pista: "Plato muy esponjoso francés." },
        { palabra: "galaktoboureko", pista: "Postre griego complicado." },
        { palabra: "bouillabaisse", pista: "Sopa de pescado francesa." },
        { palabra: "yakitori", pista: "Brochetas japonesas." },
        { palabra: "pannacotta", pista: "Postre italiano cremoso." },
        { palabra: "moussaka", pista: "Platillo griego con berenjena." },
        { palabra: "couscous", pista: "Sémola del norte de África." },
        { palabra: "fondue", pista: "Queso derretido para mojar." }
      ]
    },

    literatura: {
      facil: [
        { palabra: "poema", pista: "Texto escrito en verso." },
        { palabra: "cuento", pista: "Historia corta." },
        { palabra: "novela", pista: "Narración larga." },
        { palabra: "autor", pista: "Persona que escribe libros." },
        { palabra: "libro", pista: "Conjunto de páginas." },
        { palabra: "fabula", pista: "Historia con moraleja." },
        { palabra: "mito", pista: "Relato tradicional." },
        { palabra: "leyenda", pista: "Historia transmitida por generaciones." },
        { palabra: "soneto", pista: "Poema de 14 versos." },
        { palabra: "prologo", pista: "Texto introductorio." },
        { palabra: "epilogo", pista: "Texto final." },
        { palabra: "capitulo", pista: "Sección de un libro." },
        { palabra: "dialogo", pista: "Conversación escrita." },
        { palabra: "tragedia", pista: "Obra con final triste." },
        { palabra: "comedia", pista: "Obra de humor." },
        { palabra: "drama", pista: "Género teatral serio." },
        { palabra: "relato", pista: "Narración breve." },
        { palabra: "verso", pista: "Línea de un poema." },
        { palabra: "epica", pista: "Poema heroico" },
        { palabra: "farsa", pista: "Obra cómica corta" }
      ],
      medio: [
        { palabra: "metafora", pista: "Figura literaria comparativa." },
        { palabra: "sinopsis", pista: "Resumen de una obra." },
        { palabra: "manuscrito", pista: "Texto escrito a mano." },
        { palabra: "editorial", pista: "Empresa que publica libros." },
        { palabra: "ficcion", pista: "Relato imaginario." },
        { palabra: "ensayo", pista: "Texto argumentativo." },
        { palabra: "critica", pista: "Análisis de una obra." },
        { palabra: "narrador", pista: "Quien cuenta la historia." },
        { palabra: "epopeya", pista: "Poema extenso y heroico." },
        { palabra: "protagonista", pista: "Personaje principal." },
        { palabra: "antagonista", pista: "Personaje opositor." },
        { palabra: "genero", pista: "Tipo de literatura." },
        { palabra: "ambientacion", pista: "Lugar y tiempo de la historia." },
        { palabra: "trama", pista: "Lo que sucede en la obra." },
        { palabra: "hiperbole", pista: "Exageración literaria." },
        { palabra: "paradoja", pista: "Contradicción aparente." },
        { palabra: "versificacion", pista: "Medición de versos." },
        { palabra: "alegoria", pista: "Representación simbólica." },
        { palabra: "metonimia", pista: "Sustitución por relación" },
        { palabra: "aliteracion", pista: "Repetición de sonidos" }
      ],
      dificil: [
        { palabra: "intertextualidad", pista: "Relación entre obras." },
        { palabra: "onomatopeya", pista: "Imitación de sonidos." },
        { palabra: "oximoron", pista: "Unión de términos opuestos." },
        { palabra: "polifonia", pista: "Voces múltiples en un texto." },
        { palabra: "hiperbaton", pista: "Alteración del orden de palabras." },
        { palabra: "prosopopeya", pista: "Dar cualidades humanas a lo no humano." },
        { palabra: "sinestesia", pista: "Mezcla de sentidos." },
        { palabra: "metatexto", pista: "Texto que habla de otro texto." },
        { palabra: "parnasianismo", pista: "Movimiento poético francés." },
        { palabra: "ultraismo", pista: "Vanguardia literaria." }
      ]
    }
  };

const router = useRouter();
const categoria = localStorage.getItem("categoria") || "";
const nivel = localStorage.getItem("nivel") || "";
const palabra = ref (null);
const pista = ref("");
const usadas = ref([]);
const fallos = ref(0);
const letras = "abcdefghijklmnopqrstuvwxyz".split("");
const tiempo = ref(0);
let intervalo = null;

function seleccionarPalabraSegura() {
  if (!categoria || !nivel || !palabrasAhorcado[categoria] || !palabrasAhorcado[categoria][nivel]) {
    alert("Categoría o nivel inválido. Regresando...");
    router.push("/categoria");
    return false;
  }

  const lista = palabrasAhorcado[categoria][nivel];

  if (!Array.isArray(lista) || lista.length === 0) {
    alert("No hay palabras disponibles.");
    router.push("/categoria");
    return false;
  }

  const seleccionada = lista[Math.floor(Math.random() * lista.length)];

  palabra.value = seleccionada.palabra.toLowerCase();
  pista.value = seleccionada.pista || "";

  return true;
}

const mostrarPista = computed(() => {
  if (nivel === "facil") return true;
  if (nivel === "medio") return true;
  if (nivel === "dificil") return fallos.value >= 3;
  return false;
});

const palabraMostrada = computed(() => {
  if (!palabra.value) return "";
  return palabra.value
    .split("")
    .map((l) => (usadas.value.includes(l) ? l : "_"))
    .join(" ");
});

const ganaste = computed(() => palabra.value && palabraMostrada.value.replace(/ /g, "") === palabra.value);
const perdiste = computed(() => fallos.value >= 7);
const terminado = computed(() => ganaste.value || perdiste.value);

function intentar(letra) {
  letra = letra.toLowerCase();

  if (usadas.value.includes(letra) || terminado.value) return;

  usadas.value.push(letra);

  if (!palabra.value.includes(letra)) {
    fallos.value++;
  }

  if (terminado.value) {
    clearInterval(intervalo);

    const jugador = localStorage.getItem("jugador") || "Jugador"; // ✅ aquí
    const gano = ganaste.value;

    const entrada = {
      jugador,
      categoria,
      nivel,
      tiempo: tiempo.value,
      palabra: palabra.value,
      gano,
    };

    const podio = JSON.parse(localStorage.getItem("podioAhorcado") || "[]");
    podio.push(entrada);
    localStorage.setItem("podioAhorcado", JSON.stringify(podio));

    setTimeout(() => router.push("/podio"), 800);
  }
}


watch(
  () => router.fullPath,
  () => {
    usadas.value = [];
    fallos.value = 0;
    tiempo.value = 0;

    if (!seleccionarPalabraSegura()) return;

    clearInterval(intervalo);
    intervalo = setInterval(() => (tiempo.value += 1), 1000);
  },
  { immediate: true }
);
</script>
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

.juego-page {
  padding: 20px;
  color: #f0f0f0;
  min-height: 100vh;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-row {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 900px;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 204, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
  position: relative;
  overflow: hidden;

}

.info-row h1 {
  font-size: 15px;
  font-weight: 900;
  margin: 0 0 15px 0;
  color: #00ffcc;
  text-shadow: 0 0 10px #00ffcc;
  text-transform: uppercase;
}


.info-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  flex-wrap: wrap;
}

.info-row h2 {
  font-weight: 400;
  font-size: 1rem;
  color: #ffffff;
}

.info-row .timer {
  font-size: 1rem;
  color: #ff00ff;
  font-weight: 700;
  text-shadow: 0 0 10px #ff00ff;
}


.contenido {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 80px;
  width: 100%;
  max-width: 1200px;
}


.robot {
  width: 450px;
  height: 500px;
  position: relative;
  filter: drop-shadow(0 0 15px rgba(0, 255, 204, 0.5));
}

.parte {
  position: absolute;
}

.base {
  width: 450px;
  bottom: 0;
}

.cabeza {
  top: 155px;
  left: 51%;
  transform: translateX(-50%);
  width: 160px;
}

.torso {
  top: 169px;
  left: 51%;
  transform: translateX(-50%);
  width: 230px;
}

.brazo-izq {
  top: 257px;
  left: 29%;
  width: 100px;
}

.brazo-der {
  top: 275px;
  left: 50%;
  width: 90px;
}

.cadera {
  top: 222px;
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
}

.pierna-izq {
  top: 260px;
  left: 18%;
  width: 250px;
}

.pierna-der {
  top: 330px;
  left: 35%;
  width: 150px;
}

.panel-derecho {
  text-align: center;
  width: 450px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid rgba(255, 0, 255, 0.3);
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.pista {
  background: rgba(0, 255, 204, 0.1);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #00ffcc;
  border: 1px solid rgba(0, 255, 204, 0.5);
  font-size: 0.9rem;
}

.palabra {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 30px 0;
  letter-spacing: 12px;
  color: #ffffff;
  text-shadow: 0 0 8px #ffffff;
}

.letras {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.letras button {
  padding: 12px;
  width: 45px;
  border-radius: 8px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #00ffcc;
  color: #ffffff;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
}

.letras button:hover:not(:disabled) {
  background: rgba(0, 255, 204, 0.2);
  transform: scale(1.1);
  box-shadow: 0 0 10px #00ffcc;
}

.letras button:disabled {
  background: rgba(100, 100, 100, 0.3);
  border-color: #555;
  color: #888;
  cursor: not-allowed;
  transform: scale(1);
}

h3 {
  margin-top: 20px;
  font-weight: 400;
  color: #ccc;
}

.win {
  color: #00ff88;
  font-size: 2.5rem;
  font-weight: 900;
  text-shadow: 0 0 15px #00ff88;
  animation: pulse 1s infinite;
}

.lose {
  color: #ff4466;
  font-size: 2rem;
  font-weight: 900;
  text-shadow: 0 0 15px #ff4466;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}



@media (max-width: 500px) {
  .juego-page {
    padding: 15px;
  }

  .info-row {
    padding: 15px;
    border-radius: 10px;
  }

  .info-row h1 {
    font-size: 1.8rem;
    margin-bottom: 10px;
    animation: glitch 2s infinite;
  }

  .info-row {
    gap: 15px;
  }

  .info-row h2,
  .info-row .timer {
    font-size: 0.85rem;
  }

  .contenido {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .robot {
    width: 280px;
    height: 330px;
  }

  .base {
    width: 280px;
  }

  .cabeza {
    width: 110px;
    top: 110px;
  }

  .torso {
    width: 165px;
    top: 120px;
  }

  .brazo-izq {
    width: 75px;
    top: 185px;
    left: 25%;
  }

  .brazo-der {
    width: 65px;
    top: 195px;
    left: 50%;
  }

  .cadera {
    width: 185px;
    top: 165px;
  }

  .pierna-izq {
    width: 170px;
    top: 185px;
    left: 15%;
  }

  .pierna-der {
    width: 110px;
    top: 230px;
    left: 30%;
  }

  .panel-derecho {
    width: 100%;
    max-width: 400px;
    padding: 20px;
  }

  .palabra {
    font-size: 2.2rem;
    letter-spacing: 7px;
    margin: 20px 0;
  }

  .letras button {
    width: 36px;
    padding: 9px;
    font-size: 0.85rem;
  }


  .info-row ::before,
  .panel-derecho::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: linear-gradient(to bottom,
        transparent 50%,
        rgba(0, 255, 204, 0.03) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 1;
  }
}

@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }

  14% {
    text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), 0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }

  15% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }

  49% {
    text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }

  50% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }

  99% {
    text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }

  100% {
    text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
}


@media (max-width: 800px) {
  .info-row h1 {
    font-size: 1.6rem;
  }

  .palabra {
    font-size: 1.9rem;
    letter-spacing: 5px;
  }

  .letras button {
    width: 32px;
    padding: 8px;
    font-size: 0.8rem;
  }

  .robot {
    width: 250px;
    height: 300px;
  }

  .base {
    width: 250px;
  }

  .cabeza {
    width: 100px;
    top: 100px;
  }

  .torso {
    width: 150px;
    top: 110px;
  }

  .brazo-izq {
    width: 60px;
    top: 170px;
  }

  .brazo-der {
    width: 60px;
    top: 180px;
  }

  .cadera {
    width: 170px;
    top: 150px;
  }

  .pierna-izq {
    width: 150px;
    top: 170px;
  }

  .pierna-der {
    width: 100px;
    top: 210px;
  }
}
</style>