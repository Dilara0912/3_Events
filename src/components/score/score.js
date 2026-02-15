import './score.css';

export class Score {
	constructor(goblin) {
		this.goblin = goblin; // ссылка на гоблина для обратной связи
		this.score = 0; // количество попаданий
		this.misses = 0; // промахи
		this.maxMisses = 5; // условие задачи - промахи max 5
		this.gameActive = true;
		this.createScoreDisplay();
		this.addClickHandler();
	}

	createScoreDisplay() { // Добавляем отображение счёта
		const container = document.querySelector('.container'); // Находим контейнер

		this.scoreDisplay = document.createElement('div'); // Создаём блок со счётом
		this.scoreDisplay.classList.add('score-display');
		this.scoreDisplay.innerHTML = `Счёт: ${this.score}`;

		this.missesDisplay = document.createElement('div'); // Создаём блок промахов
		this.missesDisplay.classList.add('misses-display');
		this.missesDisplay.innerHTML = `Пропустил гоблина: ${this.misses}`;
		container.append(this.scoreDisplay, this.missesDisplay);
	}

	addScore() {
		if (!this.gameActive) return; // ← Если игра окончена, ничего не делаем

		this.score += 1;
		this.scoreDisplay.innerHTML = `Счёт: ${this.score}`;
	}

	addMiss() {
		if (!this.gameActive) return; // ← Если игра окончена, ничего не делаем

		if (this.misses >= this.maxMisses) {
			return;
		}

		this.misses += 1;
		const remain = this.maxMisses - this.misses;
		this.missesDisplay.innerHTML = `Пропустил гоблина: ${remain}`;

		if (this.misses >= this.maxMisses) {
			this.gameOver();
		}
	}

	addClickHandler() {
		const gameBoard = document.querySelector('.game-board'); //Поиск игрового поля в HTML

		gameBoard.addEventListener('click', (event) => {
			const cell = event.target.closest('.cell'); //метод closest ищет ближайшего родителя, подпадающего под селектор .cell
			if (!cell) return; //Защита от пустых кликов

			cell.classList.add('hammer-cursor');

			const clickedIndex = cell.dataset.id; //Получение индекса нажатой ячейки
			this.handleCellClick(clickedIndex);
		})
	}

	handleCellClick(clickedIndex) {
		if (clickedIndex === this.goblin.currentPosition) { //значит попали и нужно засчитать +1
			this.addScore(); //условие задачи -пользователю засчитывается +1 балл
			this.goblin.hideGoblin(); //условие задачи - гоблин пропадает из ячейки
		} else {
			this.addMiss();
		}
	}

	gameOver() {
		if (!this.gameActive) return; // ← Если игра окончена, ничего не делаем
		console.log('ИГРА ОКОНЧЕНА! Слишком много промахов!');
		this.goblin.stopGame();

		alert('ИГРА ОКОНЧЕНА! Слишком много промахов!');
	}
}