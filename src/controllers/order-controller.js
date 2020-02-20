'use strict';

const mongoose = require('mongoose');

// Carrega os models
const Order = require('../models/order');

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e.message
        });
    }
}

exports.post = async (req, res, next) => {
    try {
        // Recupera o Token
        const token = req.body.token || req.body.token || req.headers['x-access-token'];
        // Decodifica o Token
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });
        res.status(201).send({
            message: 'Pedido cadastrado com sucesso'
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: 'Falha ao processar sua requisição',
            error: e.message
        });
    }
};