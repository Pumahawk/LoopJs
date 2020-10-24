module.exports = {
    reqExtBody,
    emux,
    reqExtBodyJSON,
};

function reqExtBody(type) {
    return controller => function(obj) {
        let data = '';
        const req = obj.req;
        req.on('data', chunk => {
          data += chunk;
        })
        req.on('end', () => {
            let bodyRequest = undefined
            if (type === 'json') {
                bodyRequest = JSON.parse(data);
            } else {
                bodyRequest = data;
            }
            controller(Object.assign(obj, { bodyRequest }));
        });
    }
}

function reqWrapper(errorCatch = () => {}) {
    return controller => (obj => {
        try {
            controller(obj);
        } catch (ex) {
            errorCatch(ex);
        }
    });
}

function autoRes(mapper) {
    return controller => obj => obj.res.end(mapper(controller(obj)));
}

function resJson(controller) {
    return obj => {
        obj.res.setHeader('Content-type', 'application/json');
        autoRes(JSON.stringify)(controller)(obj);
    }
}

function reqExtBodyJSON(controller) {
    return reqExtBody('json')(controller);
}

function emux(ex) {
    return ex.reduce((f, x) => (c => f(x(c))));
}

function cookies(controller) {
    return obj => {
        let {req, res} = obj;
        let cs = req.headers.cookie;
        if (cs !== undefined) {
            cs = cs.split(';').map(x => x.trim()).map(x => x.split('=')).map(x => ({k: x[0], v: x[1]})).reduce((o, x) => {o[x.k] = x.v; return o}, {})
        }
        const resC = controller(cs !== undefined ? Object.assign(obj, {cookies: cs}) : obj);
        if (obj.setCookies !== undefined) {
            res.setHeader('Set-Cookie', Object.keys(obj.setCookies).map(x => ({key: x, value: obj.setCookies[x]})).map(x => x.key + '=' + x.value));
        }
        return resC;
    }
}