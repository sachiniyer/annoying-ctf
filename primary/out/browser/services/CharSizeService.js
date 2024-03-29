"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharSizeService = void 0;
const Services_1 = require("common/services/Services");
const EventEmitter_1 = require("common/EventEmitter");
const Lifecycle_1 = require("common/Lifecycle");
let CharSizeService = class CharSizeService extends Lifecycle_1.Disposable {
    constructor(document, parentElement, _optionsService) {
        super();
        this._optionsService = _optionsService;
        this.width = 0;
        this.height = 0;
        this._onCharSizeChange = this.register(new EventEmitter_1.EventEmitter());
        this.onCharSizeChange = this._onCharSizeChange.event;
        this._measureStrategy = new DomMeasureStrategy(document, parentElement, this._optionsService);
        this.register(this._optionsService.onMultipleOptionChange(['fontFamily', 'fontSize'], () => this.measure()));
    }
    get hasValidSize() { return this.width > 0 && this.height > 0; }
    measure() {
        const result = this._measureStrategy.measure();
        if (result.width !== this.width || result.height !== this.height) {
            this.width = result.width;
            this.height = result.height;
            this._onCharSizeChange.fire();
        }
    }
};
CharSizeService = __decorate([
    __param(2, Services_1.IOptionsService)
], CharSizeService);
exports.CharSizeService = CharSizeService;
class DomMeasureStrategy {
    constructor(_document, _parentElement, _optionsService) {
        this._document = _document;
        this._parentElement = _parentElement;
        this._optionsService = _optionsService;
        this._result = { width: 0, height: 0 };
        this._measureElement = this._document.createElement('span');
        this._measureElement.classList.add('xterm-char-measure-element');
        this._measureElement.textContent = 'W';
        this._measureElement.setAttribute('aria-hidden', 'true');
        this._parentElement.appendChild(this._measureElement);
    }
    measure() {
        this._measureElement.style.fontFamily = this._optionsService.rawOptions.fontFamily;
        this._measureElement.style.fontSize = `${this._optionsService.rawOptions.fontSize}px`;
        const geometry = this._measureElement.getBoundingClientRect();
        if (geometry.width !== 0 && geometry.height !== 0) {
            this._result.width = geometry.width;
            this._result.height = Math.ceil(geometry.height);
        }
        return this._result;
    }
}
//# sourceMappingURL=CharSizeService.js.map