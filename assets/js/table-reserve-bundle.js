/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/Reservation.ts":
/*!********************************!*\
  !*** ./src/app/Reservation.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Reservation = void 0;
class Reservation {
    constructor(data, HTMLElement, options) {
        this.data = data;
        this.HTMLElement = HTMLElement;
        this.options = options;
        this.zoom = 50;
        this.selectedChairs = [];
    }
    render() {
        var _a;
        //  LOOP THROW DATA OBJECT PROPERTIES EX
        /**
          @properties
          @typeA
          @typeB
          @typeC
          @typeD
        **/
        for (const key in this.data) {
            if (Object.prototype.hasOwnProperty.call(this.data, key)) {
                const element = this.data[key];
                const htmlRender = element.map((item, tableIndex) => {
                    const chairs = item.chairs
                        .reverse()
                        .map((chair) => {
                        if (chair.available === false) {
                            return;
                        }
                        return this.drawChair(chair, item.available);
                    })
                        .join('');
                    // if (item.available) {
                    return this.drawTable(item, chairs);
                    // }
                });
                (_a = this.HTMLElement) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('afterbegin', this.tableDivider(htmlRender));
            }
        }
        this.setupEvents();
    }
    reRender(data) {
        this.HTMLElement.innerHTML = '';
        this.data = data;
        this.render();
    }
    drawTable(table, chairsHTMLText) {
        // check if all chairs available are falsy then hide whole table
        const isChairsAvailable = table.chairs.filter(chair => chair.available !== false);
        return `
    <div class="reservation__table reservation__table--${table.levelName}
     ${table.isReserved ? 'reservation__table--isReserved' : ''}
     ${!table.available ? 'reservation__table--disabled' : ''} 
     ${!isChairsAvailable.length ? 'reservation__table--hide' : ''}
     ">
        <h2 class="reservation__table__id" data-tableType=${table.levelName} data-tableIndexId=${table.tableId}>${table.tableNo}</h2>
        <ul class="reservation__table__chairs">
            ${chairsHTMLText}
          </ul>
      </div>`;
    }
    drawChair(chair, available) {
        return `
    <li
      class="
        reservation__table__chairs__item
        ${chair.isReserved ? 'reservation__table__chairs__item--isReserved' : ''}
        ${chair.isPending ? 'reservation__table__chairs__item--isPending' : ''}
        ${!available ? 'reservation__table__chairs__item--disabled' : ''}
        reservation__table__chairs__item--${chair.chairNo}"
        title="${chair.isReserved
            ? 'this chair is already reserved'
            : chair.isPending
                ? 'this chair is pending'
                : ''}"
        >
      <h2 class="reservation__table__chairs__item__id" data-tableId=${chair.tableId} data-tableLevel=${chair.levelName} data-uniqueId=${chair.levelName + chair.chairId}  data-chairIndexId=${chair.chairId}>${chair.chairNo}</h2>
    </li>
    `;
    }
    tableDivider(tableHTMLArrayText) {
        /**
         * divide list of tables in rows and each row should have 12 tables
         */
        const length = tableHTMLArrayText.length / 24;
        let htmlText = '';
        for (let index = 0; index < length; index++) {
            const firstIndex = index * 24;
            const lastIndex = (index + 1) * 24;
            const tableRow = tableHTMLArrayText.slice(firstIndex, lastIndex);
            const tableRowDivided = this.rowDivider(tableRow);
            htmlText += `
       <div class="reservation__tables">
          ${tableRowDivided}
        </div>
        `;
        }
        return htmlText;
    }
    rowDivider(row) {
        /**
         * each table should divide into 4 parts
         * part one should be 5 tables
         * part two should be 7 tables
         * part three should also be 7 tables
         * and last part should be 5
         */
        const group1 = row.slice(0, 5).join('');
        const group2 = row.slice(5, 12).join('');
        const group3 = row.slice(12, 19).join('');
        const group4 = row.slice(19, 24).join('');
        return `
    <div class="reservation__tables__divider">${group1}</div>
    <div class="reservation__tables__divider">${group2}</div>
    <div class="reservation__tables__divider">${group3}</div>
    <div class="reservation__tables__divider">${group4}</div>
    
    `;
    }
    setupEvents() {
        /**
         * setup js events when user fire event on table or chair should
         * @return a clicked item
         */
        // CHAIR ACTION
        document
            .querySelectorAll('.reservation__table__chairs__item__id')
            .forEach((item) => {
            item.addEventListener('click', (e) => {
                if (!e.target.parentElement.classList.contains('reservation__table__chairs__item--disabled')) {
                    const chairId = e.target.dataset.chairindexid;
                    const tableLevel = e.target.dataset.tablelevel;
                    const tableId = e.target.dataset.tableid;
                    const chairItem = this.filterChairById(chairId, tableLevel, tableId);
                    // TOGGLE Selected class
                    // item.parentElement.classList.toggle('isSelected');
                    const currentTable = this.getTableById(tableLevel, tableId);
                    if (currentTable.reserveWholeTable) {
                        this.tableTriggerClick(tableLevel, tableId);
                        return;
                    }
                    if (!chairItem.isPending && !chairItem.isReserved) {
                        this.selectedChairs.push(chairItem);
                        chairItem.isPending = true;
                        this.updateSelectedChairToPendingStatus(chairItem.levelName + chairItem.chairId, true);
                    }
                    else if (chairItem.isPending) {
                        chairItem.isPending = false;
                        this.updateSelectedChairToPendingStatus(chairItem.levelName + chairItem.chairId, false);
                        this.selectedChairs = this.selectedChairs.filter((chair) => chair.chairId !== chairItem.chairId);
                    }
                    this.options.chairClickHandler(chairItem);
                }
            });
        });
        // TABLE ACTION
        document.querySelectorAll('.reservation__table__id').forEach((item) => {
            if (!item.parentElement.classList.contains('reservation__table--disabled')) {
                item.addEventListener('click', (e) => {
                    // TOGGLE Selected class
                    // item.classList.toggle('isSelected');
                    const tableId = e.target.dataset.tableindexid;
                    const tableType = e.target.dataset.tabletype;
                    const tableTypeData = this.data[tableType];
                    const tableFilteredById = tableTypeData.filter((table) => {
                        return table.tableId == tableId;
                    })[0];
                    const hasReservation = tableFilteredById.chairs.filter((chair) => chair.isReserved);
                    const isTablePending = e.target.classList.contains('reservation__table--pending');
                    const filteredChairAvailable = tableFilteredById.chairs.filter((chair) => chair.available !== false);
                    if (hasReservation.length) {
                        // tableFilteredById.isReserved = true;
                    }
                    else if (!hasReservation.length &&
                        !tableFilteredById.isReserved &&
                        !isTablePending) {
                        // ADD ITEM
                        const chairs = this.getUniqueData([
                            ...this.selectedChairs,
                            ...filteredChairAvailable,
                        ]);
                        this.selectedChairs = chairs;
                        e.target.classList.add('reservation__table--pending');
                        filteredChairAvailable.forEach((chair) => {
                            chair.isPending = true;
                            this.updateSelectedChairToPendingStatus(chair.levelName + chair.chairId, true);
                        });
                    }
                    else {
                        //  REMOVE ITEM
                        filteredChairAvailable.forEach((chair) => {
                            chair.isPending = false;
                            this.selectedChairs = this.selectedChairs.filter((ch) => ch.chairId !== chair.chairId);
                            this.updateSelectedChairToPendingStatus(chair.levelName + chair.chairId, false);
                            e.target.classList.remove('reservation__table--pending');
                        });
                    }
                    this.options.tableClickHandler(tableFilteredById, !hasReservation.length);
                });
            }
        });
        // ZOOM ACTION
        document
            .getElementById('zoomIn')
            .addEventListener('click', this.zoomInHandler.bind(this));
        document
            .getElementById('zoomOut')
            .addEventListener('click', this.zoomOutHandler.bind(this));
        document
            .getElementById('zoomReset')
            .addEventListener('click', this.zoomResetHandler.bind(this));
    }
    zoomInHandler() {
        this.zoom < 130 ? (this.zoom += 10) : this.zoom;
        this.updateTableZoom();
    }
    zoomOutHandler() {
        this.zoom > 30 ? (this.zoom -= 10) : (this.zoom = 30);
        this.updateTableZoom();
    }
    zoomResetHandler() {
        this.zoom = 50;
        this.updateTableZoom();
    }
    updateTableZoom() {
        const element = document.querySelector('.reservation');
        element.style.zoom = this.zoom + '%';
        this.options.onZoom();
    }
    updateSelectedChairToPendingStatus(chairID, isPending) {
        const selector = document.querySelector(`[data-uniqueid=${chairID}]`).parentElement;
        let className = 'reservation__table__chairs__item--isPending';
        if (isPending) {
            selector.title = 'this chair is pending';
            selector.classList.add(className);
        }
        else {
            selector.title = '';
            selector.classList.remove(className);
        }
    }
    filterChairById(chairId, tableLevel, tableId) {
        // const chairType = chairId.slice(0, 1);
        // const tableType = 'level' + chairType;
        // const tableId = chairId.slice(0, -1);
        // const selectedType: ITable[] = this.data[tableLevel];
        const chairFilteredById = this.getTableById(tableLevel, tableId)
            .chairs.filter((chair) => chair.chairId == chairId)[0];
        return chairFilteredById;
    }
    getData() {
        return this.data;
    }
    getSelectedChair() {
        return this.selectedChairs;
    }
    getUniqueData(data) {
        const chairs = [];
        const unique = new Set(data);
        unique.forEach((chair) => {
            // if (!chair.isPending) {
            chairs.push(chair);
            // }
        });
        return chairs;
    }
    getTableById(levelId, tableId) {
        const selectedType = this.data[levelId];
        const selectedTable = selectedType
            .filter((table) => {
            if (table.tableId == tableId) {
                return table;
            }
        })[0];
        return selectedTable;
    }
    tableTriggerClick(levelId, tableId) {
        const tableElement = document.querySelector(`.reservation__table__id[data-tabletype='${levelId}'][data-tableindexid='${tableId}']`);
        tableElement.click();
    }
}
exports.Reservation = Reservation;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!************************!*\
  !*** ./src/app/app.ts ***!
  \************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const Reservation_1 = __webpack_require__(/*! ./Reservation */ "./src/app/Reservation.ts");
