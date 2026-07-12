// sw_SP.js - Lógica lineal de almacenamiento en caché para entorno offline

const CACHE_NAME_SP = 'sendero-cache-v1-SP';

// Archivos estáticos principales a guardar inmediatamente
const urlsToCache_SP = [
    './',
    './index.html',
    './fotos/carrusel.jpg',
    './fotos/carrusel2.jpg',
    './fotos/carrusel3.jpg',
    './fotos/imagen1.jpeg',
    './fotos/imagen2.jpeg',
    './fotos/imagen3.jpeg',
    './fotos/imagen4.jpeg',
    './fotos/imagen5.jpeg',
    './fotos/imagen6.jpeg',
    './fotos/imagen7.jpeg',
    './fotos/imagen8.jpeg',
    './fotos/imagen9.jpeg',
    './fotos/mirador.jpg',
    './fotos/mirador2.jpg',
    './fotos/telescopio.jpg',
    './fotos/letrero.jpg',
];

// 1. Fase de Instalación: Carga inicial directa a la memoria del dispositivo
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME_SP)
        .then(function(cache) {
            console.log('Caché SP abierto. Guardando archivos base...');
            return cache.addAll(urlsToCache_SP);
        })
    );
});

// 2. Fase de Petición (Fetch): Lógica directa para interceptar el tráfico
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Si el archivo ya está en la caché local, se devuelve de inmediato (Offline)
            if (response) {
                return response;
            }
            
            // Lógica secuencial: Si no está, lo busca en internet y guarda una copia
            return fetch(event.request).then(function(networkResponse) {
                // Verificación de validez de la respuesta
                if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                
                // Se clona la respuesta para guardarla en caché y entregarla a la pantalla simultáneamente
                let responseToCache_SP = networkResponse.clone();
                caches.open(CACHE_NAME_SP)
                .then(function(cache) {
                    // Guarda imágenes del mapa o nuevas fotos sobre la marcha
                    cache.put(event.request, responseToCache_SP);
                });
                
                return networkResponse;
            });
        })
    );
});