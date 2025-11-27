# Taily

# 1 INFO WEB APPLICATION

Taily è una web application dedicata ai proprietari di cani che desiderano organizzare incontri con altri amici a quattro zampe, facilitandone la socializzazione nelle aree pubbliche o in spazi privati della proprià città.

1.1 Funzionalità DogOwner
-Creazione di un profilo personale modificabile ed eliminabile, con informazioni sul proprio cane (nome, sesso, taglia, età, bio e avatar)
-Geolocalizzazione automatica che rileva la posizione dell'utente per mostrare eventi nelle vicinanze
-Possibilità di creare post per organizzare incontri specificando: data e ora dell'evento, indirizzo preciso (via, comune, provincia), filtri opzionali (taglia, sesso, età dei cani ammessi) e note aggiuntive
-Sistema di ricerca con filtri per provincia, data, caratteristiche dei cani ammessi
-Iscrizione/cancellazione dalla lista partecipanti di un evento
-Sistema di messaggistica di gruppo istantanea per ogni evento
-Possibilità di seguire altri utenti (following/followers) e visualizzarne i profili

1.2 Funzionalità Admin e Chairman
ADMIN: Accesso completo a tutte le funzionalità amministrative
-Visualizzazione di tutti gli utenti registrati
-Eliminazione profili utente
-Reset password utente (feature)
-Gestione post, segnalazioni e bug
CHAIRMAN: Moderatori con permessi di gestione post e pulizia contenuti
-Visualizzazione e gestione dei bug report e segnalazioni degli utenti
-Eliminazione di post inappropriati
-Pulizia automatica dei post scaduti

# 2 STACK

2.1 Backend
-Java 17

2.1.1 Spring Boot
-Spring Data JPA: Gestione della persistenza e interazione con il database
-Spring Security: Sistema di autenticazione e autorizzazione :
-JWT (JSON Web Token) per autenticazione stateless
-BCrypt per hashing delle password
-Role-based access control (USER, ADMIN, CHAIRMAN)
-Spring WebSocket: Comunicazione in tempo reale bidirezionale
-Spring Messaging: Gestione messaggi STOMP
2.1.2 Database
-JPA/Hibernate: Utilizzo tecnica ORM
-PostgreSQL
2.1.3 Security
-Java JWT: Creazione e validazione token JWT
-JwsFilter: Validazione JWT per richieste HTTP
-JwtChannelInterceptor: Validazione JWT per connessioni WebSocket
2.1.4 Servizi
-Cloudinary
-EmailSender: Sistema personalizzato per invio email
-Validazione input DTO
-Exception Handling: Sistema centralizzato di gestione errori
-Specification Pattern: Query dinamiche a filtri complessi con JPA Specifications

2.2 Frontend
-JavaScript

2.2.1 React
-React 18;
-React Router DOM: Gestione del routing
-React Bootstrap: Framework UI
2.2.2 State Management
-Redux: Gestione centralizzata degli stati
-Redux Persist: Persistenza nel localStorage del browser
2.2.3 Messaging
-Stomp/Stomp.js: Protocollo di messaggistica per comunicazione WebSocket
-SockJS Client: Compatibilità WebSocket cross-browser
-Custom Hooks
2.2.4 Styling
-Sass: Preprocessore CSS per stili personalizzabili e più manutenibili
-Bootstrap 5: Framework CSS per layout responsive
-React Bootstrap Icons
-React Spinners

# 3 DOCUMENTAZIONE API

BASE_URL: http://localhost:3001

3.1 Authentication endpoints
-Registrazione nuovo utente: POST BASE_URL/auth/register
{
"email": "user@example.com",
"password": "password123",
"username": "username",
"dogName": "Fido",
"sex": "MALE",
"size": "MEDIUM",
"age": "ADULT",
"bio": "Descrizione opzionale"
}  
-Login utente POST BASE_URL/auth/login
{
"email": "user@example.com",
"password": "password123"
}

