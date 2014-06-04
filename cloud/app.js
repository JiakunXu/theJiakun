// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();

// App 全局配置
app.set('views', 'cloud/views'); // 设置模板目录
app.set('view engine', 'ejs'); // 设置 template 引擎
app.use(express.bodyParser()); // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
			res.render('hello', {
						message : 'Congrats, you just set up your app!'
					});
		});

var isLegel = function(signature, timestamp, nonce) {
	var TOKEN = 'xplatform';
	var arr = [TOKEN, timestamp, nonce];
	// 对三个参数进行字典序排序
	arr.sort();
	// sha1 加密
	var sha1 = require("crypto").createHash('sha1');
	var msg = arr[0] + arr[1] + arr[2];
	sha1.update(msg);
	msg = sha1.digest('hex');
	// 验证
	if (msg == signature) {
		console.log('验证成功');
		return true;
	} else {
		console.log('验证失败');
		return false;
	}
};

app.get('/wx', function(req, res) {
			// 获取GET请求的参数
			var url_params = url.parse(req.url, true);

			console.log("get:" + req.url);

			var query = url_params.query;

			res.writeHead(200, {
						'Content-Type' : 'text/plain'
					});
			console.log('Query params:' + query.signature + query.timestamp
					+ query.nonce);

			if (isLegel(query.signature, query.timestamp, query.nonce)) {
				// 返回echostr
				res.end(query.echostr);
			} else {
				//
				res.end('Hello world\n');
			}
		});

app.post('/wx', function(req, res) {
	var postData = '';

	// 设置接收数据编码格式为 UTF-8
	req.setEncoding('utf8');

	// 接收数据块并将其赋值给 postData
	req.addListener('data', function(postDataChunk) {
				postData += postDataChunk;
			});

	console.log(req.body);

	req.addListener('end', function() {
		// 数据接收完毕，执行回调函数
		console.log("post:" + req.url + postData);

		var msg = "<xml><ToUserName><![CDATA[oPvmWjirOi_4vZezkAOW3Ry_mwGU]]></ToUserName><FromUserName><![CDATA[theJiakun]]></FromUserName><CreateTime>12345678</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好]]></Content></xml>";

		console.log(msg);
		res.end(msg);
	});
});

// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();