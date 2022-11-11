const router = require('express').Router();
const { errHandling, sani } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserByName } = require('../../service/service');
const sanitizeHtml = require('sanitize-html');
//const { clean } = require('../../utils/utils')

router.use(cookieParser());

const renderData = {};

router.get(
	'/xss_refletido',
	errHandling(async (req, res) => {
		const { nome } = req.query;
		renderData.hasUsers = 'false';
		renderData.busca = undefined
		if (nome != undefined) {
			const clean = sanitizeHtml(nome, {
				allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
				allowedAttributes: {
				  'a': [ 'href' ]
				},
				allowedIframeHostnames: ['www.youtube.com']
			  });

			renderData.busca = clean;
			const { rows } = await getUserByName(clean);
			if (rows[0]) renderData.hasUsers = 'true';
			renderData.users = rows;
		}

		res.render('xss_refletido', renderData);
	})
);

module.exports = router;
