"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genres = void 0;
// entities/Genre.ts
const typeorm_1 = require("typeorm");
const Movies_1 = require("./Movies");
let Genres = class Genres {
};
exports.Genres = Genres;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Genres.prototype, "genres_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Genres.prototype, "genre_name", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Movies_1.Movies, movies => movies.genres),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Genres.prototype, "movies", void 0);
exports.Genres = Genres = __decorate([
    (0, typeorm_1.Entity)()
], Genres);
