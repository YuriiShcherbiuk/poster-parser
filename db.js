import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const app = initializeApp({
    credential: cert({
        type: '',
        project_id: '',
        private_key_id: '',
        private_key: '',
        client_email: '',
        client_id: '',
        auth_uri: '',
        token_uri: '',
        auth_provider_x509_cert_url: '',
        client_x509_cert_url: '',
    }),
    databaseURL: '',
});

const db = getDatabase(app);

function getDomain() {
    return db.ref(`/domain/`).get();
}

function getPoster(id) {
    return db.ref(`/posters/${id}/`).get();
}

function getPosters() {
    return db.ref('/posters/').get();
}

function setData(data) {
    return db.ref(`/`).update(data);
}

export { getDomain, getPoster, getPosters, setData };
