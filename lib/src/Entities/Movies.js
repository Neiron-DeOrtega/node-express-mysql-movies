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
exports.Movies = void 0;
// entities/Movies.ts
const typeorm_1 = require("typeorm");
const Actors_1 = require("./Actors");
const Directors_1 = require("./Directors");
const Genres_1 = require("./Genres");
const Reviews_1 = require("./Reviews");
let Movies = class Movies {
};
exports.Movies = Movies;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Movies.prototype, "movies_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Movies.prototype, "movie_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Movies.prototype, "release_date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Movies.prototype, "movie_logo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Movies.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Genres_1.Genres, genres => genres.movies),
    __metadata("design:type", Array)
], Movies.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Directors_1.Directors, directors => directors.movies),
    __metadata("design:type", Array)
], Movies.prototype, "director", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Actors_1.Actors, actors => actors.movies),
    __metadata("design:type", Array)
], Movies.prototype, "actors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reviews_1.Reviews, reviews => reviews.movie),
    __metadata("design:type", Array)
], Movies.prototype, "reviews", void 0);
exports.Movies = Movies = __decorate([
    (0, typeorm_1.Entity)()
], Movies);
