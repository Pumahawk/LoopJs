module.exports = {
    reqExtBody,
    emux,
    reqExtBodyJSON,
    pext,
};

function pext(controller) {
    const ext = [
        reqExtBodyJSON,
    ];
    return emux(ext)(controller);
}

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

function reqExtBodyJSON(controller) {
    return reqExtBody('json')(controller);
}

function emux(ex) {
    return ex.reduce((f, x) => (c => f(x(c))));
}