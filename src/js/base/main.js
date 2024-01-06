$().ready(() => {
  var interval,
    cw = 1920,
    ch = 1080;

  $("body").width(`${cw}px`);
  $("body").height(`${ch}px`);

  window.onresize = () => {
    let w = window.innerWidth,
      h = window.innerHeight;
    let r = w / cw < h / ch ? w / cw : h / ch;
    $("body")[0].style.transform = `scale(${r})`;
    $("body")[0].style.marginLeft =
      -(cw - r * cw) / 2 + (w - r * cw) / 2 + "px";
    $("body")[0].style.marginTop = -(ch - r * ch) / 2 + (h - r * ch) / 2 + "px";
    $("body")[0].style.marginBottom = -(h > ch ? h : ch - r * ch) + "px";
    $("body")[0].style.marginRight = -(w > cw ? w : cw - r * cw) + "px";
  };

  window.onunload = () => {
    if (interval) {
      clearInterval(interval);
    }
  };

  window.onresize();

  TweenMax.set(".upper", {
    rotationX: 0.01,
    transformOrigin: "50% 100%",
  });
  TweenMax.set(".lower", {
    rotationX: 0.01,
    transformOrigin: "50% 0%",
  });

  ec.exam.json.push({
    title: "福建高考",
    time: {
      start: "$YYYY/06/07 09:00",
      end: "$YYYY/06/10 16:30",
    },
    top: true,
  });

  ec.exam.build('高考');
  interval = setInterval(heartbeat, 1e2);

  ec.extension.fetch(6);
});
