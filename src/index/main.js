import { $ } from 'jquery';
import gsap, { Bounce, Power1, Power4 } from 'gsap';
import exam from './exam.js';
import wrap from './loader.js';
import initProperties from './property.js';

function heartbeat() {
  if ("undefined" != typeof ec.plugin.hitokoto) {
    if (ec.properties.hitokoto.value == true) {
      if ($("li.hitokoto").html() == '') {
        ec.plugin.hitokoto.get();
      } else {
        ec.plugin.hitokoto.heartbeat();
      }
    } else if ($("li.hitokoto").html() != '') {
      $("li.hitokoto").html('');
    }
  }

  if (ec.exam.array[0]) {
    if (ec.exam.array[0].time.start - Time() < 0)
      if (
        ec.exam.array[0].time.end.getTime() &&
        ec.exam.array[0].time.end - Time() > 0
      );
      else {
        ec.exam.array.splice(0, 1);
        return;
      }
  } else location.reload();

  let current = ec.exam.array.find((exam) => exam.top == true) ?? ec.exam.array[0];
  setCurrent(current, current == ec.exam.array[0] && ec.exam.array.length > 1);
  setFuture(ec.exam.array.filter((exam) => exam != current));
}

function prefixer(num, n) {
  return (Array(n).join(0) + Math.floor(num)).slice(-n);
}

function setCurrent(exam, prefix = false) {
  document.title = exam.getTitle();
  $("li#current").html(
    (prefix ? "〇、" : "") + exam.getText()
  );
  t = (exam.getTime() / 1e3).toFixed(0);
  if (t < 0) t = -t;
  setCounters([s10, s0], t % 60);
  setCounters([m10, m0], (t /= 60) % 60);
  setCounters([h10, h0], (t /= 60) % 24);
  setCounters([d100, d10, d0], (t /= 24));
}

function setFuture(exams, breakon = undefined) {
  var html = '';
  if (exams.length > 0) {
    var items = [];
    for (i = 0; i < exams.length; i++) {
      var item = exams[i];
      items.push("<li>" + item.getText() + "</li>");
      if (typeof breakon == "string"
        && item.title.includes(breakon))
        break;
    }
    html = items.join('');
  }
  if ($("ol#future").html() != html) {
    $("ol#future").html(html);
  }
}

function setCounters(mcs, t) {
  mcs.forEach((mc, i) =>
    setCounter(mc, prefixer(t, mcs.length).substring(i, i + 1))
  );
}

function setCounter(mc, i) {
  if (mc.childNodes[0].innerText == i) return;
  mc.childNodes[1].innerHTML = mc.childNodes[2].innerHTML =
    mc.childNodes[0].innerHTML;
  mc.childNodes[0].innerHTML = mc.childNodes[3].innerHTML = `<span>${i}</span>`;
  gsap.fromTo(
    mc.childNodes[0],
    { alpha: 0 },
    {
      duration: 0.3,
      alpha: 1,
      ease: Power4.easeIn
    }
  );
  gsap.fromTo(
    mc.childNodes[1],
    { rotationX: 0 },
    {
      duration: 0.3,
      rotationX: -90,
      ease: Power1.easeIn
    }
  );
  gsap.fromTo(
    mc.childNodes[2],
    { alpha: 1 },
    {
      duration: 0.6,
      alpha: 0,
      ease: Bounce.easeOut,
      delay: 0.3
    }
  );
  gsap.fromTo(
    mc.childNodes[3],
    { rotationX: 90 },
    {
      duration: 0.5 + 0.2 * Math.random(),
      rotationX: 0,
      ease: Bounce.easeOut,
      delay: 0.3,
    }
  );
}

function initExam() {
  ec.exam = exam;
  ec.exam.json.push(ec.exam.default);
  ec.exam.build('高考');
}

function initWindow() {
  var cw = 1920,
    ch = 1080;

  $("body").width(`${cw}px`);
  $("body").height(`${ch}px`);
  $('ec').append(wrap);

  (window.onresize = () => {
    let w = window.innerWidth, h = window.innerHeight;
    let r = w / cw < h / ch ? w / cw : h / ch;
    $("body")[0].style.transform = `scale(${r})`;
    $("body")[0].style.marginLeft =
      -(cw - r * cw) / 2 + (w - r * cw) / 2 + "px";
    $("body")[0].style.marginTop = -(ch - r * ch) / 2 + (h - r * ch) / 2 + "px";
    $("body")[0].style.marginBottom = -(h > ch ? h : ch - r * ch) + "px";
    $("body")[0].style.marginRight = -(w > cw ? w : cw - r * cw) + "px";
  })();

  gsap.set(".upper", {
    rotationX: 0.01,
    transformOrigin: "50% 100%",
  });
  gsap.set(".lower", {
    rotationX: 0.01,
    transformOrigin: "50% 0%",
  });
}

export default () => {
  initProperties();
  initWindow();
  initExam();

  ec.start = (function () {
    if (typeof ec.stop != typeof undefined) ec.stop();
    let interval = setInterval(heartbeat, 1e2);
    ec.stop = (function () {
      clearInterval(interval);
      delete ec.stop;
    }).bind();
  }).bind();

  ec.start();
}