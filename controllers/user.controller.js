const { response, request } = require('express');

const get = (req, res = response) => {
    const queryParams = req.query;
    res.json({
        msg: "GET - controller",
        queryParams 
    });
}

const post = (req = request, res = response) => {
    //segment params
    const id = req.params.id;
    res.json({
        msg: "POST - controller",
        id
    });
}

const put = (req, res = response) => {
    res.json({
        msg: "PUT - controller",
    });
}

const patch = (req, res = response) => {
    res.json({
        msg: "PATCH - controller"
    });
}

const destroy = (req, res = response) => {
    res.json({
        msg: "DESTROY - controller"
    });
}

module.exports = {
    get,
    post,
    put,
    patch,
    destroy
};