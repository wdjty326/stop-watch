describe("_코드가 정상적으로 실행되는지 확인", () => {
  beforeAll(() => {
    document.body.innerHTML = `
		<main class="stop-watch">
		<p class="stop-watch-timer">00:000</p>
		<div class="stop-watch-control">
		</div>
		<article class="stop-watch-lap-area">
			<ul class="stop-watch-lap-list"></ul>
		</article>
		</main>
		<template id="stop-watch-lap">
		<li data-lap="\${lap}">
			Lap \${idx} : \${lapTime}
		</li>
		</template>
		`;

    require("./stop-watch");
  });

  test("_버튼이 작성되는지 확인", () => {
    const startButton = document.getElementsByClassName("start-button")[0];
    expect(startButton).toBeDefined();
  });

  let count = 0;
  beforeEach(() => {
    jest.useFakeTimers();

    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => setTimeout(() => cb(100 * ++count), 100));
  });

  test("_시작버튼이 실행되는지 확인", () => {
    const startButton = document.getElementsByClassName("start-button")[0];
    startButton.dispatchEvent(new Event("click"));

    const timer = document.getElementsByClassName("stop-watch-timer")[0];

    expect(timer).toBeDefined();
    expect(count).not.toEqual(0);
  });

  afterEach(() => {
	count = 0;
    window.requestAnimationFrame.mockRestore();
    jest.clearAllTimers();
  });
});
