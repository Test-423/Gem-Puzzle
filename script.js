
const pausen = {
   check: false
}
const menu_stat = {
   continue: false,
   start: false
}
const timer = {
   min: 0,
   sec: 0,
   milisec: 0
}
const clicks = {
   count: 0,
   isWin: false
}
const game = {
   dimension: 0,
   col: 0
}
let drag_status;
const dragOver = function (evt) {
   evt.preventDefault();
}
const dragDrop = function (event) {
   console.log(drag_status.textContent)
   for (let i = 1; i < 16; i++) {
      if (drag_status.textContent === `${cells[i].value}`) move(i)
   }
}
const dragStart = function () {
   drag_status = this;
   console.log(drag_status)
}
const dragEnd = function () {
   drag_status = 0;
}
const slide = {
   index: 1,
   card: 0
}
function gamebox_render() {
   let game = document.createElement("div");
   game.className = "game";
   document.body.append(game);
   let gamebox = document.createElement("div");
   gamebox.className = "gamebox";
   game.append(gamebox);
   let field = document.createElement("div");
   field.className = "field";
   document.querySelector(".gamebox").append(field);
}
gamebox_render();
function controller_render() {
   let bottom_controls = document.createElement("div");
   bottom_controls.className = "controller";
   document.querySelector(".game").append(bottom_controls);
   let controller__turning = document.createElement("div");
   controller__turning.className = "controller__turning";
   document.querySelector(".controller").append(controller__turning);
   let controller__timer = document.createElement("div");
   controller__timer.className = "controller__timer";
   document.querySelector(".controller").append(controller__timer);
   let controller__pausen = document.createElement("div");
   controller__pausen.className = "controller__pausen";
   document.querySelector(".controller").append(controller__pausen);
   create_turning();
}
controller_render();
function menu_render() {
   let menu = document.createElement("div");
   menu.className = "menu";
   document.querySelector(".game").append(menu);
   menu_buttons()
}
menu_render();

function menu_buttons() {
   let buttons_block = document.createElement("div");
   buttons_block.className = "buttons_block"
   document.querySelector(".menu").append(buttons_block);
   let restart_box = document.createElement("button");
   restart_box.className = "restart";
   if (menu_stat.start === true) {
      restart_box.innerHTML = "Restart";
   }
   else {
      restart_box.innerHTML = "New Game";
      restart_box.style.height = "70px";
   }
   document.querySelector(".buttons_block").append(restart_box);
   document.querySelector(".restart").addEventListener("click", change_dimension);
   let saved_games = document.createElement("button")
   saved_games.className = "loadgames"
   saved_games.innerHTML = "Saved Games"
   saved_games.style.height = "70px"
   document.querySelector(".buttons_block").append(saved_games);
   document.querySelector(".loadgames").addEventListener("click", savedGames);
   if (menu_stat.continue === true) {
      let cont_box = document.createElement("button");
      cont_box.className = "continue";
      cont_box.innerHTML = "Continue";
      document.querySelector(".buttons_block").append(cont_box);
      document.querySelector(".continue").addEventListener("click", continue_button);
      if (clicks.isWin === false) {
         let saving = document.createElement("button")
         saving.className = "saving"
         saving.innerHTML = "Save Game ?"
         saving.style.height = "70px"
         document.querySelector(".buttons_block").append(saving);
         document.querySelector(".saving").addEventListener("click", saving_func);
      }
   }
}
//const field = document.querySelector(".field");

