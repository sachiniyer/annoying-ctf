"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityManager = void 0;
const Strings = require("browser/LocalizableStrings");
const Platform_1 = require("common/Platform");
const TimeBasedDebouncer_1 = require("browser/TimeBasedDebouncer");
const Lifecycle_1 = require("common/Lifecycle");
const MAX_ROWS_TO_READ = 20;
class AccessibilityManager extends Lifecycle_1.Disposable {
    constructor(_terminal) {
        super();
        this._terminal = _terminal;
        this._liveRegionLineCount = 0;
        this._charsToConsume = [];
        this._charsToAnnounce = '';
        this._accessibilityContainer = document.createElement('div');
        this._accessibilityContainer.classList.add('xterm-accessibility');
        this._liveRegion = document.createElement('div');
        this._liveRegion.classList.add('live-region');
        this._liveRegion.setAttribute('aria-live', 'assertive');
        this._accessibilityContainer.appendChild(this._liveRegion);
        this._liveRegionDebouncer = this.register(new TimeBasedDebouncer_1.TimeBasedDebouncer(this._announceCharacters.bind(this)));
        if (!this._terminal.element) {
            throw new Error('Cannot enable accessibility before Terminal.open');
        }
        this._terminal.element.insertAdjacentElement('afterbegin', this._accessibilityContainer);
        this.register(this._liveRegionDebouncer);
        this.register(this._terminal.onRender(e => this._refreshRows(e.start, e.end)));
        this.register(this._terminal.onScroll(() => this._refreshRows()));
        this.register(this._terminal.onA11yChar(char => this._handleChar(char)));
        this.register(this._terminal.onLineFeed(() => this._handleChar('\n')));
        this.register(this._terminal.onA11yTab(spaceCount => this._handleTab(spaceCount)));
        this.register(this._terminal.onKey(e => this._handleKey(e.key)));
        this.register(this._terminal.onBlur(() => this._clearLiveRegion()));
        this.register((0, Lifecycle_1.toDisposable)(() => this._accessibilityContainer.remove()));
    }
    _handleTab(spaceCount) {
        for (let i = 0; i < spaceCount; i++) {
            this._handleChar(' ');
        }
    }
    _handleChar(char) {
        if (this._liveRegionLineCount < MAX_ROWS_TO_READ + 1) {
            if (this._charsToConsume.length > 0) {
                const shiftedChar = this._charsToConsume.shift();
                if (shiftedChar !== char) {
                    this._charsToAnnounce += char;
                }
            }
            else {
                this._charsToAnnounce += char;
            }
            if (char === '\n') {
                this._liveRegionLineCount++;
                if (this._liveRegionLineCount === MAX_ROWS_TO_READ + 1) {
                    this._liveRegion.textContent += Strings.tooMuchOutput;
                }
            }
            if (Platform_1.isMac) {
                if (this._liveRegion.textContent && this._liveRegion.textContent.length > 0 && !this._liveRegion.parentNode) {
                    setTimeout(() => {
                        this._accessibilityContainer.appendChild(this._liveRegion);
                    }, 0);
                }
            }
        }
    }
    _clearLiveRegion() {
        this._liveRegion.textContent = '';
        this._liveRegionLineCount = 0;
        if (Platform_1.isMac) {
            this._liveRegion.remove();
        }
    }
    _handleKey(keyChar) {
        this._clearLiveRegion();
        if (!/\p{Control}/u.test(keyChar)) {
            this._charsToConsume.push(keyChar);
        }
    }
    _refreshRows(start, end) {
        this._liveRegionDebouncer.refresh(start, end, this._terminal.rows);
    }
    _announceCharacters() {
        if (this._charsToAnnounce.length === 0) {
            return;
        }
        this._liveRegion.textContent += this._charsToAnnounce;
        this._charsToAnnounce = '';
    }
}
exports.AccessibilityManager = AccessibilityManager;
//# sourceMappingURL=AccessibilityManager.js.map