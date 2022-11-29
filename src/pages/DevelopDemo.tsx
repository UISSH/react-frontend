import { Hct } from "@material/material-color-utilities";
import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
} from "@material/material-color-utilities";

// Simple demonstration of HCT.

export default function Index({ className }: { className?: string }) {
  const color = Hct.fromInt(0xff4285f4);
  const theme = themeFromSourceColor(argbFromHex("#f82506"), [
    {
      name: "custom-1",
      value: argbFromHex("#ff0000"),
      blend: true,
    },
  ]);
  console.log(JSON.stringify(theme, null, 2));
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(theme, { target: document.body, dark: systemDark });

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div>
          <div> {`Hue: ${color.hue}`}</div>
          <div> {`chroma: ${color.chroma}`}</div>
          <div> {`Tone: ${color.tone}`}</div>
        </div>
      </div>
    </>
  );
}
