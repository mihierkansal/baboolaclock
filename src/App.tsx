import {
  Accessor,
  createMemo,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js";

import "hacktimer";

function App() {
  const tab = createSignal<"clock" | "timer" | "stopwatch">("clock");

  return (
    <>
      <div class="menu">
        <div
          onClick={() => {
            tab[1]("clock");
          }}
          class={`menu-item ${tab[0]() === "clock" ? "active" : ""}`}
        >
          Clock
        </div>
        <div
          onClick={() => {
            tab[1]("timer");
          }}
          class={`menu-item ${tab[0]() === "timer" ? "active" : ""}`}
        >
          Timer
        </div>
        <div
          onClick={() => {
            tab[1]("stopwatch");
          }}
          class={`menu-item ${tab[0]() === "stopwatch" ? "active" : ""}`}
        >
          Stopwatch
        </div>
      </div>
      <Switch>
        <Match when={tab[0]() === "clock"}>
          <Clock />
        </Match>
        <Match when={tab[0]() === "timer"}>
          <Timer />
        </Match>
        <Match when={tab[0]() === "stopwatch"}>
          <Stopwatch />
        </Match>
      </Switch>
    </>
  );
}
function Timer() {
  const milliseconds = createSignal(0);

  const hours = createMemo(() => {
    return getTimeComponents(milliseconds[0]()).hours;
  });

  const minutes = createMemo(() => {
    return getTimeComponents(milliseconds[0]()).minutes;
  });

  const seconds = createMemo(() => {
    return getTimeComponents(milliseconds[0]()).seconds;
  });

  const beeping = createSignal(false);

  let interval: ReturnType<typeof setInterval>;

  const audio = new Audio("/beep.mp3");
  audio.loop = true;

  return (
    <>
      <div class="clock metal">
        <div class="logo">BABOOLA</div>
        <div class={`light ${beeping[0]() ? "blinking" : ""}`}></div>
        <div
          class="btns-cnt"
          style={{
            "margin-top": "0",
            "margin-bottom": "1rem",
          }}
        >
          <button
            class="btn"
            onClick={() => {
              milliseconds[1](milliseconds[0]() + 1000 * 60 * 60);
            }}
          >
            HR +
          </button>
          <button
            class="btn"
            onClick={() => {
              milliseconds[1](milliseconds[0]() + 1000 * 60);
            }}
          >
            MIN +
          </button>
          <button
            class="btn"
            onClick={() => {
              milliseconds[1](milliseconds[0]() + 1000);
            }}
          >
            SEC +
          </button>
        </div>
        <div class="rollers-cnt">
          <RollingNumbersDisplay len={2} value={hours} />
          :
          <RollingNumbersDisplay len={2} value={minutes} />
          :
          <RollingNumbersDisplay len={2} value={seconds} />
        </div>
        <div class="btns-cnt">
          <button
            class="btn"
            onClick={() => {
              milliseconds[1](milliseconds[0]() - 1000 * 60 * 60);
            }}
          >
            HR -
          </button>
          <button
            class="btn"
            onClick={() => {
              milliseconds[1](milliseconds[0]() - 1000 * 60);
            }}
          >
            MIN -
          </button>
          <button
            class="btn"
            onClick={() => {
              milliseconds[1](milliseconds[0]() - 1000);
            }}
          >
            SEC -
          </button>
        </div>

        <div
          class="btns-cnt"
          style={{
            "grid-template-columns": "1fr 1fr",
          }}
        >
          <button
            class="btn danger"
            onClick={() => {
              clearInterval(interval);
              audio.currentTime = 0;
              audio.pause();
              beeping[1](false);
            }}
          >
            STOP
          </button>

          <button
            class="btn primary"
            onClick={() => {
              clearInterval(interval);
              interval = setInterval(() => {
                if (milliseconds[0]() > 0) {
                  milliseconds[1](milliseconds[0]() - 10);
                } else {
                  clearInterval(interval);
                  beeping[1](true);
                  audio.play();
                }
              }, 10);
            }}
          >
            START
          </button>
        </div>
      </div>
    </>
  );
}
function Stopwatch() {
  const rawmilliseconds = createSignal(0);

  let interval: ReturnType<typeof setInterval>;

  const hours = createMemo(() => getTimeComponents(rawmilliseconds[0]()).hours);

  const minutes = createMemo(
    () => getTimeComponents(rawmilliseconds[0]()).minutes
  );

  const seconds = createMemo(
    () => getTimeComponents(rawmilliseconds[0]()).seconds
  );
  const displayMilliseconds = createMemo(
    () => getTimeComponents(rawmilliseconds[0]()).remainingMilliseconds
  );

  return (
    <>
      <div class="clock metal">
        <div class="logo">BABOOLA</div>
        <div class="rollers-cnt">
          <RollingNumbersDisplay len={2} value={hours} />:
          <RollingNumbersDisplay len={2} value={minutes} />:
          <RollingNumbersDisplay len={2} value={seconds} />:
          <RollingNumbersDisplay fast len={3} value={displayMilliseconds} />
        </div>
        <div class="btns-cnt">
          <button
            class="btn danger"
            onClick={() => {
              rawmilliseconds[1](0);
              clearInterval(interval);
            }}
          >
            RESET
          </button>
          <button
            class="btn primary"
            onClick={() => {
              clearInterval(interval);
              interval = setInterval(() => {
                rawmilliseconds[1](rawmilliseconds[0]() + 10);
              }, 10);
            }}
          >
            START
          </button>
          <button
            class="btn"
            onClick={() => {
              clearInterval(interval);
            }}
          >
            STOP
          </button>
        </div>
      </div>
    </>
  );
}
function Clock() {
  const hour = createSignal(new Date().getHours());
  const minute = createSignal(new Date().getMinutes());
  const second = createSignal(new Date().getSeconds());

  const tick = () => {
    const date = new Date();
    hour[1](convertTo12Hour(date.getHours()));
    minute[1](date.getMinutes());
    second[1](date.getSeconds());
  };

  tick();

  setInterval(tick, 1000);

  return (
    <>
      <div class="clock metal ">
        <div class="logo">BABOOLA</div>
        <div class="rollers-cnt">
          <RollingNumbersDisplay len={2} value={hour[0]} />
          :
          <RollingNumbersDisplay len={2} value={minute[0]} />
          :
          <RollingNumbersDisplay len={2} value={second[0]} />
        </div>
      </div>
    </>
  );
}
function RollingNumbersDisplay(props: {
  len: number;
  value: Accessor<number>;
  fast?: boolean;
}) {
  return (
    <>
      <For each={new Array(props.len).fill(0)}>
        {(_, i) => {
          const v = createMemo(() => {
            return Number(
              props.value().toString().padStart(props.len, "0")[i()]
            );
          });
          return (
            <>
              <RollingNumberDisplay fast={props.fast} value={v} />
            </>
          );
        }}
      </For>
    </>
  );
}
function RollingNumberDisplay(props: {
  value: Accessor<number>;
  fast?: boolean;
}) {
  const FONT_SIZE = 50;
  return (
    <>
      <div class={"rolling-display"}>
        <div
          class={"numbers-cnt" + (props.fast ? " fast" : "")}
          style={{
            display: "flex",
            "flex-direction": "column",
            "margin-top": `-${FONT_SIZE * props.value()}px`,
          }}
        >
          <For each={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}>
            {(item) => {
              return (
                <div class="number-cnt">
                  <div class="number">{item}</div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
}
function convertTo12Hour(hour24: number) {
  const hour12 = hour24 % 12 || 12; // Convert 0 (midnight) to 12 and handle afternoon hours
  return hour12;
}
function getTimeComponents(milliseconds: number) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  const remainingMilliseconds = milliseconds % 1000;

  return { hours, minutes, seconds, remainingMilliseconds };
}
export default App;
