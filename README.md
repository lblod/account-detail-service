### account-detail-service

fetch account detail for a logged in user.

#### Usage

`GET /accounts/id`

<strong>Response:</strong>

```
{
	"links": {
		"self": "/accounts/3a91ff60-07c1-4136-ac5e-55cf401e0956"
	},
	"data": {
		"type": "accounts",
		"id": "3a91ff60-07c1-4136-ac5e-55cf401e0956",
		"attributes": {
			"provider": "https://github.com/lblod/mock-login-service"
		},
		"relationships": {
			"user": {
				"links": {
					"self": "/accounts/3a91ff60-07c1-4136-ac5e-55cf401e0956/links/user?include=user",
					"related": "/accounts/3a91ff60-07c1-4136-ac5e-55cf401e0956/user"
				},
				"data": {
					"type": "users",
					"id": "d39fe09e-d339-4e43-8680-dbbcfb3d3470"
				}
			}
		}
	},
	"included": [{
		"attributes": {
			"first-name": "Josephine",
			"family-name": "Putseys"
		},
		"id": "d39fe09e-d339-4e43-8680-dbbcfb3d3470",
		"type": "users",
		"relationships": {
			"accounts": {
				"links": {
					"self": "/users/d39fe09e-d339-4e43-8680-dbbcfb3d3470/links/accounts?include=user",
					"related": "/users/d39fe09e-d339-4e43-8680-dbbcfb3d3470/links/accounts"
				}
			}
		}
	}]
}
```