const empty = {
   value: 0,
   top: 0,
   left: 0,
   size: 0
};
let cells = [];
function gameDimension(n) {
   game.col = n
   if (n === 3) {
      game.dimension = 8;
   }
   else if (n === 4) {
      game.dimension = 15;
   }
   else if (n === 5) {
      game.dimension = 24;
   }
   else if (n === 6) {
      game.dimension = 35;
   }
   else if (n === 7) {
      game.dimension = 48;
   }
   else if (n === 8) {
      game.dimension = 63;
   }
   else {
      game.dimension = 8
   }
   console.log(game.dimension)
}
gameDimension(5)
let cellSize = document.querySelector(".field").offsetWidth / game.col;
console.log(cellSize)
function move(index) {
   cellSize = document.querySelector(".field").offsetWidth / game.col;
   const cell = cells[index];

   const leftDif = Math.abs(empty.left - cell.left);
   const topDif = Math.abs(empty.top - cell.top);

   if ((leftDif + topDif > 1)) return;
   clicks.count++;
   document.querySelector(".turning").innerHTML = `Turns: ${clicks.count}`;
   //console.log(empty.left)
   cell.element.style.left = `${empty.left * cellSize}px `;
   cell.element.style.top = `${empty.top * cellSize}px `;

   const emptyLeft = empty.left;
   const emptyTop = empty.top;
   empty.left = cell.left;
   empty.top = cell.top;
   cell.left = emptyLeft;
   cell.top = emptyTop;

   document.querySelector(".empty").style.left = `${empty.left * cellSize}px`
   document.querySelector(".empty").style.top = `${empty.top * cellSize}px`
   dragability()
   //console.log(empty)
   const isFinished = cells.every(cell => {
      return cell.value === cell.top * game.col + cell.left;
   })

   if (isFinished) {
      alert(`Ура ! Вы решили головоломку за ${timer.min}:${timer.sec} и ${clicks.count} шагов`);
      [].forEach.call(document.querySelectorAll('.cell'), function (e) {
         e.classList.add('unclickable');
      });
      window.clearInterval(window.timerId);
      clicks.isWin = !clicks.isWin;
      document.querySelector('.pause').remove();
      menu_render();
   }

}
//
let numbers = [...Array(game.dimension).keys()]
filling();
[].forEach.call(document.querySelectorAll('.cell'), function (e) {
   e.classList.add('unclickable');
});

function dragability() {
   let all_cells = document.querySelectorAll(".cell"), leftDif, topDif, list = [];
   for (let cell of cells) {
      leftDif = Math.abs(empty.left - cell.left);
      topDif = Math.abs(empty.top - cell.top);
      if ((leftDif + topDif === 1)) list.push(cell.value);
   }
   console.log(list)
   for (let cell of all_cells) {
      cell.draggable = false;
      for (let i = 0; i < list.length; i++) {
         if (cell.textContent === `${list[i]}`) {
            cell.draggable = true;
            cell.addEventListener("dragstart", dragStart);
            cell.addEventListener("dragend", dragEnd);
         };
      }
   }
}
function filling() {
   cells = []
   cells.push(empty);
   cellSize = document.querySelector(".field").offsetWidth / game.col;
   let empty_cell = document.createElement("div");
   empty_cell.className = "empty";
   empty_cell.style.left = `${empty.left * cellSize}px`
   empty_cell.style.top = `${empty.top * cellSize}px`
   document.querySelector(".field").append(empty_cell);
   document.querySelector(".empty").addEventListener("dragover", dragOver);
   document.querySelector(".empty").addEventListener("drop", dragDrop);
   for (let i = 1; i <= game.dimension; i++) {
      const cell = document.createElement("div");
      const value = numbers[i - 1] + 1;
      cell.className = "cell";
      cell.innerHTML = value;
      const left = i % game.col;
      const top = (i - left) / game.col;

      cells[i] = ({
         value: value,
         left: left,
         top: top,
         element: cell
      });
      cell.style.left = `${left * cellSize}px `;
      cell.style.top = `${top * cellSize}px `;
      cell.style.width = `${cellSize}px`
      cell.style.height = `${cellSize}px`

      empty.left = 0;
      empty.top = 0;
      document.querySelector(".field").append(cell);
      cell.addEventListener('click', () => {
         move(i);
      });
   }
   console.log(cells)
}

