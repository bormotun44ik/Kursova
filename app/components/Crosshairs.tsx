export default function Crosshairs() {
  const d = "M0 0 V10 M0 5 H10";
  return (
    <>
      <svg className="crosshair tl" viewBox="0 0 12 12"><path d={d} /></svg>
      <svg className="crosshair tr" viewBox="0 0 12 12"><path d={d} /></svg>
      <svg className="crosshair bl" viewBox="0 0 12 12"><path d={d} /></svg>
      <svg className="crosshair br" viewBox="0 0 12 12"><path d={d} /></svg>
    </>
  );
}
