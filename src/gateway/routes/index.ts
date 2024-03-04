export default [
	{
		name: 'ping',
		controller: (io, socket, data) => {
			console.log('pong', data);
		}
	}
];
