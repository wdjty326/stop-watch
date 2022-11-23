// `Number` 에 `StopWatch` 포맷 구현
Number.prototype.toStopWatch = function () {
  const self = Math.floor(this < 0 ? 0 : this);

  const s = `00${Math.floor(self / 1000)}`.slice(-2);
  const ms = `00${self % 1000}`.slice(-3);

  return `${s}:${ms}`;
};

// `HTMLCollection`에 `forEach` 구현
//HTMLCollection.prototype.forEach = function (callback) {
//  const self = this;
//  let i = 0;
//  for (const element of self) {
//    callback(element, i++);
//  }
//};

// 즉시실행
//(function () {
/**
 * 타이머 상태
 * 0 - 대기 상태
 * 1 - 타이머 진행중
 * 2 - 타이머 일시정지
 */
let readyState = 0;

/**
 * startTimestamp: 시작시간위치
 * pauseTimestamp: 일시정지시간위치
 * processTimestamp: 현재시간위치
 */
let startTimestamp = 0,
  pauseTimestamp = 0,
  processTimestamp = 0;

const stopWatchTimer = document.getElementsByClassName("stop-watch-timer")[0];

const lapList = [];

const stopWatchAnimationFrame = (timestamp) => {
  if (!startTimestamp) startTimestamp = timestamp;

  // `requestAnimationFrame`은 이벤트가 멈춘상태에서도 `timestamp`는 계속 변경되기 때문에
  // `pause` 상태에서 재시작시 `pause`에서 현재 `timestamp`만큼 제외한 뒤에 시간계산이 필요
  if (pauseTimestamp) {
    startTimestamp += timestamp - pauseTimestamp;
    pauseTimestamp = 0;
  }

  processTimestamp = Math.floor(timestamp - startTimestamp);
  renderStopWatch();

  switch (readyState) {
    case 1:
      window.requestAnimationFrame(stopWatchAnimationFrame);
      break;
    case 2:
      pauseTimestamp = timestamp;
      break;
    default:
      startTimestamp = 0;
      pauseTimestamp = 0;
      break;
  }
};

//  const addClickEventListenerByClass = (className, callback) => {
//    document.getElementsByClassName(className).forEach((el) => {
//      el.addEventListener("click", callback);
//    });
//  };

const startWatch = () => {
  setReadyState(1);
  window.requestAnimationFrame(stopWatchAnimationFrame);
};

const pauseWatch = () => {
  setReadyState(2);
};

const resetWatch = () => {
  setReadyState(0);

  startTimestamp = 0;
  pauseTimestamp = 0;
  processTimestamp = 0;

  lapList.length = 0;

  renderStopWatch();
  renderLapList();
};

const writeLap = () => {
  lapList.push(processTimestamp);
  renderLapList();
};

const setReadyState = (state) => {
  readyState = state;
  renderReadyState();
};

const renderButton = (className, text, onClick) => {
  const button = document.createElement("button");
  button.className = className;
  button.onclick = onClick;
  button.append(text);

  return button;
};

const renderReadyState = () => {
  const docFrag = document.createDocumentFragment();

  const stopWatchControl =
    document.getElementsByClassName("stop-watch-control")[0];
  const div = document.createElement("div");
  div.className = "stop-watch-control";

  switch (readyState) {
    case 0:
      div.append(renderButton("start-button", "시작", startWatch));
      break;
    case 1:
      div.append(
        renderButton("lap-button", "랩기록", writeLap),
        renderButton("pause-button", "일시정지", pauseWatch),
        renderButton("reset-button", "초기화", resetWatch)
      );
      break;
    case 2:
      div.append(
        renderButton("start-button", "재시작", startWatch),
        renderButton("reset-button", "초기화", resetWatch)
      );
      break;
  }
  docFrag.append(div);
  stopWatchControl.replaceWith(docFrag);
};

const renderStopWatch = () => {
  stopWatchTimer.innerHTML = processTimestamp.toStopWatch();
};

const renderLapList = () => {
  const stopWatchLapList = document.getElementsByClassName(
    "stop-watch-lap-list"
  )[0];

  // 리셋
  if (lapList.length === 0) return (stopWatchLapList.innerHTML = "");

  const minLap = lapList.reduce((a, b) => Math.min(a, b));
  const maxLap = lapList.reduce((a, b) => Math.max(a, b));

  let template = document.getElementById("stop-watch-lap").innerHTML;
  template = template.substring(
    template.indexOf("<"),
    template.lastIndexOf(">") + 1
  );

  const docFrag = document.createDocumentFragment();
  const range = document.createRange();

  const ul = document.createElement("ul");
  ul.className = "stop-watch-lap-list";

  lapList.forEach((value, idx) => {
    const li = range.createContextualFragment(
      template
        .replace(
          /\${className}/g,
          minLap === value ? "min-lap" : maxLap === value ? "max-lap" : ""
        )
        .replace(/\${lap}/g, value)
        .replace(/\${idx}/g, idx)
        .replace(/\${lapTime}/g, value.toStopWatch())
    );

    ul.appendChild(li);
  });
  docFrag.appendChild(ul);
  stopWatchLapList.replaceWith(docFrag);
};

//  addClickEventListenerByClass("start-button", startWatch);
//  addClickEventListenerByClass("pause-button", pauseWatch);
//  addClickEventListenerByClass("reset-button", resetWatch);

//  addClickEventListenerByClass("lap-button", writeLap);
renderReadyState();
//})();
