import { Accessor, createMemo, createSignal, For } from "solid-js";

function App() {
  const hour = createSignal(new Date().getHours());
  const minute = createSignal(new Date().getMinutes());
  const second = createSignal(new Date().getSeconds());

  setInterval(() => {
    const date = new Date();
    hour[1](convertTo12Hour(date.getHours()));
    minute[1](date.getMinutes());
    second[1](date.getSeconds());
  }, 1000);

  return (
    <>
      <div class="clock metal linear">
        <div class="logo">BABOOLA</div>
        <div class="rollers-cnt">
          <div style={{ display: "flex" }}>
            <RollingNumbersDisplay len={2} value={hour[0]} />
            :
            <RollingNumbersDisplay len={2} value={minute[0]} />
            :
            <RollingNumbersDisplay len={2} value={second[0]} />
          </div>
        </div>
      </div>
    </>
  );
}
function RollingNumbersDisplay(props: {
  len: number;
  value: Accessor<number>;
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
              <RollingNumberDisplay value={v} />
            </>
          );
        }}
      </For>
    </>
  );
}
function RollingNumberDisplay(props: { value: Accessor<number> }) {
  const FONT_SIZE = 50;
  return (
    <>
      <div class="rolling-display">
        <div
          class="numbers-cnt"
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
export default App;
