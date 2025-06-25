import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'SSO_Test_Realm',
  clientId: 'book-client-spa',      
});

export default keycloak;