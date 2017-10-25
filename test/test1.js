/*let roles = {
 manager: {
 can: ['read', 'write', 'publish']
 },
 writer: {
 can: ['read', 'write']
 },
 guest: {
 can: ['read']
 }
 }

 function can(role, operation) {
 return roles[role] && roles[role].can.indexOf(operation) !== -1;
 }

 console.log(can('manager', 'read1'));*/

let AccessControl = require('accesscontrol');

var flatList = [
    //{ role: "admin", resource: "git", action: "read:any", attributes: [ 'id','name' ] },
    /* {role: "admin", resource: "git", action: "create:any", attributes: ['id', 'name']},
     {role: "admin", resource: "git", action: "read:any", attributes: ['id', 'name']},
     {role: "user", resource: "git", action: "read:any", attributes: ['name']},*/

    { role: "12345", resource: "git", action: "create", attributes: '' },
    { role: "12345", resource: "git", action: "read", attributes: '' },
    { role: "12345", resource: "git", action: "update", attributes: '' },
    { role: "12345", resource: "git", action: "delete", attributes: '' },
    { role: "123456", resource: "git", action: "read", attributes: '' },
];

let ac = new AccessControl(flatList);

let express = require('express');
let app = express();

app.get('/createAny', _authorizeCreateAny, function (req, res, next) {
    let role = 'admin';
    let resource = 'git'; //true
    return res.status(200).json({ statusCode: 200, message: "permission granted :)" });
});

app.get('/readAny', _authorizeReadAny, function (req, res, next) {
    let role = 'user';
    let resource = 'git'; //true
    return res.status(200).json({ statusCode: 200, message: "permission granted :)" });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

function _authorizeCreateAny(req, res, next) {
    console.log('-------createAny---------', JSON.stringify(ac));
    var permission;
    try {
        permission = ac.can(req.query.role).createAny(req.query.resource);
    }
    catch (AccessControlError) {
        console.log(AccessControlError);
        return res.send("Role not found: " + req.query.role);
    }
    console.log("-----------------------------", permission.granted);
    console.log(permission)
    if (!permission.granted) {
        return res.status(401).json({ statusCode: 403, message: "permission denied" })
    } else {
        return next();
    }
}

function _authorizeReadAny(req, res, next) {
    console.log('-------readAny---------');
    var permission;
    try {
        permission = ac.can(req.query.role).readAny(req.query.resource);
    }
    catch (AccessControlError) {
        console.log(AccessControlError);
        return res.send("Role not found: " + req.query.role);
    }
    if (!permission.granted) {
        return res.status(403).json({ statusCode: 403, message: "permission denied" })
    } else {
        return next();
    }
}