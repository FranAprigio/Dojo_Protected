const router = require('express').Router();
const { errHandling, verifyToken } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserById, updateUsername } = require('../../service/service');
const jwt = require("jsonwebtoken")
const csurf = require("csurf")

var csurfProtect = csurf({cookie:true})

router.use(cookieParser());

const renderData = {};

router.get(
	'/csrf-post',
	errHandling(async (req, res) => {
		const { token } = req.cookies;
		const user_id = await verifyToken(token)
		const usuarioNaoAutenticado = user_id == false;
		if (usuarioNaoAutenticado) {
			res.render('user-not-authenticated');
		} else {
			const { rows } = await getUserById(user_id);
			renderData.username = rows[0].username;
			renderData.token = req.cs
			res.render('csrf-post', renderData);
		}
	})
);

router.post(
	'/csrf-post/alterarusername',
	errHandling(async (req, res) => {
		//CRIA A VARIAVEI COM BASE NO QUE VEIO NA URL
		const { novo_username } = req.body;
		//CRIA A VARIAVEI COM BASE NO QUE ESTA NOS COOKIES
		const { token } = req.cookies;
		const user_id = await verifyToken(token)	
		//BUSCA NO BANCO DE DADOS SE O USUARIO EXISTE
		const { rows } = await getUserById(user_id);
		const userExiste = rows.length == 1;
		if (userExiste) {
			const { rows } = await updateUsername(novo_username, user_id);
			renderData.username = rows[0].username;
			res.render('csrf-post', renderData);
		} else {
			renderData.username = 'User_id_not_found';
			res.render('csrf-post', renderData);
		}
	})
);

module.exports = router;
