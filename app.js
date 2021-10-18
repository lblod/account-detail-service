import { app,  errorHandler } from 'mu';
import { getSessionIdHeader, selectUserByAccount, error, selectAccountBySession} from './lib/account';

app.get('/accounts/:id', async function (req, res, next) {
  const sessionUri = getSessionIdHeader(req);
  if (!sessionUri)
    return error(res, 'Session header is missing');

  try {
    const { accountUri } = await selectAccountBySession(sessionUri);
    if (!accountUri)
      return error(res, 'Invalid session');

    const user = await selectUserByAccount(accountUri);
    if (!user.accountUri) {
      return error(res, 'User not found');
    }

    return res.status(200).send({
      links: {
        self: `/accounts/${user.accountId}`
      },
      data: {
        type: 'accounts',
        id: user.accountId,
        attributes: {
          provider: user.accountProvider,
          identifier: user.accountIdentifier
        },
        relationships: {
          user: {
            links: { self: `/accounts/${user.accountId}/links/user?include=user`, related: `/accounts/${user.accountId}/user` },
            data: { type: 'users', id: user.userId }
          }
        }
      },
      included: [
        {
          attributes: {
            "first-name": user.userFirstname,
            "family-name": user.userFamilyName
          },
          id: user.userId,
          type: "users",
          relationships: {
            accounts: {
              links: {
                self: `/users/${user.userId}/links/accounts?include=user`,
                related: `/users/${user.userId}/links/accounts`
              }
            }
          }
        }
      ]

    });
  } catch (e) {
    return next(new Error(e.message));
  }

});

app.use(errorHandler);