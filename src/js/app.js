// TODO: write code here
import TraversingGoblin from '../components/goblin/goblin';
import { Score } from '../components/score/score';

window.addEventListener('DOMContentLoaded', () => { //Запуск при загрузке страницы
  const score = new Score();
  const goblin = new TraversingGoblin(score);

  score.setGoblin(goblin); //передаём гоблина в счёт для двусторонней связи
});


