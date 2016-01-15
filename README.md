## Praece Sails Auth

Token based auth for praece sails applications. Plug and play support for auth0 tokens and automatically disables all destroy endpoints by default.

### Configuration:

```javascript
module.exports.auth = {
	secret: 'secret!',
	audience: 'audience',

	/**
	 * Optional - a function that returns a promise that resolves to the proper user given the
	 * supplied email param. If this function is omitted it will just search the User model for
	 * using the email attribute.
	 */
	findUser: function(email) {
		return Email.findOne({email: email})
			.populate('user')
			.then().get('user');
	}
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