3.2 DogOwner endpoints
NECESSARIO: Authorization: Bearer {JWT_TOKEN}
-Recupero profilo autenticato: GET BASE_URL/dogowners/me
-Aggiorna profilo utente: PUT BASE_URL/dogowners/me
{
"email": "newemail@example.com",
"username": "newusername",
"dogName": "New Dog Name",
"age": "SENIOR",
"bio": "New bio"
}
-Modifica password: PATCH BASE_URL/dogowners/me/password
{
"password": "newPassword123"
}
-Modifica password by admin: PATCH BASE_URL/{id}/password/reset
-Recupera profilo di un altro utente tramite username: GET BASE_URL/dogowners/username/{username} tramite id: GET BASE_URL/dogowners/{id}
-Recupera lista amici dell'utente autenticato: GET BASE_URL/dogowners/me/friends
-Upload avatar utente: PATCH BASE_URL/dogowners/{id}/upload
{
"id": "uuid",
"avatar": "https://cloudinary.com/..."
}
-Elimina account utente: DELETE BASE_URL/dogowners/me

3.3 Post endpoints
NECESSARIO: Authorization: Bearer {JWT_TOKEN}
-Recupera tutti i post: GET BASE_URL/posts/all
-Recupera post in cui l'utente autenticato è author o partecipante : GET BASE_URL/posts
Aggiungiti come partecipante a un evento
-Recupera singolo post tramite id: GET BASE_URL/posts/{id}
-Recupera attraverso filtri: GET BASE_URL/posts/search, BASE_URL/posts/search?provincia=MI&allowedSize=MEDIUM
Query Parameters: - provincia (string, optional): Sigla provincia (es. "MI") - dateFrom (datetime, optional): Data minima evento - allowedSex (enum, optional): MALE, FEMALE - allowedSize (enum, optional): SMALL, MEDIUM, LARGE, SMALL_AND_MEDIUM, MEDIUM_AND_LARGE - allowedAge (enum, optional): JUNIOR, ADULT, SENIOR
-Crea post: POST BASE_URL/posts
{
"street": "Via Roma 1",
"date": "2025-12-01T15:00:00",
"note": "Passeggiata al parco",
"codiceIstat": "001001",
"allowedDogSex": "MALE",
"allowedDogSize": "MEDIUM",
"allowedDogAge": "ADULT"
}
-Elimina proprio post: DELETE BASE_URL/posts/{postId}
-Elimina tutti i post scaduti: DELETE BASE_URL/posts/cleanup
-Aggiungi come partecipante l'utente autenticato: POST BASE_URL/posts/{postId}/guests
-Rimuovi come partecipante l'utente autenticato: DELETE BASE_URL/posts/{postId}/guests
-Elimina post by Admin o Chairman: DELETE BASE_URL/admin/{postId}

3.4 Friends endpoints
NECESSARIO: Authorization: Bearer {JWT_TOKEN}
-Recupero lista followers: GET BASE_URL/friends/followers
-Recupero lista seguiti: GET BASE_URL/friends/following
-Follow dogowner by utente autenticato: POST BASE_URL/friends/{userId}
-Unfollow dogowner by utente autenticato: DELETE BASE_URL/friends/{userId}
-Check amicizia: GET BASE_URL/friends/check/{userId}

3.5 Report endpoints
NECESSARIO: Authorization: Bearer {JWT_TOKEN}
-Crea nuovo report: POST BASE_URL/reports
{
"text": "Report motvazione...",
"postId" : "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
-Recupera tutti i report paginati: GET BASE_URL/reports
-Elimina segnalazione: DELETE BASE_URL/reports/{reportId}

3.6 Chat endpoints
NECESSARIO: Authorization: Bearer {JWT_TOKEN} durante CONNECT
-Recupero storico messaggi di un evento: GET BASE_URL/posts/{postId}/chat
-Creazione e invio messaggio: - CONNESSIONE WebSocket: BASE_URL/ws - Protocol: STOMP over SockJS - SOTTOSCRIZIONE al canale ricezione messaggi: /topic/chat/{postId} - INVIO MESSAGGI: /app/chat/{postId}
{ "text": "Testo messaggio chat..." }