timer_constructor();
function change_dimension(){
   let dim_block = document.createElement("div")
   dim_block.className = "dimension__block"
   document.querySelector(".menu").append(dim_block)
   let saved_exit = document.createElement("div")
   saved_exit.className = "saved__exit"
   saved_exit.style["background-color"] = "rgba(245, 248, 52,0.2)";
   dim_block.append(saved_exit)
   let exit_button = document.createElement("button")
   exit_button.className = "saved_exit_icon"
   document.querySelector(".saved__exit").append(exit_button)
   document.querySelector(".saved_exit_icon").addEventListener("click", () => {
      document.querySelector(".saved__exit").remove();
      document.querySelector(".dimension__block").remove();
      menu_buttons()
   })
   let exit_icon = document.createElement("i")
   exit_icon.className = "material-icons"
   exit_icon.innerHTML = "backspace"
   exit_button.append(exit_icon)
   if (document.querySelector(".buttons_block")) document.querySelector(".buttons_block").remove();

   let dim_box = document.createElement("div")
   dim_box.classList = "dimension__box"
   dim_block.append(dim_box)
   for(let i=3; i<9;i++){
      let dim = document.createElement("div")
      dim.classList = "dimension__cell"
      dim.innerHTML = `${i}x${i}`
      dim.style.width = `${dim_box.offsetHeight/2}px`
      dim.style.height = `${dim_box.offsetHeight/2}px`
      dim.style["border-radius"] = `${dim_box.offsetHeight/4}px`
      dim_box.append(dim)
      dim.addEventListener("click", ()=>{
         gameDimension(i)
         numbers = [...Array(game.dimension).keys()]
         restart_fun();
      })
   }
}
function restart_fun() {
   clicks.count = 0;
   if (clicks.isWin === true) clicks.isWin = !clicks.isWin
   document.querySelector(".turning").innerHTML = `Turns: ${clicks.count}`;
   if (menu_stat.continue === false) {
      menu_stat.continue = true;
      menu_stat.start = true;
   }

   timer.min = 0;
   timer.sec = 0;
   timer.milisec = 0;
   document.querySelector(".timer__sec").innerHTML = `0${timer.sec}`;
   document.querySelector(".timer__min").innerHTML = `0${timer.min}`;

   if(document.querySelector(".restart"))document.querySelector(".restart").remove();
   document.querySelector('.menu').remove();
   document.querySelector(".empty").remove();
   [].forEach.call(document.querySelectorAll('.cell'), function (e) {
      e.parentNode.removeChild(e);
   });
   cells[0] = ({
      value: 0,
      top: 0,
      left: 0
   });
   //shuffle(numbers);
   empty.top = 0;
   empty.left = 0;
   filling();
   dragability();
   [].forEach.call(document.querySelectorAll('.cell'), function (e) {
      e.classList.remove('unclickable');
   });
   startTimer();
   cleate_pause();
};
function savedGames() {
   let col = 0
   for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      col++;
   }
   if (col === 0) {
      alert("У вас нет ни одного сохранения! ")
      return;
   }
   if (document.querySelector(".buttons_block")) document.querySelector(".buttons_block").remove();
   let massive = [];
   //
   let saved_block = document.createElement("div")
   saved_block.className = "saved_block"
   document.querySelector(".menu").append(saved_block)
   let saved_exit = document.createElement("div")
   saved_exit.className = "saved__exit"
   document.querySelector(".saved_block").append(saved_exit)
   let exit_button = document.createElement("button")
   exit_button.className = "saved_exit_icon"
   document.querySelector(".saved__exit").append(exit_button)
   document.querySelector(".saved_exit_icon").addEventListener("click", () => {
      document.querySelector(".saved_block").remove();
      massive = [];
      menu_buttons()
   })
   let exit_icon = document.createElement("i")
   exit_icon.className = "material-icons"
   exit_icon.innerHTML = "backspace"
   document.querySelector(".saved_exit_icon").append(exit_icon)
   //
   let saves_block = document.createElement("div")
   saves_block.className = "saves_block"
   document.querySelector(".saved_block").append(saves_block);
   let saves_controls = document.createElement("div")
   saves_controls.className = "saves_control"
   document.querySelector(".saved_block").append(saves_controls);
   //
   let left_button = document.createElement("button")
   left_button.className = "saved_icon_left"
   left_button.innerHTML = "<"
   document.querySelector(".saves_control").append(left_button)
   document.querySelector(".saved_icon_left").addEventListener("click", () => {
      showSlides(slide.index -= 1)
   })
   let right_button = document.createElement("button")
   right_button.className = "saved_icon_right"
   right_button.innerHTML = ">"
   document.querySelector(".saves_control").append(right_button)
   document.querySelector(".saved_icon_right").addEventListener("click", () => {
      showSlides(slide.index += 1)
   })
   //

   for (let key in localStorage) {
      if (!localStorage.hasOwnProperty(key)) continue;
      massive.push(JSON.parse(localStorage.getItem(key)))
      let key_name = key;
      key = JSON.parse(localStorage.getItem(key))
      console.log(key)
      //console.log(JSON.parse(localStorage.getItem(key)))
      let card = document.createElement("div")
      card.className = "card"
      document.querySelector(".saves_block").append(card)
      console.log(card)
      let box = document.createElement("div")
      box.className = "card__box"
      card.append(box)
      let info = document.createElement("div")
      info.className = "card__info"
      card.append(info)
      let metrics = document.createElement("div")
      metrics.className = "card__metrics"
      info.append(metrics)
      let name = document.createElement("span")
      name.className = "info__name"
      name.innerHTML = `${key_name}`
      metrics.append(name)
      let turns = document.createElement("span")
      turns.className = "info__turns"
      turns.innerHTML = `Turns: ${key.turns}`
      metrics.append(turns)
      let time = document.createElement("span")
      time.className = "info__time"
      let time_min = (key.min < 10) ? ` 0${key.min}` : `${key.min}`;
      let time_sec = (key.sec < 10) ? ` 0${key.sec}` : `${key.sec}`;
      time.innerHTML = `Time: ${time_min}:${time_sec}`
      metrics.append(time)
      let start = document.createElement("button")
      start.className = "card__start"
      start.innerHTML = "Start ?"
      info.append(start)
      start.addEventListener('click', () => {
         saved_filling(key)
         dragability()
      })
      let saved_del = document.createElement("button")
      saved_del.className = "card__del"
      saved_del.innerHTML = "DEL";
      info.append(saved_del)
      saved_del.addEventListener('click', () => {
         localStorage.removeItem(key_name)
         document.querySelector(".saved_block").remove();
         if (localStorage.length === 0) {
            massive = [];
            menu_buttons()
         } else
            savedGames()
      })
      let width = 150 / key.col;
      console.log(key.col)
      for (let one of key.whole_cells) {
         if (one.value === 0) continue;
         let cell = document.createElement("div");
         cell.className = "microcell";
         cell.innerHTML = `${one.value}`
         cell.style.width = `${width}px`
         cell.style.height = `${width}px`
         cell.style.left = `${one.left * width}px`
         cell.style.top = `${one.top * width}px`
         box.append(cell);
      }
   }
   showSlides(slide.index)
}
function showSlides(index) {
   let slides = document.getElementsByClassName("card")
   if (index > slides.length) slide.index = 1
   if (index < 1) slide.index = slides.length
   for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none"
   }
   slides[slide.index - 1].style.display = "flex"
}
function saved_filling(key) {
   cells = []
   game.col = key.col;
   game.dimension = key.dimension;
   menu_stat.continue = true;
   clicks.count = key.turns;
   timer.min = key.min;
   timer.sec = key.sec;
   timer.milisec = key.milisec;
   document.querySelector(".turning").innerHTML = `Turns: ${clicks.count}`;
   console.log(timer.sec)
   console.log(timer.min)
   document.querySelector(".timer__sec").innerHTML = (timer.sec < 10) ? `0${timer.sec}` : `${timer.sec}`;
   document.querySelector(".timer__min").innerHTML = (timer.min < 10) ? `0${timer.min}` : `${timer.min}`;
   document.querySelector(".empty").remove();
   [].forEach.call(document.querySelectorAll('.cell'), function (e) {
      e.removeEventListener('click', () => {
         move(i);
      })
      e.parentNode.removeChild(e);
   });
   empty.left = key.empty_cell.left;
   console.log(empty.left)
   empty.top = key.empty_cell.top;
   cells.push(empty)
   let size = document.querySelector(".field").offsetWidth / key.col;
   let empty_cell = document.createElement("div");
   empty_cell.className = "empty";
   empty_cell.style.left = `${empty.left * size}px`
   empty_cell.style.top = `${empty.top * size}px`
   empty_cell.style.width = `${size}px`
   empty_cell.style.height = `${size}px`
   document.querySelector(".field").append(empty_cell);
   document.querySelector(".empty").addEventListener("dragover", dragOver);
   document.querySelector(".empty").addEventListener("drop", dragDrop);
   for (let i = 0; i <= key.dimension; i++) {
      cells[i] = key.whole_cells[i]
   }
   console.log(cells)
   for (let i = 1; i <= key.dimension; i++) {
      const cell = document.createElement("div");
      const value = cells[i].value;
      cell.className = "cell";
      cell.innerHTML = value;

      cell.style.left = `${cells[i].left * size}px `;
      cell.style.top = `${cells[i].top * size}px `;
      cell.style.width = `${size}px`
      cell.style.height = `${size}px`
      cells[i].element = cell;
      document.querySelector(".field").append(cell);
      cell.addEventListener('click', () => {
         move(i);
      });
   }
   console.log(cells)

}
function saving_func() {
   if (localStorage.length === 10) {
      alert("У вас уже имеется 10 сохранений. Освободите память для дальнейшей возможности сохранений")
   } else {
      console.log(localStorage.length)
      let save = {
         turns: clicks.count,
         min: timer.min,
         sec: timer.sec,
         milisec: timer.milisec,
         whole_cells: cells,
         empty_cell: empty,
         dimension: game.dimension,
         col: game.col
      }
      localStorage.setItem(`Save ${localStorage.length + 1}`, JSON.stringify(save))
      document.querySelector(".saving").innerHTML = "Already saved )"
      setTimeout(() => {
         if (document.querySelector(".saving"))
            document.querySelector(".saving").innerHTML = "Save Game ?"
      }, 2000);
   }

}
function pause_fun() {
   document.querySelector('.pause').remove();
   menu_render();
   window.clearInterval(window.timerId);
}
function cleate_pause() {
   let pause = document.createElement("button");
   pause.className = "pause";
   pause.innerHTML = "||";
   document.querySelector(".controller__pausen").append(pause);
   document.querySelector(".pause").addEventListener("click", pause_fun);
}
function create_turning() {
   let turning = document.createElement("span");
   turning.className = "turning";
   turning.innerHTML = "Turns: 0";
   document.querySelector(".controller__turning").append(turning);
}
function continue_button() {
   document.querySelector('.menu').remove();
   if (clicks.isWin === true) clicks.isWin = !clicks.isWin
   cleate_pause();
   startTimer();
}
function shuffle(arr) {
   var j, temp;
   for (var i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
   }
   return arr;
}
function timer_constructor() {
   let timer = document.createElement("span");
   timer.className = "timer";
   document.querySelector(".controller__timer").append(timer);
   let min = document.createElement("span");
   min.className = "timer__min";
   min.innerHTML = "00";
   document.querySelector(".timer").append(min);
   let dots = document.createElement("span");
   dots.innerHTML = ":";
   document.querySelector(".timer").append(dots);
   let sec = document.createElement("span");
   sec.className = "timer__sec";
   sec.innerHTML = "00";
   document.querySelector(".timer").append(sec);

}
function startTimer() {
   window.timerId = window.setInterval(setTimer, 10);
}
function setTimer() {
   timer.milisec++;
   if (timer.milisec === 100) {
      timer.sec++;
      timer.milisec = 0;
   }
   if (timer.sec === 60) {
      timer.sec = 0;
      timer.min++;
   }
   if (timer.sec < 10) {
      document.querySelector(".timer__sec").innerHTML = `0${timer.sec}`;
   } else { document.querySelector(".timer__sec").innerHTML = `${timer.sec}`; }
   if (timer.min < 10) {
      document.querySelector(".timer__min").innerHTML = `0${timer.min}`;
   } else { document.querySelector(".timer__min").innerHTML = `${timer.min}`; }
}