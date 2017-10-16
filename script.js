const layOutDay = (() => {
	'use strict';
	
	let numberOfColumns = 0;
	let collidedEvents = {};
	let eventIdNumber = 0;
	let singleColumns = { '0': [] };

	return (eventObj) => {
		let eventsLength = eventObj.length;

		for (let i = 0; i < eventsLength; i++) {
			newEvent(eventObj[i], eventIdNumber);
			eventIdNumber++;
		}

		adjustSize();
	};


	function newEvent(event, id) {
		let divElement = document.createElement('div');
		let h2Element = document.createElement('h2');

		h2Element.appendChild(document.createTextNode('Sample Location'));

		divElement.appendChild(document.createTextNode('Sample Item'));
		divElement.appendChild(h2Element);
		divElement.className = 'event';
		divElement.id = 'event' + id;
		divElement.style.top = (event.start) + 'px';
		divElement.style.height = (event.end - event.start) + 'px';

		document.getElementById('events').appendChild(divElement);

		createEventInColumn(divElement);
	}

	function createEventInColumn(el) {
		if (numberOfColumns === 0 && !isEventCollision(singleColumns[0], el)) {
			singleColumns[0].push(el);
			addEventCollaped(el);
			return;
		} else if (numberOfColumns === 0 && isEventCollision(singleColumns[0], el)) {
			singleColumns[++numberOfColumns] = [el];
			addEventCollaped(el);
			return;
		} else {
			for (let i = 0; i <= numberOfColumns; i++) {
				if (!isEventCollision(singleColumns[i], el)) {
					singleColumns[i].push(el);
					addEventCollaped(el);
					return;
				}
			}
		}

		singleColumns[++numberOfColumns] = [el];
		addEventCollaped(el);
	}

	function addEventCollaped(el) {
		let events = Array.prototype.slice.call(document.getElementsByClassName('event'));
		let eventsLength = events.length;
		let elementBottom = stringToNumberConvert(el.style.top) + stringToNumberConvert(el.style.height);
		let elementTop = stringToNumberConvert(el.style.top);

		for (let j = 0; j < eventsLength; j++) {
			let eventBottom = stringToNumberConvert(events[j].style.top) + stringToNumberConvert(events[j].style.height);
			let eventTop = stringToNumberConvert(events[j].style.top);

			if ((elementTop >= eventTop && elementTop < eventBottom) ||
				(elementBottom > eventTop && elementBottom <= eventBottom) ||
				(elementTop <= eventTop && elementBottom >= eventBottom)) {
				if (el.id !== events[j].id) {
					createOverlapedEvent(events[j], el);
				}
			}
		}
	}

	function createOverlapedEvent(event, el) {
		if (collidedEvents[event.id] !== undefined && collidedEvents[event.id].indexOf(el) === -1) {
			collidedEvents[event.id].push(el);
		} else if (collidedEvents[event.id] === undefined) {
			collidedEvents[event.id] = [el];
		}

		if (collidedEvents[el.id] !== undefined && collidedEvents[el.id].indexOf(event) === -1) {
			collidedEvents[el.id].push(event);
		} else if (collidedEvents[el.id] === undefined) {
			collidedEvents[el.id] = [event];
		}
	}

	function isEventCollision(col, el) {
		let elementBottom = stringToNumberConvert(el.style.top) + stringToNumberConvert(el.style.height);
		let elementTop = stringToNumberConvert(el.style.top);

		for (let i = 0; i < col.length; i++) {
			let eventBottom = stringToNumberConvert(col[i].style.top) + stringToNumberConvert(col[i].style.height);
			let eventTop = stringToNumberConvert(col[i].style.top);

			if ((elementTop >= eventTop && elementTop < eventBottom) ||
				(elementBottom > eventTop && elementBottom <= eventBottom) ||
				(elementTop <= eventTop && elementBottom >= eventBottom)) {
				return true;
			}
		}

		return false;
	}

	function stringToNumberConvert(str) {
		if (str === '') { return 0; }
		return parseInt(str.replace(/px$/g, ''), 10);
	}

	function adjustSize() {
		let width = 600 / (numberOfColumns + 1);

		for (let i = 0; i <= numberOfColumns; i++) {
			for (let j = 0; j < singleColumns[i].length; j++) {
				singleColumns[i][j].style.width = (width - 3) + 'px';
				singleColumns[i][j].style.marginLeft = width * i + 'px';
			}
		}
	}

})();

layOutDay([{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}]);