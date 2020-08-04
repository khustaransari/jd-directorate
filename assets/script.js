// ——————————————————————————————————————————————————
// TextScramble
// ——————————————————————————————————————————————————

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrases = ["Joint Director", "U.P. West ", "MEERUT REGION"];

const el = document.querySelector(".text");
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 2000);
  });
  counter = (counter + 1) % phrases.length;
};

next();

jQuery.fn.liScroll = function (settings) {
  settings = jQuery.extend(
    {
      travelocity: 0.01,
    },
    settings
  );
  return this.each(function () {
    var $strip = jQuery(this);
    $strip.addClass("newsticker");
    var stripHeight = 1;
    $strip.find("li").each(function (i) {
      stripHeight += jQuery(this, i).outerHeight(true); // thanks to Michael Haszprunar and Fabien Volpi
    });
    var $mask = $strip.wrap("<div class='mask'></div>");
    var $tickercontainer = $strip
      .parent()
      .wrap("<div class='tickercontainer'></div>");
    var containerHeight = $strip.parent().parent().height(); //a.k.a. 'mask' width
    $strip.height(stripHeight);
    var totalTravel = stripHeight;
    var defTiming = totalTravel / settings.travelocity; // thanks to Scott Waye
    function scrollnews(spazio, tempo) {
      $strip.animate({ top: "-=" + spazio }, tempo, "linear", function () {
        $strip.css("top", containerHeight);
        scrollnews(totalTravel, defTiming);
      });
    }
    scrollnews(totalTravel, defTiming);
    $strip.hover(
      function () {
        jQuery(this).stop();
      },
      function () {
        var offset = jQuery(this).offset();
        var residualSpace = offset.top + stripHeight;
        var residualTime = residualSpace / settings.travelocity;
        scrollnews(residualSpace, residualTime);
      }
    );
  });
};

$(function () {
  $("ul#ticker01").liScroll();
});

const josh = new Josh();
