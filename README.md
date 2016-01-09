## Praece Sails Auth

Token based auth for praece sails applications. Plug and play support for auth0 tokens and automatically disables all destroy endpoints by default.

### Configuration:

```javascript
module.exports.auth = {
	secret: 'secret!',
	audience: 'audience'
}
```

### Policies:

```javascript
module.exports.policies = {
	'*': 'token',
	controller: {
		superSecret: ['token', 'administrator']
	}
}
```