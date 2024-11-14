"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Videogame = void 0;
const typeorm_1 = require("typeorm");
let Videogame = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)("videogames")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _genre_decorators;
    let _genre_initializers = [];
    let _genre_extraInitializers = [];
    let _platform_decorators;
    let _platform_initializers = [];
    let _platform_extraInitializers = [];
    let _publisher_decorators;
    let _publisher_initializers = [];
    let _publisher_extraInitializers = [];
    let _releaseDate_decorators;
    let _releaseDate_initializers = [];
    let _releaseDate_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _price_decorators;
    let _price_initializers = [];
    let _price_extraInitializers = [];
    let _imageUrl_decorators;
    let _imageUrl_initializers = [];
    let _imageUrl_extraInitializers = [];
    let _inStock_decorators;
    let _inStock_initializers = [];
    let _inStock_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _updatedAt_decorators;
    let _updatedAt_initializers = [];
    let _updatedAt_extraInitializers = [];
    var Videogame = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.genre = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _genre_initializers, void 0));
            this.platform = (__runInitializers(this, _genre_extraInitializers), __runInitializers(this, _platform_initializers, void 0));
            this.publisher = (__runInitializers(this, _platform_extraInitializers), __runInitializers(this, _publisher_initializers, void 0));
            this.releaseDate = (__runInitializers(this, _publisher_extraInitializers), __runInitializers(this, _releaseDate_initializers, void 0));
            this.rating = (__runInitializers(this, _releaseDate_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.price = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.imageUrl = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _imageUrl_initializers, void 0));
            this.inStock = (__runInitializers(this, _imageUrl_extraInitializers), __runInitializers(this, _inStock_initializers, void 0));
            this.createdAt = (__runInitializers(this, _inStock_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            __runInitializers(this, _updatedAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Videogame");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _title_decorators = [(0, typeorm_1.Column)()];
        _description_decorators = [(0, typeorm_1.Column)("text")];
        _genre_decorators = [(0, typeorm_1.Column)("simple-array")];
        _platform_decorators = [(0, typeorm_1.Column)("simple-array")];
        _publisher_decorators = [(0, typeorm_1.Column)()];
        _releaseDate_decorators = [(0, typeorm_1.Column)()];
        _rating_decorators = [(0, typeorm_1.Column)("decimal", { precision: 4, scale: 2 })];
        _price_decorators = [(0, typeorm_1.Column)("decimal", { precision: 10, scale: 2 })];
        _imageUrl_decorators = [(0, typeorm_1.Column)()];
        _inStock_decorators = [(0, typeorm_1.Column)({ default: true })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _genre_decorators, { kind: "field", name: "genre", static: false, private: false, access: { has: obj => "genre" in obj, get: obj => obj.genre, set: (obj, value) => { obj.genre = value; } }, metadata: _metadata }, _genre_initializers, _genre_extraInitializers);
        __esDecorate(null, null, _platform_decorators, { kind: "field", name: "platform", static: false, private: false, access: { has: obj => "platform" in obj, get: obj => obj.platform, set: (obj, value) => { obj.platform = value; } }, metadata: _metadata }, _platform_initializers, _platform_extraInitializers);
        __esDecorate(null, null, _publisher_decorators, { kind: "field", name: "publisher", static: false, private: false, access: { has: obj => "publisher" in obj, get: obj => obj.publisher, set: (obj, value) => { obj.publisher = value; } }, metadata: _metadata }, _publisher_initializers, _publisher_extraInitializers);
        __esDecorate(null, null, _releaseDate_decorators, { kind: "field", name: "releaseDate", static: false, private: false, access: { has: obj => "releaseDate" in obj, get: obj => obj.releaseDate, set: (obj, value) => { obj.releaseDate = value; } }, metadata: _metadata }, _releaseDate_initializers, _releaseDate_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: obj => "price" in obj, get: obj => obj.price, set: (obj, value) => { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _imageUrl_decorators, { kind: "field", name: "imageUrl", static: false, private: false, access: { has: obj => "imageUrl" in obj, get: obj => obj.imageUrl, set: (obj, value) => { obj.imageUrl = value; } }, metadata: _metadata }, _imageUrl_initializers, _imageUrl_extraInitializers);
        __esDecorate(null, null, _inStock_decorators, { kind: "field", name: "inStock", static: false, private: false, access: { has: obj => "inStock" in obj, get: obj => obj.inStock, set: (obj, value) => { obj.inStock = value; } }, metadata: _metadata }, _inStock_initializers, _inStock_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: obj => "updatedAt" in obj, get: obj => obj.updatedAt, set: (obj, value) => { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Videogame = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Videogame = _classThis;
})();
exports.Videogame = Videogame;
