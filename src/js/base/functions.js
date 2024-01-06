function buildExam(json) {
  if (typeof json.time.start === typeof undefined) return null;
  if (typeof json.time.end === typeof undefined)
    json.time.end = json.time.start;
  json.time = autoYear(json.time);
  let exam = {
    title: json.title,
    time: { start: new Date(json.time.start), end: new Date(json.time.end) },
    top: json.top,
  };
  exam.title = exam.title.replace("$YYYY", exam.time.start.getFullYear());
  if (exam.time.start.getTime()) return new Exam(exam);
  else return null;
}

function autoYear(time) {
  let year = new Date().getFullYear();
  if (new Date() > new Date(time.end.replace("$YYYY", year))) year++;
  time.start = time.start.replace("$YYYY", year);
  time.end = time.end.replace("$YYYY", year);
  return time;
}

function heartbeat() {
  if (ec.hitokoto) ec.hitokoto.heartbeat();

  if (ec.exam.array[0]) {
    if (ec.exam.array[0].time.start - new Date() < 0)
      if (
        ec.exam.array[0].time.end.getTime() &&
        ec.exam.array[0].time.end - new Date() > 0
      );
      else {
        ec.exam.array.splice(0, 1);
        ec.exam.sort();
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
  if (exams.length > 0) {
    var items = [];
    for (i = 0; i < exams.length; i++) {
      var item = exams[i];
      items.push("<li>" + item.getText() + "</li>");
      if (typeof breakon == "string"
        && item.title.includes(breakon))
        break;
    }
    $("ol#future").html(items.join(""));
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
  TweenMax.fromTo(
    mc.childNodes[0],
    { alpha: 0 },
    { duration: 0.3, alpha: 1, ease: Power4.easeIn }
  );
  TweenMax.fromTo(
    mc.childNodes[1],
    { rotationX: 0 },
    { duration: 0.3, rotationX: -90, ease: Power1.easeIn }
  );
  TweenMax.fromTo(
    mc.childNodes[2],
    { alpha: 1 },
    { duration: 0.6, alpha: 0, ease: Bounce.easeOut, delay: 0.3 }
  );
  TweenMax.fromTo(
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

function setBackground(url) {
  if (document.body)
    document.body.style.backgroundImage = `url('${url}')`;
  else
    console.warn(`Body is ${typeof document.body}`);
}