window.Reservation = Reservation_1.Reservation;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDVDtBQUNBO0FBQ0E7QUFDQSwrRkFBK0YsUUFBUSx3QkFBd0IsUUFBUTtBQUN2STtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7Ozs7Ozs7VUMzUm5CO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsc0JBQXNCLG1CQUFPLENBQUMsK0NBQWU7QUFDN0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90YWJsZV9yZXNlcnZhdGlvbi8uL3NyYy9hcHAvUmVzZXJ2YXRpb24udHMiLCJ3ZWJwYWNrOi8vdGFibGVfcmVzZXJ2YXRpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdGFibGVfcmVzZXJ2YXRpb24vLi9zcmMvYXBwL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlJlc2VydmF0aW9uID0gdm9pZCAwO1xyXG5jbGFzcyBSZXNlcnZhdGlvbiB7XHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhLCBIVE1MRWxlbWVudCwgb3B0aW9ucykge1xyXG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5IVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgdGhpcy56b29tID0gNTA7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZENoYWlycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICAvLyAgTE9PUCBUSFJPVyBEQVRBIE9CSkVDVCBQUk9QRVJUSUVTIEVYXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICBAcHJvcGVydGllc1xyXG4gICAgICAgICAgQHR5cGVBXHJcbiAgICAgICAgICBAdHlwZUJcclxuICAgICAgICAgIEB0eXBlQ1xyXG4gICAgICAgICAgQHR5cGVEXHJcbiAgICAgICAgKiovXHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5kYXRhLCBrZXkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5kYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBodG1sUmVuZGVyID0gZWxlbWVudC5tYXAoKGl0ZW0sIHRhYmxlSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGFpcnMgPSBpdGVtLmNoYWlyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAucmV2ZXJzZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKGNoYWlyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjaGFpci5hdmFpbGFibGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZHJhd0NoYWlyKGNoYWlyLCBpdGVtLmF2YWlsYWJsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIChpdGVtLmF2YWlsYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRyYXdUYWJsZShpdGVtLCBjaGFpcnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgKF9hID0gdGhpcy5IVE1MRWxlbWVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsIHRoaXMudGFibGVEaXZpZGVyKGh0bWxSZW5kZXIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldHVwRXZlbnRzKCk7XHJcbiAgICB9XHJcbiAgICByZVJlbmRlcihkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5IVE1MRWxlbWVudC5pbm5lckhUTUwgPSAnJztcclxuICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcbiAgICBkcmF3VGFibGUodGFibGUsIGNoYWlyc0hUTUxUZXh0KSB7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgYWxsIGNoYWlycyBhdmFpbGFibGUgYXJlIGZhbHN5IHRoZW4gaGlkZSB3aG9sZSB0YWJsZVxyXG4gICAgICAgIGNvbnN0IGlzQ2hhaXJzQXZhaWxhYmxlID0gdGFibGUuY2hhaXJzLmZpbHRlcihjaGFpciA9PiBjaGFpci5hdmFpbGFibGUgIT09IGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgPGRpdiBjbGFzcz1cInJlc2VydmF0aW9uX190YWJsZSByZXNlcnZhdGlvbl9fdGFibGUtLSR7dGFibGUubGV2ZWxOYW1lfVxyXG4gICAgICR7dGFibGUuaXNSZXNlcnZlZCA/ICdyZXNlcnZhdGlvbl9fdGFibGUtLWlzUmVzZXJ2ZWQnIDogJyd9XHJcbiAgICAgJHshdGFibGUuYXZhaWxhYmxlID8gJ3Jlc2VydmF0aW9uX190YWJsZS0tZGlzYWJsZWQnIDogJyd9IFxyXG4gICAgICR7IWlzQ2hhaXJzQXZhaWxhYmxlLmxlbmd0aCA/ICdyZXNlcnZhdGlvbl9fdGFibGUtLWhpZGUnIDogJyd9XHJcbiAgICAgXCI+XHJcbiAgICAgICAgPGgyIGNsYXNzPVwicmVzZXJ2YXRpb25fX3RhYmxlX19pZFwiIGRhdGEtdGFibGVUeXBlPSR7dGFibGUubGV2ZWxOYW1lfSBkYXRhLXRhYmxlSW5kZXhJZD0ke3RhYmxlLnRhYmxlSWR9PiR7dGFibGUudGFibGVOb308L2gyPlxyXG4gICAgICAgIDx1bCBjbGFzcz1cInJlc2VydmF0aW9uX190YWJsZV9fY2hhaXJzXCI+XHJcbiAgICAgICAgICAgICR7Y2hhaXJzSFRNTFRleHR9XHJcbiAgICAgICAgICA8L3VsPlxyXG4gICAgICA8L2Rpdj5gO1xyXG4gICAgfVxyXG4gICAgZHJhd0NoYWlyKGNoYWlyLCBhdmFpbGFibGUpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgPGxpXHJcbiAgICAgIGNsYXNzPVwiXHJcbiAgICAgICAgcmVzZXJ2YXRpb25fX3RhYmxlX19jaGFpcnNfX2l0ZW1cclxuICAgICAgICAke2NoYWlyLmlzUmVzZXJ2ZWQgPyAncmVzZXJ2YXRpb25fX3RhYmxlX19jaGFpcnNfX2l0ZW0tLWlzUmVzZXJ2ZWQnIDogJyd9XHJcbiAgICAgICAgJHtjaGFpci5pc1BlbmRpbmcgPyAncmVzZXJ2YXRpb25fX3RhYmxlX19jaGFpcnNfX2l0ZW0tLWlzUGVuZGluZycgOiAnJ31cclxuICAgICAgICAkeyFhdmFpbGFibGUgPyAncmVzZXJ2YXRpb25fX3RhYmxlX19jaGFpcnNfX2l0ZW0tLWRpc2FibGVkJyA6ICcnfVxyXG4gICAgICAgIHJlc2VydmF0aW9uX190YWJsZV9fY2hhaXJzX19pdGVtLS0ke2NoYWlyLmNoYWlyTm99XCJcclxuICAgICAgICB0aXRsZT1cIiR7Y2hhaXIuaXNSZXNlcnZlZFxyXG4gICAgICAgICAgICA/ICd0aGlzIGNoYWlyIGlzIGFscmVhZHkgcmVzZXJ2ZWQnXHJcbiAgICAgICAgICAgIDogY2hhaXIuaXNQZW5kaW5nXHJcbiAgICAgICAgICAgICAgICA/ICd0aGlzIGNoYWlyIGlzIHBlbmRpbmcnXHJcbiAgICAgICAgICAgICAgICA6ICcnfVwiXHJcbiAgICAgICAgPlxyXG4gICAgICA8aDIgY2xhc3M9XCJyZXNlcnZhdGlvbl9fdGFibGVfX2NoYWlyc19faXRlbV9faWRcIiBkYXRhLXRhYmxlSWQ9JHtjaGFpci50YWJsZUlkfSBkYXRhLXRhYmxlTGV2ZWw9JHtjaGFpci5sZXZlbE5hbWV9IGRhdGEtdW5pcXVlSWQ9JHtjaGFpci5sZXZlbE5hbWUgKyBjaGFpci5jaGFpcklkfSAgZGF0YS1jaGFpckluZGV4SWQ9JHtjaGFpci5jaGFpcklkfT4ke2NoYWlyLmNoYWlyTm99PC9oMj5cclxuICAgIDwvbGk+XHJcbiAgICBgO1xyXG4gICAgfVxyXG4gICAgdGFibGVEaXZpZGVyKHRhYmxlSFRNTEFycmF5VGV4dCkge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRpdmlkZSBsaXN0IG9mIHRhYmxlcyBpbiByb3dzIGFuZCBlYWNoIHJvdyBzaG91bGQgaGF2ZSAxMiB0YWJsZXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBsZW5ndGggPSB0YWJsZUhUTUxBcnJheVRleHQubGVuZ3RoIC8gMjQ7XHJcbiAgICAgICAgbGV0IGh0bWxUZXh0ID0gJyc7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBjb25zdCBmaXJzdEluZGV4ID0gaW5kZXggKiAyNDtcclxuICAgICAgICAgICAgY29uc3QgbGFzdEluZGV4ID0gKGluZGV4ICsgMSkgKiAyNDtcclxuICAgICAgICAgICAgY29uc3QgdGFibGVSb3cgPSB0YWJsZUhUTUxBcnJheVRleHQuc2xpY2UoZmlyc3RJbmRleCwgbGFzdEluZGV4KTtcclxuICAgICAgICAgICAgY29uc3QgdGFibGVSb3dEaXZpZGVkID0gdGhpcy5yb3dEaXZpZGVyKHRhYmxlUm93KTtcclxuICAgICAgICAgICAgaHRtbFRleHQgKz0gYFxyXG4gICAgICAgPGRpdiBjbGFzcz1cInJlc2VydmF0aW9uX190YWJsZXNcIj5cclxuICAgICAgICAgICR7dGFibGVSb3dEaXZpZGVkfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBodG1sVGV4dDtcclxuICAgIH1cclxuICAgIHJvd0RpdmlkZXIocm93KSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZWFjaCB0YWJsZSBzaG91bGQgZGl2aWRlIGludG8gNCBwYXJ0c1xyXG4gICAgICAgICAqIHBhcnQgb25lIHNob3VsZCBiZSA1IHRhYmxlc1xyXG4gICAgICAgICAqIHBhcnQgdHdvIHNob3VsZCBiZSA3IHRhYmxlc1xyXG4gICAgICAgICAqIHBhcnQgdGhyZWUgc2hvdWxkIGFsc28gYmUgNyB0YWJsZXNcclxuICAgICAgICAgKiBhbmQgbGFzdCBwYXJ0IHNob3VsZCBiZSA1XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgZ3JvdXAxID0gcm93LnNsaWNlKDAsIDUpLmpvaW4oJycpO1xyXG4gICAgICAgIGNvbnN0IGdyb3VwMiA9IHJvdy5zbGljZSg1LCAxMikuam9pbignJyk7XHJcbiAgICAgICAgY29uc3QgZ3JvdXAzID0gcm93LnNsaWNlKDEyLCAxOSkuam9pbignJyk7XHJcbiAgICAgICAgY29uc3QgZ3JvdXA0ID0gcm93LnNsaWNlKDE5LCAyNCkuam9pbignJyk7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgIDxkaXYgY2xhc3M9XCJyZXNlcnZhdGlvbl9fdGFibGVzX19kaXZpZGVyXCI+JHtncm91cDF9PC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicmVzZXJ2YXRpb25fX3RhYmxlc19fZGl2aWRlclwiPiR7Z3JvdXAyfTwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInJlc2VydmF0aW9uX190YWJsZXNfX2RpdmlkZXJcIj4ke2dyb3VwM308L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyZXNlcnZhdGlvbl9fdGFibGVzX19kaXZpZGVyXCI+JHtncm91cDR9PC9kaXY+XHJcbiAgICBcclxuICAgIGA7XHJcbiAgICB9XHJcbiAgICBzZXR1cEV2ZW50cygpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBzZXR1cCBqcyBldmVudHMgd2hlbiB1c2VyIGZpcmUgZXZlbnQgb24gdGFibGUgb3IgY2hhaXIgc2hvdWxkXHJcbiAgICAgICAgICogQHJldHVybiBhIGNsaWNrZWQgaXRlbVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vIENIQUlSIEFDVElPTlxyXG4gICAgICAgIGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yQWxsKCcucmVzZXJ2YXRpb25fX3RhYmxlX19jaGFpcnNfX2l0ZW1fX2lkJylcclxuICAgICAgICAgICAgLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWUudGFyZ2V0LnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXNlcnZhdGlvbl9fdGFibGVfX2NoYWlyc19faXRlbS0tZGlzYWJsZWQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoYWlySWQgPSBlLnRhcmdldC5kYXRhc2V0LmNoYWlyaW5kZXhpZDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWJsZUxldmVsID0gZS50YXJnZXQuZGF0YXNldC50YWJsZWxldmVsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYmxlSWQgPSBlLnRhcmdldC5kYXRhc2V0LnRhYmxlaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hhaXJJdGVtID0gdGhpcy5maWx0ZXJDaGFpckJ5SWQoY2hhaXJJZCwgdGFibGVMZXZlbCwgdGFibGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9HR0xFIFNlbGVjdGVkIGNsYXNzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaXRlbS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ2lzU2VsZWN0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50VGFibGUgPSB0aGlzLmdldFRhYmxlQnlJZCh0YWJsZUxldmVsLCB0YWJsZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRhYmxlLnJlc2VydmVXaG9sZVRhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFibGVUcmlnZ2VyQ2xpY2sodGFibGVMZXZlbCwgdGFibGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjaGFpckl0ZW0uaXNQZW5kaW5nICYmICFjaGFpckl0ZW0uaXNSZXNlcnZlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhaXJzLnB1c2goY2hhaXJJdGVtKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaXJJdGVtLmlzUGVuZGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRDaGFpclRvUGVuZGluZ1N0YXR1cyhjaGFpckl0ZW0ubGV2ZWxOYW1lICsgY2hhaXJJdGVtLmNoYWlySWQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGFpckl0ZW0uaXNQZW5kaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlySXRlbS5pc1BlbmRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RlZENoYWlyVG9QZW5kaW5nU3RhdHVzKGNoYWlySXRlbS5sZXZlbE5hbWUgKyBjaGFpckl0ZW0uY2hhaXJJZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhaXJzID0gdGhpcy5zZWxlY3RlZENoYWlycy5maWx0ZXIoKGNoYWlyKSA9PiBjaGFpci5jaGFpcklkICE9PSBjaGFpckl0ZW0uY2hhaXJJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5jaGFpckNsaWNrSGFuZGxlcihjaGFpckl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBUQUJMRSBBQ1RJT05cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVzZXJ2YXRpb25fX3RhYmxlX19pZCcpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpdGVtLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdyZXNlcnZhdGlvbl9fdGFibGUtLWRpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPR0dMRSBTZWxlY3RlZCBjbGFzc1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGl0ZW0uY2xhc3NMaXN0LnRvZ2dsZSgnaXNTZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYmxlSWQgPSBlLnRhcmdldC5kYXRhc2V0LnRhYmxlaW5kZXhpZDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWJsZVR5cGUgPSBlLnRhcmdldC5kYXRhc2V0LnRhYmxldHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWJsZVR5cGVEYXRhID0gdGhpcy5kYXRhW3RhYmxlVHlwZV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFibGVGaWx0ZXJlZEJ5SWQgPSB0YWJsZVR5cGVEYXRhLmZpbHRlcigodGFibGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhYmxlLnRhYmxlSWQgPT0gdGFibGVJZDtcclxuICAgICAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBoYXNSZXNlcnZhdGlvbiA9IHRhYmxlRmlsdGVyZWRCeUlkLmNoYWlycy5maWx0ZXIoKGNoYWlyKSA9PiBjaGFpci5pc1Jlc2VydmVkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1RhYmxlUGVuZGluZyA9IGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygncmVzZXJ2YXRpb25fX3RhYmxlLS1wZW5kaW5nJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRDaGFpckF2YWlsYWJsZSA9IHRhYmxlRmlsdGVyZWRCeUlkLmNoYWlycy5maWx0ZXIoKGNoYWlyKSA9PiBjaGFpci5hdmFpbGFibGUgIT09IGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzUmVzZXJ2YXRpb24ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRhYmxlRmlsdGVyZWRCeUlkLmlzUmVzZXJ2ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICghaGFzUmVzZXJ2YXRpb24ubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICF0YWJsZUZpbHRlcmVkQnlJZC5pc1Jlc2VydmVkICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICFpc1RhYmxlUGVuZGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBREQgSVRFTVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGFpcnMgPSB0aGlzLmdldFVuaXF1ZURhdGEoW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5zZWxlY3RlZENoYWlycyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLmZpbHRlcmVkQ2hhaXJBdmFpbGFibGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhaXJzID0gY2hhaXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdyZXNlcnZhdGlvbl9fdGFibGUtLXBlbmRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRDaGFpckF2YWlsYWJsZS5mb3JFYWNoKChjaGFpcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaXIuaXNQZW5kaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRDaGFpclRvUGVuZGluZ1N0YXR1cyhjaGFpci5sZXZlbE5hbWUgKyBjaGFpci5jaGFpcklkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAgUkVNT1ZFIElURU1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyZWRDaGFpckF2YWlsYWJsZS5mb3JFYWNoKChjaGFpcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaXIuaXNQZW5kaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhaXJzID0gdGhpcy5zZWxlY3RlZENoYWlycy5maWx0ZXIoKGNoKSA9PiBjaC5jaGFpcklkICE9PSBjaGFpci5jaGFpcklkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2VsZWN0ZWRDaGFpclRvUGVuZGluZ1N0YXR1cyhjaGFpci5sZXZlbE5hbWUgKyBjaGFpci5jaGFpcklkLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdyZXNlcnZhdGlvbl9fdGFibGUtLXBlbmRpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy50YWJsZUNsaWNrSGFuZGxlcih0YWJsZUZpbHRlcmVkQnlJZCwgIWhhc1Jlc2VydmF0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIFpPT00gQUNUSU9OXHJcbiAgICAgICAgZG9jdW1lbnRcclxuICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKCd6b29tSW4nKVxyXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLnpvb21JbkhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgZG9jdW1lbnRcclxuICAgICAgICAgICAgLmdldEVsZW1lbnRCeUlkKCd6b29tT3V0JylcclxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy56b29tT3V0SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICBkb2N1bWVudFxyXG4gICAgICAgICAgICAuZ2V0RWxlbWVudEJ5SWQoJ3pvb21SZXNldCcpXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuem9vbVJlc2V0SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuICAgIHpvb21JbkhhbmRsZXIoKSB7XHJcbiAgICAgICAgdGhpcy56b29tIDwgMTMwID8gKHRoaXMuem9vbSArPSAxMCkgOiB0aGlzLnpvb207XHJcbiAgICAgICAgdGhpcy51cGRhdGVUYWJsZVpvb20oKTtcclxuICAgIH1cclxuICAgIHpvb21PdXRIYW5kbGVyKCkge1xyXG4gICAgICAgIHRoaXMuem9vbSA+IDMwID8gKHRoaXMuem9vbSAtPSAxMCkgOiAodGhpcy56b29tID0gMzApO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVGFibGVab29tKCk7XHJcbiAgICB9XHJcbiAgICB6b29tUmVzZXRIYW5kbGVyKCkge1xyXG4gICAgICAgIHRoaXMuem9vbSA9IDUwO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVGFibGVab29tKCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVUYWJsZVpvb20oKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZXNlcnZhdGlvbicpO1xyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUuem9vbSA9IHRoaXMuem9vbSArICclJztcclxuICAgICAgICB0aGlzLm9wdGlvbnMub25ab29tKCk7XHJcbiAgICB9XHJcbiAgICB1cGRhdGVTZWxlY3RlZENoYWlyVG9QZW5kaW5nU3RhdHVzKGNoYWlySUQsIGlzUGVuZGluZykge1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtdW5pcXVlaWQ9JHtjaGFpcklEfV1gKS5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgIGxldCBjbGFzc05hbWUgPSAncmVzZXJ2YXRpb25fX3RhYmxlX19jaGFpcnNfX2l0ZW0tLWlzUGVuZGluZyc7XHJcbiAgICAgICAgaWYgKGlzUGVuZGluZykge1xyXG4gICAgICAgICAgICBzZWxlY3Rvci50aXRsZSA9ICd0aGlzIGNoYWlyIGlzIHBlbmRpbmcnO1xyXG4gICAgICAgICAgICBzZWxlY3Rvci5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxlY3Rvci50aXRsZSA9ICcnO1xyXG4gICAgICAgICAgICBzZWxlY3Rvci5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZmlsdGVyQ2hhaXJCeUlkKGNoYWlySWQsIHRhYmxlTGV2ZWwsIHRhYmxlSWQpIHtcclxuICAgICAgICAvLyBjb25zdCBjaGFpclR5cGUgPSBjaGFpcklkLnNsaWNlKDAsIDEpO1xyXG4gICAgICAgIC8vIGNvbnN0IHRhYmxlVHlwZSA9ICdsZXZlbCcgKyBjaGFpclR5cGU7XHJcbiAgICAgICAgLy8gY29uc3QgdGFibGVJZCA9IGNoYWlySWQuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIC8vIGNvbnN0IHNlbGVjdGVkVHlwZTogSVRhYmxlW10gPSB0aGlzLmRhdGFbdGFibGVMZXZlbF07XHJcbiAgICAgICAgY29uc3QgY2hhaXJGaWx0ZXJlZEJ5SWQgPSB0aGlzLmdldFRhYmxlQnlJZCh0YWJsZUxldmVsLCB0YWJsZUlkKVxyXG4gICAgICAgICAgICAuY2hhaXJzLmZpbHRlcigoY2hhaXIpID0+IGNoYWlyLmNoYWlySWQgPT0gY2hhaXJJZClbMF07XHJcbiAgICAgICAgcmV0dXJuIGNoYWlyRmlsdGVyZWRCeUlkO1xyXG4gICAgfVxyXG4gICAgZ2V0RGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgfVxyXG4gICAgZ2V0U2VsZWN0ZWRDaGFpcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZWxlY3RlZENoYWlycztcclxuICAgIH1cclxuICAgIGdldFVuaXF1ZURhdGEoZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGNoYWlycyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHVuaXF1ZSA9IG5ldyBTZXQoZGF0YSk7XHJcbiAgICAgICAgdW5pcXVlLmZvckVhY2goKGNoYWlyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGlmICghY2hhaXIuaXNQZW5kaW5nKSB7XHJcbiAgICAgICAgICAgIGNoYWlycy5wdXNoKGNoYWlyKTtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjaGFpcnM7XHJcbiAgICB9XHJcbiAgICBnZXRUYWJsZUJ5SWQobGV2ZWxJZCwgdGFibGVJZCkge1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkVHlwZSA9IHRoaXMuZGF0YVtsZXZlbElkXTtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZFRhYmxlID0gc2VsZWN0ZWRUeXBlXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKHRhYmxlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0YWJsZS50YWJsZUlkID09IHRhYmxlSWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0YWJsZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pWzBdO1xyXG4gICAgICAgIHJldHVybiBzZWxlY3RlZFRhYmxlO1xyXG4gICAgfVxyXG4gICAgdGFibGVUcmlnZ2VyQ2xpY2sobGV2ZWxJZCwgdGFibGVJZCkge1xyXG4gICAgICAgIGNvbnN0IHRhYmxlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5yZXNlcnZhdGlvbl9fdGFibGVfX2lkW2RhdGEtdGFibGV0eXBlPScke2xldmVsSWR9J11bZGF0YS10YWJsZWluZGV4aWQ9JyR7dGFibGVJZH0nXWApO1xyXG4gICAgICAgIHRhYmxlRWxlbWVudC5jbGljaygpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUmVzZXJ2YXRpb24gPSBSZXNlcnZhdGlvbjtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IFJlc2VydmF0aW9uXzEgPSByZXF1aXJlKFwiLi9SZXNlcnZhdGlvblwiKTtcclxud2luZG93LlJlc2VydmF0aW9uID0gUmVzZXJ2YXRpb25fMS5SZXNlcnZhdGlvbjtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9