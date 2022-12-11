import './socket';

import kaboom from 'kaboom';

const k = kaboom({ global: false });


k.loadBean()

k.add([
	k.sprite("bean"),
])
