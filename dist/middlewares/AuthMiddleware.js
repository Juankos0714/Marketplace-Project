"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma_1 = require("../database/prisma");
function authMiddleware(permissions) {
    return async (req, res, next) => {
        var _a;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token não fornecido" });
        }
        const token = authHeader.substring(7);
        try {
            const MY_SECRET_KEY = process.env.MY_SECRET_KEY;
            if (!MY_SECRET_KEY) {
                throw new Error("Chave secreta não fonercida");
            }
            const decodedToken = (0, jsonwebtoken_1.verify)(token, MY_SECRET_KEY);
            req.user = { id: decodedToken.userId };
            if (permissions) {
                const user = await prisma_1.prisma.user.findUnique({
                    where: {
                        id: decodedToken.userId
                    },
                    include: {
                        userAccess: {
                            select: {
                                Access: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                });
                const userPermissions = (_a = user === null || user === void 0 ? void 0 : user.userAccess.map((na) => { var _a; return (_a = na.Access) === null || _a === void 0 ? void 0 : _a.name; })) !== null && _a !== void 0 ? _a : [];
                const hasPermission = permissions.some((p) => userPermissions.includes(p));
                if (!hasPermission) {
                    return res.status(403).json({ message: "Permissão negada." });
                }
            }
            return next();
        }
        catch (error) {
            return res.status(401).json({ message: "Token invalido." });
        }
    };
}
