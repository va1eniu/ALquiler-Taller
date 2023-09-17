var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose, Type } from 'class-transformer';
import { IsDefined, MaxLength, MinLength, IsNumber, IsEmail, IsString } from 'class-validator';
export class User {
    constructor(ID, nom_com, ema, psw) {
        this.ID = ID;
        this.nom_com = nom_com;
        this.ema = ema;
        this.psw = psw;
    }
}
__decorate([
    Expose({ name: 'id' }),
    IsNumber({}, { message: () => { throw { status: 422, message: `El id no cumple con el formato` }; } }),
    IsDefined({ message: () => { throw { status: 422, message: `El parametro id es obligatorio` }; } }),
    __metadata("design:type", Number)
], User.prototype, "ID", void 0);
__decorate([
    Expose({ name: 'nombre' }),
    IsString({ message: () => { throw { status: 422, message: `El nombre no cumple con el formato` }; } })
    // @Transform(({ value }) => { if(/^[a-z A-Z]+$/.test(value)) return value ; else throw {status: 422, message: `El datos nombre no cunple con los parametros acordados`};}, { toClassOnly: true })
    ,
    __metadata("design:type", String)
], User.prototype, "nom_com", void 0);
__decorate([
    Expose({ name: 'email' }),
    IsEmail({}, { message: () => { throw { status: 422, message: `El email no cumple con el formato` }; } }),
    IsDefined({ message: () => { throw { status: 422, message: `El parametro email es obligatorio` }; } })
    // @Transform(({ value }) => { if(/\S+@\S+\.\S+/.test(value)) return value ; else throw {status: 422, message: `El datos email no cunple con los parametros acordados`};}, { toClassOnly: true })
    ,
    __metadata("design:type", String)
], User.prototype, "ema", void 0);
__decorate([
    Expose({ name: 'password' }),
    IsDefined({ message: () => { throw { status: 422, message: `El parametro password es obligatorio` }; } }),
    MinLength(8, { message: () => { throw { status: 411, message: `El password debe ser mas de 8 caracteres` }; } }),
    MaxLength(12, { message: () => { throw { status: 411, message: `El password supero el limite :(` }; } }),
    Type(() => String),
    __metadata("design:type", String)
], User.prototype, "psw", void 0);
