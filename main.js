import { datas } from "./exporsr.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const togglplay = $(".btn-toggle-play");
const cdthumb = $(".cd-thumb");
const audio = $("#audio");
const btnnext = $(".btn-next");
const progress = $("#progress");
const player = $(".player");
const btnrepeat = $(".btn-repeat");
const btnrandom = $(".btn-random");
const playlist = $(".playlist");
const toasty = document.querySelector(".toasty");

const tableswith = $(".tableswith");
const data = datas;
const app = {
  indexsong: 1,
  isplaying: false,
  isrepet: false,
  valueprogram: 0,
  song: data,
  israndom: false,

  render: function () {
    const playlist = $(".playlist");
    playlist.innerHTML = "";
    const htmls = this.song?.map(
      (item, index) =>
        ` <div class="song ${
          this.indexsong == index ? "active" : ""
        }" data-index = "${index}">
            <div
              class="thumb"
              style="
                background-image: url('${item.img}');
              "
            ></div>
            <div class="body">
              <h3 class="title">${item.name}</h3>
              <p class="author">${item.sing}</p>
              <div class= "wave"></div>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
    );
    playlist.innerHTML = htmls;
  },

  rendersong: function () {
    let songs = this.song[this.indexsong];
    $(".dashboard h2").innerHTML = songs.sing;
    $(".cd-thumb").style.backgroundImage = `url(${songs.img})`;
    audio.src = songs.path;
    progress.value = this.valueprogram;
    document.title = songs.name;


    audio.onloadedmetadata = function () {
        console.log('e');
    };
  },

  handleeven: function () {
    const _this = this;
    const cdtthums = cdthumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    // /cd
    const cd = $(".cd");
    const cdwith = cd.offsetWidth;
    document.onscroll = function (e) {
      const scrooly = window.scrollY;
      const newcdwith = cdwith - scrooly;
      cd.style.width = newcdwith > 0 ? newcdwith + "px" : 0;
    };
    cdtthums.pause();
    //when user click
    togglplay.onclick = () => {
      if (!_this.isplaying) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    //update time
    audio.ontimeupdate = function () {
      const indexpro = Math.floor((audio.currentTime / audio.duration) * 100);

      if (audio.currentTime) {
        progress.value = indexpro;
      }
    };

    // sử lý audio
    audio.onpause = function () {
      _this.isplaying = false;
      cdtthums.pause();
      player.classList.remove("playing");
      _this.iswave();
    };
    //inplayting
    audio.onplay = function () {
      _this.isplaying = true;
      cdtthums.play();
      player.classList.add("playing");
      cd.style.width = "200px";
      _this.iswave(_this.indexsong);
    };
    //btn next
    btnnext.onclick = function () {
      _this.nextsong();
    };
    //btn next
    $(".btn-prev").onclick = function () {
      _this.prevsong();
    };

    // khi tua oninput
    progress.oninput = function (e) {
      const seek = (audio.duration / 100) * e.target.value;
      audio.currentTime = seek;
    };
    //when ended
    audio.onended = function () {
      if (_this.isrepet) {
        audio.play();
      } else if (_this.israndom) {
        _this.israndomsong();
      } else {
        _this.nextsong();
      }
    };
    //rêpct
    btnrepeat.onclick = function () {
      _this.isrepet = !_this.isrepet;
      this.classList.toggle("active");
      _this.israndom = false;
      btnrandom.classList.remove("active");
    };
    //when click song
    playlist.onclick = function (e) {
      const songElement = e.target.closest(".song:not(.active)");

      if (songElement || e.target.closest(".option")) {
        if (songElement) {
          _this.indexsong = songElement.dataset.index;
          _this.selectsong(_this.indexsong);
          _this.rendersong();
          audio.play();
        }

        if (e.target.closest(".option")) {
          console.log("bạn đã bấm vào nút 3 chấm");
        }
      }
    };

    //wheen click random()
    btnrandom.addEventListener("click", function () {
      _this.israndom = !_this.israndom;
      _this.isrepet = false;
      this.classList.toggle("active", _this.israndom);
      btnrepeat.classList.remove("active");
    });

    //tableswith
    tableswith.onclick = function () {
      player.classList.add("tablewith");
    };
  },
  //is next song
  nextsong: function () {
    this.indexsong++;
    if (this.indexsong >= this.song.length) {
      this.indexsong = 0;
    }
    this.rendersong();
    this.selectsong(this.indexsong);
    audio.play();
    this.iswave(this.indexsong);
  },

  //is prive song

  prevsong: function () {
    this.indexsong--;
    if (this.indexsong < 0) {
      this.indexsong = this.song.length - 1;
    }
    this.rendersong();
    this.selectsong(this.indexsong);
    audio.play();
    this.iswave(this.indexsong);
  },

  //SELECT song
  selectsong: function (index) {
    const select = $$(".song");
    select.forEach((e) => {
      e.classList.remove("active");
      player.classList.remove("tablewith");
    });
    select[index].classList.add("active");
    //
  },
  //scrllsong
  scroollactive: function () {
    setTimeout(() => {
      const pkay = $(".song.active");
      pkay.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  //init
  israndomsong: function () {
    let randomindex;
    do {
      randomindex = Math.floor(Math.random() * this.song.length);
    } while (randomindex === this.indexsong);
    this.indexsong = randomindex;
    this.render();
    this.rendersong();
    audio.play();
  },

  iswave: function (s) {
    let wave = $$(".wave");
    wave.forEach((item) => {
      item.classList.remove("activesong");
    });
    if (this.isplaying) {
      wave[s].classList.add("activesong");
    } 
  },
  start: function () {
    this.render();
    this.rendersong();
    this.handleeven();
  },
};

app.start();
