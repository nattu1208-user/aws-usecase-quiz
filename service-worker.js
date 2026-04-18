// AWS ユースケースクイズ Service Worker
// 作成者: Sekimoto Naoto
// 作成日: 2026-04-18
const CACHE_NAME = 'aws-quiz-v2';
const ASSETS = ['/aws-usecase-quiz/','/aws-usecase-quiz/index.html','/aws-usecase-quiz/manifest.json','/aws-usecase-quiz/icons/icon-192.png','/aws-usecase-quiz/icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))); });
self.addEventListener('fetch', e => { e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request))); });
