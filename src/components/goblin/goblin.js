// TODO: write code here
import "./goblin.css";
import goblinImage from "./goblin.png";

export default class TraversingGoblin {
  constructor(score) {
    // В конструкторе ИНИЦИАЛИЗИРУЕМ свойства
    this.totalCells = 16;
    this.currentPosition = null;

    this.gameInterval = null;
    this.isGameRunning = false;

    this.goblinTimeout = null; // для таймера исчезновения
    this.isGoblinVisible = false;

    this.score = score; // ссылка на счет из класса Score для обратной связи

    this.init(); // ВЫЗЫВАЕМ метод инициализации у этого экземпляра
  }

  init() {
    // ОПРЕДЕЛЯЕМ метод для класса
    this.createBoard(); // Создаём поле
    this.createGoblin(); // Создаём гоблина
    this.startGame();
  }

  createBoard() {
    const gameBoard = document.querySelector(".game-board"); // Находим контейнер
    gameBoard.innerHTML = ""; // Очищаем (на случай перезапуска)

    for (let i = 0; i < this.totalCells; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell"); //Добавляем класс для ячейки - будет: class="cell"
      cell.dataset.id = i; //Добавляем data-атрибут для этой же ячейки - будет: data-id="0"
      gameBoard.append(cell); //Добавляем узел в DOM в конец списка дочерних
    }
  }

  createGoblin() {
    const oldGoblin = document.querySelector(".goblin");
    if (oldGoblin) {
      // Удаляем старого гнома (при сбросе игры)
      oldGoblin.remove();
    }

    this.goblin = document.createElement("img");
    this.goblin.classList.add("goblin");
    this.goblin.alt = "Изображение гоблина";
    this.goblin.src = goblinImage;
  }

  showGoblin(position) {
    this.hideGoblin(); // Убираем гоблина с текущей позиции, если он где-то есть
    this.currentPosition = position; //Устанавливаем новая позиция

    const targetCell = document.querySelector(
      `.cell[data-id='${this.currentPosition}']`,
    ); //ищем КЛЕТКУ в DOM
    targetCell.append(this.goblin); // добавляем гоблина в найденную клетку
    this.isGoblinVisible = true;
    this.setDisappearTimer(); //таймер на автоматическое исчезновение
  }

  setDisappearTimer() {
    if (this.goblinTimeout) {
      clearTimeout(this.goblinTimeout);
    }

    this.goblinTimeout = setTimeout(() => {
      // Устанавливаем новый таймер на 1 секунду
      if (this.isGoblinVisible && this.isGameRunning) {
        this.hideGoblin();

        if (this.score && this.score.gameActive) {
          // Уведомляем Score о промахе
          this.score.addMiss();
        }
        if (this.isGameRunning) {
          this.moveGoblinRandomly();
        }
      }
    }, 1000);
  }

  hideGoblin() {
    if (this.goblin) {
      this.goblin.remove(); // Убираем гоблина из DOM
      this.isGoblinVisible = false;
    }
  }

  moveGoblinRandomly() {
    console.log("moveGoblinRandomly вызван в", new Date().toLocaleTimeString());

    if (this.goblinTimeout) {
      // Очищаем предыдущий таймер
      clearTimeout(this.goblinTimeout);
      this.goblinTimeout = null;
    }

    let newPosition; // Выбираем случайную позицию
    do {
      //цикл сначала выполняет код, потом проверяет условие
      newPosition = Math.floor(Math.random() * this.totalCells); //случайная позиция из 16 клеток, округляется вниз до меньшего - случайно сгенерированное
    } while (newPosition === this.currentPosition); //цикл повторяется, если мы попали на туже позицию, чтобы сменить позицию

    this.showGoblin(newPosition); // Показываем гоблина в новой позиции
  }

  startGame() {
    if (this.isGameRunning) {
      return;
    }

    this.isGameRunning = true; // ← Просто запись в память: "игра запущена". Никакой магии, просто меняет значение с false на true, нужен для проверки состояния через if

    this.moveGoblinRandomly(); // ← Первое появление сразу, потом каждые 2 секунды

    this.startGameInterval();
  }

  startGameInterval() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }

    this.gameInterval = setInterval(() => {
      // Таймер: каждые 2 секунды перемещаем гоблина
      if (this.isGameRunning) {
        // Принудительно перемещаем гоблина, даже если он ещё висит
        console.log("Интервал 2с сработал");
        if (this.isGoblinVisible) {
          // Но при этом сохраняем логику промахов - гоблин висит, значит игрок его не поймал - это промах
          this.hideGoblin();
          if (this.score && this.score.gameActive) {
            this.score.addMiss();
          }
        }
        this.moveGoblinRandomly();
      }
    }, 2000);
  }

  resetGameInterval() {
    //метод для сброса интервала при клике
    if (this.isGameRunning) {
      this.startGameInterval(); // перезапускаем интервал
    }
  }

  stopGame() {
    this.isGameRunning = false;
    clearInterval(this.gameInterval);
    clearTimeout(this.goblinTimeout);
    this.hideGoblin();
  }
}
