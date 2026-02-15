// TODO: write code here
import TraversingGoblin from '../components/goblin/goblin';
import { Score } from '../components/score/score';

window.addEventListener('DOMContentLoaded', () => { //Запуск при загрузке страницы
  const goblin = new TraversingGoblin();
  const score = new Score(goblin);
});


