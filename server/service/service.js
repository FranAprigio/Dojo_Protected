const {
	getUserByName,
	getUserById,
	updateUsername,
	getNotasByUserId,
} = require('../data/data');
const { sani } = require('../utils/utils');



exports.getUserByName = async nome => {
	return await getUserByName(nome);
};

exports.updateUsername = async (novo_username, user_id) => {
	const clean = await sani(novo_username)
	return await updateUsername(clean, user_id);
};

exports.getUserById = async user_id => {
	return await getUserById(user_id);
};

exports.getNotasByUserId = async user_id => {
	return await getNotasByUserId(user_id);
};
