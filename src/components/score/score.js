import './score.css';

export class Score {
	constructor(goblin) {
		this.goblin = goblin || null; // ссылка на гоблина для обратной связи: сли гоблин передан - сохраняем, если нет - будет null
		this.score = 0; // количество попаданий
		this.misses = 0; // промахи
		this.maxMisses = 5; // условие задачи - промахи max 5
		this.gameActive = true;
		this.createScoreDisplay();
		this.addClickHandler();
        this.modalHandlerCreated = false;//флаг, чтобы создать обработчик только один раз
	}

    setGoblin(goblin) {
        this.goblin = goblin;
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
        const parseIntClickedIndex = parseInt(clickedIndex, 10);
		if (parseIntClickedIndex === this.goblin.currentPosition) { //значит попали и нужно засчитать +1
			this.goblin.hideGoblin(); //условие задачи - гоблин изсчез сразу из ячейки если по нему кликнули
            this.addScore(); //условие задачи -пользователю засчитывается +1 балл			
		    
            if(this.goblin.goblinTimeout) {// Очищаем таймер исчезновения
                clearTimeout(this.goblin.goblinTimeout);
                this.goblin.goblinTimeout = null;
            }
            
            this.goblin.moveGoblinRandomly();//гоблин сразу появляется в другой ячейке
        } else {
            this.addMiss();
		}
	}
    
    setupModal() {
        const modal = document.querySelector('.modal-window');
        modal.classList.toggle('hidden');

        if (!this.modalHandlerCreated) {//Создаем обработчик ТОЛЬКО если его еще нет
            const restartBtn = document.querySelector('.modal-button');               
            
            restartBtn.addEventListener('click', () => {
                this.restartGame();      
                modal.classList.toggle('hidden'); // Скрываем окно
            })

            this.modalHandlerCreated = true;
        }
    }

    restartGame() {      
        this.score = 0;
        this.misses = 0;
        this.gameActive = true;

        this.scoreDisplay.innerHTML = `Счёт: ${this.score}`;
		this.missesDisplay.innerHTML = `Пропустил гоблина: ${this.misses}`;              
        if (this.goblin) {// Перезапускаем игру с гоблином
            this.goblin.stopGame();// Останавливаем старую игру

            const gameBoard = document.querySelector('.game-board');
            gameBoard.innerHTML = '';
            
            this.goblin.init();
        }           
    }

	gameOver() {
		if (!this.gameActive) return; // ← Если игра окончена, ничего не делаем
		
        console.log('ИГРА ОКОНЧЕНА! Слишком много промахов!');
        this.gameActive = false;

		if (this.goblin) {
			this.goblin.stopGame();
		}
        
        this.setupModal();        
	}
}