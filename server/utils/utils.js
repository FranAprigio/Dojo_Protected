const axios = require('axios');
const jwt = require("jsonwebtoken")
const sanitizeHtml = require('sanitize-html');

exports.errHandling = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

exports.request = async (endPoint, method, data) => {
	const porta = process.env.PORT || 3000;
	const URL_PADRAO = 'http://localhost:' + porta;
	const url = `${URL_PADRAO}${endPoint}`;

	const { headers, data: res } = await axios({
		url,
		method,
		data,
		validateStatus: false,
	});

	return { headers, res };
};

	//FUNÇÃO DE SANITIZAR O HTML 
exports.sanitize = async sinit =>{
	return sanitizeHtml(sinit, {
		allowedTags: [ 'b', 'i', 'em', 'strong', 'a' ],
		allowedAttributes: {
		  'a': [ 'href' ]
		},
		allowedIframeHostnames: ['www.youtube.com']
	  });
}

	//FUNCAO JWT DE VERIFICAR TOKEN 
exports.verifyToken = async token => {
	return jwt.verify(
		token,
		process.env.SECRETOKEN,
		(err, decoded) => {
		  if (err) {
		  console.log(err.name, err.message);
		  return false;
		  } else return decoded.user_id;
		}
	  );
}


