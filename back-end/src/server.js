import { response } from "express";
import express from 'express';

const app = express();

app.get('/hello', function(req, res) {
    resp.send("hello");
});

app.listen(8001, function() {
    console.log("Server on 8000")
});