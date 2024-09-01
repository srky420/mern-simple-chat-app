"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
function default_1(email) {
    return validRegex.test(email);
}
exports.default = default_1;
