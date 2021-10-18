import { sparqlEscapeUri } from 'mu';
import { querySudo as query, updateSudo as update } from '@lblod/mu-auth-sudo';

export function getSessionIdHeader(request) {
    return request.get('mu-session-id');
};

/**
 * Get the rewrite URL from the request headers
 * 
 * @return {string} The rewrite URL from the request headers
*/
export function getRewriteUrlHeader(request) {
    return request.get('x-rewrite-url');
};

/**
 * Helper function to return an error response
*/
export function error(res, message, status = 400) {
    return res.status(status).json({ errors: [{ title: message }] });
};

export async function selectAccountBySession(session) {
    const accountGraph = process.env.MU_APPLICATION_GRAPH;

    const queryResult = await query(`
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
    SELECT ?account ?accountId
    WHERE {
      GRAPH <http://mu.semte.ch/graphs/sessions> {
          ${sparqlEscapeUri(session)} session:account ?account.
      }
      GRAPH ?g {
          ?account a foaf:OnlineAccount ;
                   mu:uuid ?accountId .
      }
    }`);

    if (queryResult.results.bindings.length) {
        const result = queryResult.results.bindings[0];
        return { accountUri: result.account.value, accountId: result.accountId.value };
    } else {
        return { accountUri: null, accountId: null };
    }
};


export async function selectUserByAccount(accountUri) {
    const queryResult = await query(`
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX session: <http://mu.semte.ch/vocabularies/session/>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    SELECT ?accountIdentifier ?accountId ?accountProvider ?userFirstname ?userFamilyName ?userId
    WHERE {
      GRAPH ?g {
          ${sparqlEscapeUri(accountUri)}  a foaf:OnlineAccount;
                                          mu:uuid ?accountId;
                                          foaf:accountServiceHomepage ?accountProvider.
           optional {${sparqlEscapeUri(accountUri)}  <http://purl.org/dc/terms/identifier> ?accountIdentifier}
          ?person  foaf:account  ${sparqlEscapeUri(accountUri)};
                                 foaf:firstName ?userFirstname;
                                 foaf:familyName ?userFamilyName; mu:uuid ?userId.
    }
}

  `);

    if (queryResult.results.bindings.length) {
        const result = queryResult.results.bindings[0];
        return {
            accountUri: accountUri,
            accountIdentifier: result.accountIdentifier?.value,
            accountProvider: result.accountProvider.value,
            userFirstname: result.userFirstname.value,
            userFamilyName: result.userFamilyName.value,
            userId: result.userId.value,
            accountId: result.accountId.value
        };
    } else {
        return {
            accountUri: null,
            accountIdentifier: null,
            accountProvider: null,
            userFirstname: null,
            userFamilyName: null,
            userId: null,
            accountId: null
        };
    }
}