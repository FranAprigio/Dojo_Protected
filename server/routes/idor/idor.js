const router = require('express').Router();
const { errHandling, verifyToken } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { query } = require('express');
const { getNotasByUserId } = require('../../service/service');

router.use(cookieParser());

const renderData = {};

router.get(
	'/idor',
	errHandling(async (req, res) => {
		const { token } = req.cookies;
		const user_id = await verifyToken(token)
		const usuarioNaoAutenticado = user_id == false;
		if (usuarioNaoAutenticado) {
			res.redirect('/user-not-authenticated');
		} else {
			res.redirect(`idor/notas/`);
		}
	})
);

router.get(
	'/idor/notas',
	errHandling(async (req, res) => {
		const { token } = req.cookies;
		const user_id = await verifyToken(token)
		if (!isNaN(parseInt(user_id))) {
			const { rows } = await getNotasByUserId(user_id);
			renderData.posts = rows;
			res.render('idor', renderData);
		} else {
			res.redirect('/user-not-authenticated');
		}
	})
);

module.exports = router;
